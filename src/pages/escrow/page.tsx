import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../lib/utils';
import steamAppsData from '../../data/steam_apps.json';
import { useCancelTransaction } from '../../hooks/useCancelTransaction';

interface SteamApp {
  appid: number;
  name: string;
}

const steamApps: SteamApp[] = steamAppsData as SteamApp[];

interface EscrowTransaction {
  transactionId: string;
  buyer: string;
  seller: string;
  item: {
    name: string;
    image: string;
    game: string;
    assetId: string;
  };
  amount: string;
  status: string; // Changed from number to string
  createdAt: string;
  updatedAt: string;
  steamTradeUrl?: string;
  description: string;
  role: 'buyer' | 'seller';
}

const EscrowPage: React.FC = () => {
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { cancelEscrow, verifyInventoryStatus, loading: cancelLoading, verifying: cancelVerifying, error: cancelError } = useCancelTransaction();

  useEffect(() => {
    fetchEscrows().then(() => {
      // Check inventory status after fetching escrows
      checkInventoryStatus();
    });
  }, []);

  // Handle cancel escrow
  const handleCancel = async (escrow: EscrowTransaction) => {
    try {
      const result = await cancelEscrow({
        escrowId: escrow.transactionId,
        escrowObjectId: escrow.transactionId, // This should be the actual Sui object ID
      });
      
      console.log('Cancel successful:', result);
      // Refresh transactions after successful cancel
      fetchEscrows();
    } catch (error: any) {
      console.error('Cancel failed:', error);
      
      // Handle special case where transfer has already occurred
      if (error.message.includes('transfer has already occurred')) {
        // Refresh transactions to reflect the completed status
        fetchEscrows();
      }
    }
  };

  // Check inventory status for all in-progress escrows
  const checkInventoryStatus = async () => {
    if (!escrows.length) return;

    console.log('Checking inventory status for all escrows...');
    
    const inProgressEscrows = escrows.filter(escrow => 
      escrow.status === 'initialized' || escrow.status === 'deposited'
    );
    
    for (const escrow of inProgressEscrows) {
      try {
        const status = await verifyInventoryStatus(escrow.transactionId);
        
        if (status.hasTransferOccurred) {
          console.log(`Transfer detected for escrow ${escrow.transactionId}, marking as completed`);
          // The backend will have already updated the status, so just refresh
          await fetchEscrows();
        }
      } catch (error) {
        console.warn(`Failed to check inventory for escrow ${escrow.transactionId}:`, error);
      }
    }
  };

  const fetchEscrows = async () => {
    try {
      setLoading(true);
      
      // Get wallet address from cookie
      const walletAddress = getCookie("wallet_address");
      
      if (!walletAddress || walletAddress === 'null' || walletAddress === 'undefined' || walletAddress.trim() === '') {
        throw new Error('No wallet address found. Please connect your wallet.');
      }
      
      const response = await fetch(`/api/escrow/getAllEscrows?address=${encodeURIComponent(walletAddress)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch escrow transactions');
      }
      
      const data = await response.json();
      setEscrows(data.escrows || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initialized':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Initialized</Badge>;
      case 'deposited':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Deposited</Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Unknown</Badge>;
    }
  };

  const getGameNameByAppId = (appId: string): string => {
    const game = steamApps.find(app => app.appid.toString() === appId);
    return game ? game.name : 'Unknown Game';
  };

  const getTabData = () => {
    const inProgress = escrows.filter(escrow => 
      escrow.status === 'initialized' || escrow.status === 'deposited'
    );
    const finished = escrows.filter(escrow => escrow.status === 'completed');
    const cancelled = escrows.filter(escrow => escrow.status === 'cancelled');

    return { inProgress, finished, cancelled };
  };

  const EscrowCard: React.FC<{ escrow: EscrowTransaction }> = ({ escrow }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {escrow.item.name || `Asset ${escrow.item.assetId}`}
            </CardTitle>
            <CardDescription>
              Transaction ID: {escrow.transactionId} • Created: {new Date(escrow.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          {getStatusBadge(escrow.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">{escrow.amount}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Buyer:</span>
            <span className="font-mono text-xs">{escrow.buyer}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seller:</span>
            <span className="font-mono text-xs">{escrow.seller}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Game:</span>
            <span className="text-sm">{escrow.item.game}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Role:</span>
            <Badge variant={escrow.role === 'buyer' ? 'default' : 'secondary'}>
              {escrow.role.charAt(0).toUpperCase() + escrow.role.slice(1)}
            </Badge>
          </div>

          {escrow.description && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Description:</span>
              <span className="text-sm">{escrow.description}</span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/escrow/view/${escrow.transactionId}`)}
              className="flex items-center gap-1"
            >
              View Details <ExternalLink className="w-3 h-3" />
            </Button>
            
            {escrow.item.assetId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/view/${escrow.item.assetId}`)}
                className="flex items-center gap-1"
              >
                View Asset <ExternalLink className="w-3 h-3" />
              </Button>
            )}

            {/* Cancel Button for Buyers in In-Progress Transactions */}
            {(escrow.status === 'initialized' || escrow.status === 'deposited') && escrow.role === 'buyer' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancel(escrow)}
                disabled={cancelLoading || cancelVerifying}
                className="flex items-center gap-1"
              >
                {cancelLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Canceling...
                  </>
                ) : cancelVerifying ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Cancel
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Show error if cancel failed */}
          {cancelError && (escrow.status === 'initialized' || escrow.status === 'deposited') && escrow.role === 'buyer' && (
            <p className="text-red-500 text-xs mt-2">{cancelError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const { inProgress, finished, cancelled } = getTabData();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading escrow transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Escrows</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchEscrows}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Escrow Transactions</h1>
        <p className="text-muted-foreground">
          Manage and track your escrow transactions
        </p>
      </div>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="finished" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Finished ({finished.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="mt-6">
          {inProgress.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No In-Progress Escrows</h3>
                  <p className="text-muted-foreground">
                    You don't have any escrow transactions in progress.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {inProgress.map(escrow => (
                <EscrowCard key={escrow.transactionId} escrow={escrow} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="finished" className="mt-6">
          {finished.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Finished Escrows</h3>
                  <p className="text-muted-foreground">
                    You don't have any completed escrow transactions.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {finished.map(escrow => (
                <EscrowCard key={escrow.transactionId} escrow={escrow} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelled.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Cancelled Escrows</h3>
                  <p className="text-muted-foreground">
                    You don't have any cancelled escrow transactions.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {cancelled.map(escrow => (
                <EscrowCard key={escrow.transactionId} escrow={escrow} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EscrowPage;
