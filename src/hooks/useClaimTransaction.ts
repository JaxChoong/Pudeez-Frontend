import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

// Escrow package details from testnet deployment
const ESCROW_PACKAGE_ID = import.meta.env.VITE_ESCROW_PACKAGE_ID || "0x48d4ccd81159212812ac85b3dbf5359a3170c0254888d4a65e07f0e5af4cb667";

// Claim transaction hook
export function useClaimTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  // Verify inventory transfer before allowing claim
  const verifyTransfer = async (escrowId: string) => {
    setVerifying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/escrow/${escrowId}/verify-transfer`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify transfer');
      }

      const data = await response.json();
      setVerifying(false);
      
      if (!data.success || !data.verification.isTransferred) {
        throw new Error(data.verification.message || 'Asset transfer not verified');
      }

      return data.verification;
    } catch (error) {
      setVerifying(false);
      throw error;
    }
  };

  // Claim payment from escrow (seller only)
  const claimPayment = async (params: {
    escrowId: string;
    escrowObjectId: string;
  }) => {
    if (!currentAccount?.address) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Verify that the asset transfer occurred
      console.log('Verifying asset transfer...');
      const verification = await verifyTransfer(params.escrowId);
      
      if (!verification.isTransferred) {
        throw new Error('Asset transfer not verified. Please ensure the buyer has received the asset via Steam trade.');
      }

      console.log('Asset transfer verified:', verification);

      // Step 2: Create claim transaction
      const transaction = new Transaction();

      // Call the claim function from the smart contract
      const result = transaction.moveCall({
        target: `${ESCROW_PACKAGE_ID}::steam_escrow::claim`,
        arguments: [
          transaction.object(params.escrowObjectId), // escrow object
          transaction.pure.bool(true), // is_transferred (verified by backend)
        ],
      });

      // Transfer any returned payment to the current user
      transaction.transferObjects([result], currentAccount.address);

      // Execute transaction
      const txResult = await signAndExecuteTransaction(
        { transaction: transaction as any },
        {
          onSuccess: (result) => {
            console.log('Payment claimed successfully:', result);
          },
          onError: (error) => {
            console.error('Claim transaction failed:', error);
            setError(error.message || 'Claim transaction failed');
          },
        }
      );

      setLoading(false);
      return {
        ...txResult,
        verification,
        message: 'Payment claimed successfully! The transaction has been completed.'
      };

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : "Claim transaction failed";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    claimPayment,
    verifyTransfer,
    loading,
    verifying,
    error,
  };
}
