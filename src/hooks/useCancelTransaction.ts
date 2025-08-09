import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useState } from 'react';

// Escrow package details from testnet deployment
const ESCROW_PACKAGE_ID = import.meta.env.VITE_ESCROW_PACKAGE_ID || "0x48d4ccd81159212812ac85b3dbf5359a3170c0254888d4a65e07f0e5af4cb667";

// Cancel transaction hook
export function useCancelTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  // Find locked payment and key objects owned by the buyer
  const findLockedPaymentAndKey = async (escrowId: string) => {
    if (!currentAccount?.address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Get all objects owned by the current user
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        options: {
          showType: true,
          showContent: true,
        },
      });

      console.log('Searching for locked payment and key objects...');
      console.log('Total owned objects:', ownedObjects.data.length);
      console.log('Package ID we are looking for:', ESCROW_PACKAGE_ID);

      // Log all object types for debugging
      ownedObjects.data.forEach((obj, index) => {
        if (obj.data?.type) {
          console.log(`Object ${index}:`, obj.data.type, 'ID:', obj.data.objectId);
        }
      });

      // Look for Locked<Coin<SUI>> and Key objects
      let lockedPayments: Array<{id: string, type: string}> = [];
      let keys: Array<{id: string, type: string}> = [];

      // Define the expected type patterns
      const lockedPaymentPattern = `${ESCROW_PACKAGE_ID}::lock::Locked<0x2::coin::Coin<0x2::sui::SUI>>`;
      const keyPattern = `${ESCROW_PACKAGE_ID}::lock::Key`;

      console.log('Looking for locked payment type:', lockedPaymentPattern);
      console.log('Looking for key type:', keyPattern);

      for (const obj of ownedObjects.data) {
        if (obj.data?.type) {
          const objType = obj.data.type;
          
          // Check for Locked<Coin<SUI>> object type
          if (objType === lockedPaymentPattern) {
            lockedPayments.push({id: obj.data.objectId, type: objType});
            console.log('Found locked payment (exact match):', obj.data.objectId);
          }
          // Also try with a more flexible pattern
          else if (objType.includes(`${ESCROW_PACKAGE_ID}::lock::Locked`) && 
                   objType.includes('0x2::coin::Coin') && 
                   objType.includes('0x2::sui::SUI')) {
            lockedPayments.push({id: obj.data.objectId, type: objType});
            console.log('Found locked payment (flexible match):', obj.data.objectId, 'type:', objType);
          }
          
          // Check for Key object
          if (objType === keyPattern) {
            keys.push({id: obj.data.objectId, type: objType});
            console.log('Found key (exact match):', obj.data.objectId);
          }
          // Also try with flexible pattern
          else if (objType.includes(`${ESCROW_PACKAGE_ID}::lock::Key`)) {
            keys.push({id: obj.data.objectId, type: objType});
            console.log('Found key (flexible match):', obj.data.objectId, 'type:', objType);
          }
        }
      }

      console.log('Found locked payments:', lockedPayments);
      console.log('Found keys:', keys);

      if (lockedPayments.length === 0 || keys.length === 0) {
        console.error('Could not find required objects. Available object types:');
        ownedObjects.data.forEach((obj) => {
          if (obj.data?.type) console.error(' -', obj.data.type, '(ID:', obj.data.objectId, ')');
        });
        throw new Error('Could not find locked payment or key objects. Make sure you have deposited payment for this escrow.');
      }

      // If we have multiple options, we need to find the matching pair
      // For now, let's try the first of each type and let the Move contract validate
      // In a production app, you'd want to store the locked payment and key IDs when deposit happens
      let selectedPayment = lockedPayments[0];
      let selectedKey = keys[0];

      // Try to get the locked object details to see if we can match them
      for (const payment of lockedPayments) {
        try {
          const lockedObjectDetails = await suiClient.getObject({
            id: payment.id,
            options: {
              showContent: true,
              showType: true,
            },
          });

          console.log('Checking locked object:', payment.id);
          console.log('Locked object details:', lockedObjectDetails);
          
          // The locked object should contain the key ID in its content
          if (lockedObjectDetails.data?.content && 'fields' in lockedObjectDetails.data.content) {
            const fields = lockedObjectDetails.data.content.fields as any;
            console.log('Locked object fields:', fields);
            
            // Look for the key field in the locked object
            if (fields.key) {
              const expectedKeyId = fields.key;
              console.log('Expected key ID from locked object:', expectedKeyId);
              
              // Find the key with matching ID
              const matchingKey = keys.find(k => k.id === expectedKeyId);
              if (matchingKey) {
                selectedPayment = payment;
                selectedKey = matchingKey;
                console.log('Found matching pair - Payment:', selectedPayment.id, 'Key:', selectedKey.id);
                break; // Found a matching pair, exit the loop
              } else {
                console.log('No matching key found for this locked payment');
              }
            } else {
              console.log('No key field found in locked object fields');
            }
          } else {
            console.log('No fields found in locked object content');
          }
        } catch (error) {
          console.warn('Could not get locked object details for', payment.id, ':', error);
        }
      }

      console.log('Final selection - Locked Payment ID:', selectedPayment.id, 'Key ID:', selectedKey.id);

      return { lockedPaymentId: selectedPayment.id, keyId: selectedKey.id };
    } catch (error) {
      console.error('Error finding locked payment and key:', error);
      throw error;
    }
  };

  // Verify inventory status before allowing cancel
  const verifyInventoryStatus = async (escrowId: string) => {
    setVerifying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/escrow/check-inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ escrowId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify inventory status');
      }

      const data = await response.json();
      setVerifying(false);
      
      return {
        canCancel: data.canCancel,
        hasTransferOccurred: data.hasTransferOccurred,
        message: data.message,
        currentSellerCount: data.currentSellerCount,
        currentBuyerCount: data.currentBuyerCount,
        initialSellerCount: data.initialSellerCount,
        initialBuyerCount: data.initialBuyerCount,
      };
    } catch (error) {
      setVerifying(false);
      throw error;
    }
  };

  // Cancel escrow and get refund (buyer only)
  const cancelEscrow = async (params: {
    escrowId: string;
    escrowObjectId: string;
  }) => {
    if (!currentAccount?.address) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Verify inventory status
      console.log('Verifying inventory status...');
      const inventoryStatus = await verifyInventoryStatus(params.escrowId);
      
      if (inventoryStatus.hasTransferOccurred) {
        // If transfer has occurred, mark escrow as completed instead of canceling
        throw new Error('TRANSFER_COMPLETED');
      }

      if (!inventoryStatus.canCancel) {
        throw new Error('Cannot cancel escrow at this time. Please check inventory status.');
      }

      console.log('Inventory verification passed:', inventoryStatus);

      // Step 2: Find locked payment and key objects
      console.log('Finding locked payment and key objects...');
      const { lockedPaymentId, keyId } = await findLockedPaymentAndKey(params.escrowId);

      // Step 3: Create cancel transaction
      const transaction = new Transaction();

      // Call the cancel function from the smart contract
      const result = transaction.moveCall({
        target: `${ESCROW_PACKAGE_ID}::steam_escrow::cancel`,
        arguments: [
          transaction.object(params.escrowObjectId), // escrow object
          transaction.object(lockedPaymentId), // locked payment object
          transaction.object(keyId), // payment key object
          transaction.pure.bool(false), // is_transferred (should be false for cancel)
        ],
      });

      // Transfer the refunded payment to the current user
      transaction.transferObjects([result], currentAccount.address);

      // Execute transaction
      const txResult = await signAndExecuteTransaction(
        { transaction: transaction as any },
        {
          onSuccess: (result) => {
            console.log('Escrow canceled successfully:', result);
          },
          onError: (error) => {
            console.error('Cancel transaction failed:', error);
            setError(error.message || 'Cancel transaction failed');
          },
        }
      );

      setLoading(false);
      return {
        ...txResult,
        inventoryStatus,
        message: 'Escrow canceled successfully! Your payment has been refunded.'
      };

    } catch (err: any) {
      setLoading(false);
      
      // Handle special case where transfer has already occurred
      if (err.message === 'TRANSFER_COMPLETED') {
        throw new Error('The escrow cannot be canceled because the asset transfer has already occurred. The escrow will be marked as completed.');
      }
      
      const errorMessage = err.message || 'Failed to cancel escrow';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    cancelEscrow,
    verifyInventoryStatus,
    loading,
    verifying,
    error,
  };
}
