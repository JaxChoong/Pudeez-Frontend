import { SuiClient, SuiObjectResponse, PaginatedObjectsResponse } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';


export class SuiRpcClient {
    private client: SuiClient;

    constructor(c: SuiClient) {
        this.client = c;
    }

    /**
     * List all objects owned by an address
     * @param address - The Sui address to query objects for
     * @param cursor - Optional cursor for pagination
     * @param limit - Optional limit for number of objects to return (default: 50)
     * @returns Promise containing the paginated objects response
     */
    async listObjectsOwnedByAddress(
        address: string,
        cursor?: string,
        limit: number = 50
    ): Promise<PaginatedObjectsResponse> {
        try {
            const result = await this.client.getOwnedObjects({
                owner: address,
                cursor,
                limit,
                options: {
                    showType: true,
                    showOwner: true,
                    showPreviousTransaction: true,
                    showDisplay: true,
                    showContent: true,
                    showBcs: true,
                    showStorageRebate: true,
                },
            });

            return result;
        } catch (error) {
            console.error('Error fetching owned objects:', error);
            throw new Error(`Failed to fetch objects for address ${address}: ${error}`);
        }
    }

    /**
     * Get detailed information for specific objects
     * @param objectIds - Array of object IDs to fetch details for
     * @returns Promise containing array of object data
     */
    async getObjectDetails(objectIds: string[]): Promise<SuiObjectResponse[]> {
        try {
            const result = await this.client.multiGetObjects({
                ids: objectIds,
                options: {
                    showType: true,
                    showOwner: true,
                    showPreviousTransaction: true,
                    showDisplay: true,
                    showContent: true,
                    showBcs: true,
                    showStorageRebate: true,
                },
            });

            return result;
        } catch (error) {
            console.error('Error fetching object details:', error);
            throw new Error(`Failed to fetch object details: ${error}`);
        }
    }

    /**
     * Execute a Programmable Transaction Block (PTB) on the Sui network
     * @param keypair - The keypair to sign the transaction
     * @param transactionBlock - The transaction block to execute
     * @param options - Optional execution options
     * @returns Promise containing the transaction result
     */
    async executePTB(
        keypair: Ed25519Keypair,
        transaction: Transaction,
        options: {
            showInput?: boolean;
            showRawInput?: boolean;
            showEffects?: boolean;
            showEvents?: boolean;
            showObjectChanges?: boolean;
            showBalanceChanges?: boolean;
        } = {}
    ) {
        try {
            // Set default options
            const executeOptions = {
                showInput: true,
                showRawInput: false,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
                showBalanceChanges: true,
                ...options,
            };

            // Execute the transaction block
            const result = await this.client.signAndExecuteTransaction({
                signer: keypair,
                transaction,
                options: executeOptions,
                requestType: 'WaitForLocalExecution',
            });

            return result;
        } catch (error) {
            console.error('Error executing PTB:', error);
            throw new Error(`Failed to execute transaction block: ${error}`);
        }
    }

    /**
     * Create a new transaction block with common setup
     * @returns A new Transaction instance
     */
    createTransaction(): Transaction {
        return new Transaction();
    }

    /**
     * Get the current gas price
     * @returns Promise containing the reference gas price
     */
    async getGasPrice(): Promise<string> {
        try {
            const gasPrice = await this.client.getReferenceGasPrice();
            return gasPrice.toString();
        } catch (error) {
            console.error('Error fetching gas price:', error);
            throw new Error(`Failed to fetch gas price: ${error}`);
        }
    }

    /**
     * Get the Sui client instance for advanced operations
     * @returns The underlying SuiClient instance
     */
    getClient(): SuiClient {
        return this.client;
    }
}

// Example usage:
/*
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

const client = new SuiRpcClient({ network: 'testnet' });

// List objects owned by an address
const objects = await client.listObjectsOwnedByAddress('0x...');

// Create and execute a PTB
const keypair = new Ed25519Keypair();
const txb = client.createTransaction();

// Add operations to your transaction block
// txb.moveCall({ ... });

const result = await client.executePTB(keypair, txb);
*/
