import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

// Escrow package details from testnet deployment
const ESCROW_PACKAGE_ID = import.meta.env.VITE_ESCROW_PACKAGE_ID || "0x48d4ccd81159212812ac85b3dbf5359a3170c0254888d4a65e07f0e5af4cb667";

// Steam Trade URL regex validation
export const validateSteamTradeUrl = (url: string): boolean => {
  const steamTradeUrlRegex = /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9_-]+$/;
  return steamTradeUrlRegex.test(url.trim());
};

// Convert SUI amount to MIST (1 SUI = 1e9 MIST)
export const suiToMist = (suiAmount: number): bigint => {
  return BigInt(Math.floor(suiAmount * 1e9));
};

// Escrow transaction hook
export function useEscrowTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  // Helper function to get Steam inventory counts
  const getSteamInventoryCounts = async (steamId: string, appId: string, assetId: string, contextId: string = "2") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/steam/inventory/${steamId}?appid=${appId}&contextid=${contextId}`);
      if (!response.ok) {
        console.warn(`Failed to fetch Steam inventory for ${steamId}: ${response.status} ${response.statusText}`);
        return 0; // Default to 0 if API fails
      }
      
      const data = await response.json();
      if (!data.assets || !Array.isArray(data.assets)) {
        console.warn(`No assets found in Steam inventory for ${steamId}`);
        return 0;
      }
      
      // Count items with matching assetid
      const count = data.assets.filter((asset: any) => asset.assetid === assetId).length;
      console.log(`Found ${count} items with assetId ${assetId} for Steam ID ${steamId}`);
      return count;
    } catch (error) {
      console.warn(`Error fetching Steam inventory for ${steamId}:`, error);
      return 0; // Default to 0 on any error
    }
  };

  // Helper function to upload escrow data to Walrus
  const uploadEscrowDataToWalrus = async (escrowData: any): Promise<string> => {
    try {
      console.log('Attempting to upload escrow data to Walrus...');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/walrus/upload-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify(escrowData, null, 2),
          epochs: 5
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Walrus upload successful:', result.blobId);
        return result.blobId;
      } else {
        const errorText = await response.text();
        console.warn('Walrus upload failed:', response.status, errorText);
        throw new Error(`Walrus upload failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Walrus upload failed, generating fallback blob ID:', error);
      // Generate fallback blob ID with timestamp and random component
      const fallbackId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Using fallback blob ID:', fallbackId);
      return fallbackId;
    }
  };

  const createEscrow = async (params: {
    seller: string;
    assetId: string;
    assetName: string;
    assetAmount: number;
    tradeUrl: string;
    priceInSui: number;
    appId: string;
    contextId?: string;
    classId?: string;
    instanceId?: string;
    sellerSteamId?: string;
    buyerSteamId?: string;
  }) => {
    if (!currentAccount?.address) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      // Validate trade URL
      if (!validateSteamTradeUrl(params.tradeUrl)) {
        throw new Error("Invalid Steam Trade URL format");
      }

      // Get Steam inventory counts with better error handling
      let initialSellerItemCount = 1; // Default to 1 assuming seller has the item
      let initialBuyerItemCount = 0;  // Default to 0 for buyer

      console.log('Checking Steam inventories...');
      
      if (params.sellerSteamId) {
        console.log(`Checking seller inventory for Steam ID: ${params.sellerSteamId}`);
        initialSellerItemCount = await getSteamInventoryCounts(params.sellerSteamId, params.appId, params.assetId, params.contextId || "2");
      } else {
        console.log('No seller Steam ID provided, using default count of 1');
      }
      
      if (params.buyerSteamId) {
        console.log(`Checking buyer inventory for Steam ID: ${params.buyerSteamId}`);
        initialBuyerItemCount = await getSteamInventoryCounts(params.buyerSteamId, params.appId, params.assetId, params.contextId || "2");
      } else {
        console.log('No buyer Steam ID provided, using default count of 0');
      }

      console.log(`Inventory counts - Seller: ${initialSellerItemCount}, Buyer: ${initialBuyerItemCount}`);

      // Prepare escrow data for Walrus upload
      const escrowData = {
        buyer: currentAccount.address,
        seller: params.seller,
        assetId: params.assetId,
        assetName: params.assetName,
        assetAmount: params.assetAmount,
        tradeUrl: params.tradeUrl,
        priceInSui: params.priceInSui,
        appId: params.appId,
        classId: params.classId,
        instanceId: params.instanceId,
        sellerSteamId: params.sellerSteamId,
        buyerSteamId: params.buyerSteamId,
        initialSellerItemCount,
        initialBuyerItemCount,
        timestamp: new Date().toISOString(),
      };

      // Upload to Walrus
      const walrusBlobId = await uploadEscrowDataToWalrus(escrowData);

      // Create transaction
      const transaction = new Transaction();

      // Convert price to MIST
      const priceInMist = suiToMist(params.priceInSui);

      // Step 1: Create escrow (returns the escrow object)
      const [escrow] = transaction.moveCall({
        target: `${ESCROW_PACKAGE_ID}::steam_escrow::create_escrow`,
        arguments: [
          transaction.pure.address(currentAccount.address), // buyer
          transaction.pure.address(params.seller), // seller
          transaction.pure.vector('u8', Array.from(new TextEncoder().encode(params.assetId))), // asset_id
          transaction.pure.vector('u8', Array.from(new TextEncoder().encode(params.assetName))), // asset_name
          transaction.pure.u64(params.assetAmount), // asset_amount
          transaction.pure.vector('u8', Array.from(new TextEncoder().encode(params.tradeUrl))), // trade_url
          transaction.pure.u8(initialSellerItemCount), // initial_seller_item_count
          transaction.pure.u8(initialBuyerItemCount), // initial_buyer_item_count
          transaction.pure.u64(priceInMist), // price in MIST
        ],
      });

      // Step 2: Get the coin to use for payment
      const [coin] = transaction.splitCoins(transaction.gas, [priceInMist]);

      // Step 3: Deposit payment into escrow (returns locked payment and key)
      const [lockedPayment, key] = transaction.moveCall({
        target: `${ESCROW_PACKAGE_ID}::steam_escrow::deposit`,
        arguments: [
          escrow, // escrow object from step 1
          coin, // payment coin
        ],
      });

      // Step 4: Transfer escrow object to seller (they need it to claim payment)
      transaction.transferObjects([escrow], params.seller);

      // Step 5: Keep locked payment and key for monitoring (could transfer to backend or keep)
      transaction.transferObjects([lockedPayment, key], currentAccount.address);

      // Execute transaction
      const result = await signAndExecuteTransaction(
        { transaction: transaction as any },
        {
          onSuccess: (result) => {
            console.log('Escrow created successfully:', result);
            console.log('Walrus blob ID:', walrusBlobId);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            setError(error.message || 'Transaction failed');
          },
        }
      );

      setLoading(false);
      return { ...result, walrusBlobId };

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : "Transaction failed";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    createEscrow,
    loading,
    error,
  };
}
