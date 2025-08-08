import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID: string = "EwZkXeEGxC959RRWvz6o5n5SpAtqTXGuEvQ8CE35BZ9z";

export class SteamEscrowClient {
  private client: SuiClient;
  private signAndExecute: any;

  constructor(
    client: SuiClient, 
    signAndExecuteTransaction: any,
  ) {
    this.client = client;
    this.signAndExecute = signAndExecuteTransaction;
  }

  async createEscrow(params: {
    buyer: string;
    seller: string;
    assetId: string;
    assetName: string;
    assetAmount: number;
    tradeUrl: string;
    initialSellerCount: number;
    initialBuyerCount: number;
    price: number;
  }) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::steam_escrow::create_escrow`,
      arguments: [
        tx.pure.address(params.buyer),
        tx.pure.address(params.seller),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(params.assetId))),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(params.assetName))),
        tx.pure.u64(params.assetAmount),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(params.tradeUrl))),
        tx.pure.u8(params.initialSellerCount),
        tx.pure.u8(params.initialBuyerCount),
        tx.pure.u64(params.price),
      ],
    });
    
    const result = await this.signAndExecute(tx);
    console.log('Escrow created:', result.digest);
    return result;
  }

  async depositPayment(escrowObjectId: string, amount: number) {
    const tx = new Transaction();
    
    const [coin] = tx.splitCoins(tx.gas, [amount]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::steam_escrow::deposit`,
      arguments: [
        tx.object(escrowObjectId),
        coin,
      ],
    });
    
    const result = await this.signAndExecute(tx);
    console.log('Payment deposited:', result.digest);
    return result;
  }

  async claimPayment(
    escrowObjectId: string, 
    lockedPaymentId: string, 
    keyId: string,
    isTransferred: boolean = true
  ) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::steam_escrow::claim`,
      arguments: [
        tx.object(escrowObjectId),
        tx.object(lockedPaymentId),
        tx.object(keyId),
        tx.pure.bool(isTransferred),
      ],
    });
    
    const result = await this.signAndExecute(tx);
    console.log('Payment claimed:', result.digest);
    return result;
  }

  async cancelEscrow(
    escrowObjectId: string,
    lockedPaymentId: string,
    keyId: string,
    isTransferred: boolean = false
  ) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::steam_escrow::cancel`,
      arguments: [
        tx.object(escrowObjectId),
        tx.object(lockedPaymentId),
        tx.object(keyId),
        tx.pure.bool(isTransferred),
      ],
    });
    
    const result = await this.signAndExecute(tx);
    console.log('Escrow cancelled:', result.digest);
    return result;
  }

  async getEscrowInfo(escrowObjectId: string) {
    const object = await this.client.getObject({
      id: escrowObjectId,
      options: { showContent: true }
    });
    
    return object;
  }

  async getEscrowState(escrowObjectId: string) {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::steam_escrow::get_state`,
      arguments: [tx.object(escrowObjectId)],
    });
    
    const result = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
    });
    
    return result;
  }
}

// Usage example
/*
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });
const keypair = Ed25519Keypair.deriveKeypair('your-mnemonic');

const signAndExecute = async (tx: TransactionBlock) => {
  return await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });
};

const escrowClient = new SteamEscrowClient(
  client, 
  signAndExecute, 
  '0x...' // package ID
);

// Create escrow
await escrowClient.createEscrow({
  buyer: '0xb0b...',
  seller: '0xa11ce...',
  assetId: 'item_123',
  assetName: 'AK-47 Redline',
  assetAmount: 1,
  tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=123',
  initialSellerCount: 1,
  initialBuyerCount: 0,
  price: 1000000
});
*/
