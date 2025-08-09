// src/pages/EscrowPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  RefreshCw,
  DollarSign,
  Loader2
} from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { cn } from "@/lib/utils";
import { useClaimTransaction } from "@/hooks/useClaimTransaction";
import { useCancelTransaction } from "@/hooks/useCancelTransaction";

// Updated interface to match backend format
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
  status: "in-progress" | "cancelled" | "finished";
  createdAt: string;
  updatedAt: string;
  steamTradeUrl?: string;
  description?: string;
  role?: "buyer" | "seller"; // Added role to distinguish user's position
}

export default function EscrowPage() {
  const currentAccount = useCurrentAccount();
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("in-progress");
  const { claimPayment, verifyTransfer, loading: claimLoading, verifying, error: claimError } = useClaimTransaction();
  const { cancelEscrow, verifyInventoryStatus, loading: cancelLoading, verifying: cancelVerifying, error: cancelError } = useCancelTransaction();

  // Handle cancel escrow
  const handleCancel = async (transaction: EscrowTransaction) => {
    try {
      const result = await cancelEscrow({
        escrowId: transaction.transactionId,
        escrowObjectId: transaction.transactionId, // This should be the actual Sui object ID
      });
      
      console.log('Cancel successful:', result);
      // Refresh transactions after successful cancel
      fetchEscrowTransactions();
    } catch (error: any) {
      console.error('Cancel failed:', error);
      
      // Handle special case where transfer has already occurred
      if (error.message.includes('transfer has already occurred')) {
        // Refresh transactions to reflect the completed status
        fetchEscrowTransactions();
      }
    }
  };

  // Check inventory status for all in-progress escrows
  const checkInventoryStatus = async () => {
    if (!escrowTransactions.length) return;

    console.log('Checking inventory status for all escrows...');
    
    const inProgressEscrows = escrowTransactions.filter(tx => tx.status === 'in-progress');
    
    for (const escrow of inProgressEscrows) {
      try {
        const status = await verifyInventoryStatus(escrow.transactionId);
        
        if (status.hasTransferOccurred) {
          console.log(`Transfer detected for escrow ${escrow.transactionId}, marking as completed`);
          // The backend will have already updated the status, so just refresh
          await fetchEscrowTransactions();
        }
      } catch (error) {
        console.warn(`Failed to check inventory for escrow ${escrow.transactionId}:`, error);
      }
    }
  };

  // Handle claim payment
  const handleClaim = async (transaction: EscrowTransaction) => {
    try {
      const result = await claimPayment({
        escrowId: transaction.transactionId,
        escrowObjectId: transaction.transactionId, // This should be the actual Sui object ID
      });
      
      console.log('Claim successful:', result);
      // Refresh transactions after successful claim
      fetchEscrowTransactions();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  // Determine if current user is seller for a transaction
  const isCurrentUserSeller = (transaction: EscrowTransaction): boolean => {
    return currentAccount?.address === transaction.seller;
  };

  // Determine if current user is buyer for a transaction
  const isCurrentUserBuyer = (transaction: EscrowTransaction): boolean => {
    return currentAccount?.address === transaction.buyer;
  };

  // Fetch escrow transactions from backend
  const fetchEscrowTransactions = async () => {
    if (!currentAccount?.address) return;
    
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3111';
      const response = await fetch(`${backendUrl}/api/escrow/getAllEscrows?address=${currentAccount.address}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch escrows: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEscrowTransactions(data.escrows);
      } else {
        throw new Error(data.error || 'Failed to fetch escrow transactions');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching escrow transactions:", error);
      setEscrowTransactions([]); // Set empty array on error
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount?.address) {
      fetchEscrowTransactions().then(() => {
        // Check inventory status after fetching escrows
        checkInventoryStatus();
      });
    } else {
      setEscrowTransactions([]);
      setIsLoading(false);
    }
  }, [currentAccount]);

  const getStatusBadge = (status: EscrowTransaction["status"]) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "finished":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getFilteredTransactions = (status: string) => {
    if (status === "all") return escrowTransactions;
    return escrowTransactions.filter(tx => tx.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
              Loading escrow transactions...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentAccount?.address) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view escrow transactions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Escrow Transactions</h1>
          </div>
          <p className="text-gray-400">
            Track your secure transactions and manage escrow agreements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Transactions",
              value: escrowTransactions.length,
              icon: Shield,
              color: "text-blue-400"
            },
            {
              label: "In Progress",
              value: getFilteredTransactions("in-progress").length,
              icon: Clock,
              color: "text-yellow-400"
            },
            {
              label: "Completed",
              value: getFilteredTransactions("finished").length,
              icon: CheckCircle,
              color: "text-green-400"
            },
            {
              label: "Cancelled",
              value: getFilteredTransactions("cancelled").length,
              icon: XCircle,
              color: "text-red-400"
            }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={cn("w-8 h-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-white/10 border-white/20 mb-8">
            <TabsTrigger 
              value="in-progress" 
              className="data-[state=active]:bg-yellow-600/80"
            >
              In Progress ({getFilteredTransactions("in-progress").length})
            </TabsTrigger>
            <TabsTrigger 
              value="finished" 
              className="data-[state=active]:bg-green-600/80"
            >
              Completed ({getFilteredTransactions("finished").length})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled" 
              className="data-[state=active]:bg-red-600/80"
            >
              Cancelled ({getFilteredTransactions("cancelled").length})
            </TabsTrigger>
          </TabsList>

          {["in-progress", "finished", "cancelled"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="space-y-4">
                {getFilteredTransactions(status).length === 0 ? (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No {status.replace("-", " ")} transactions
                      </h3>
                      <p className="text-gray-400">
                        {status === "in-progress" && "No active escrow transactions at the moment."}
                        {status === "finished" && "No completed transactions yet."}
                        {status === "cancelled" && "No cancelled transactions."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  getFilteredTransactions(status).map((transaction) => (
                    <Card key={transaction.transactionId} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Item Image */}
                          <div className="w-20 h-20 bg-black/20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={transaction.item.image}
                              alt={transaction.item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Transaction Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  {transaction.item.name}
                                </h3>
                                <p className="text-gray-400 text-sm">{transaction.item.game}</p>
                              </div>
                              {getStatusBadge(transaction.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Amount</p>
                                <p className="text-white font-semibold">{transaction.amount}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Buyer</p>
                                <p className="text-white font-mono">{truncateAddress(transaction.buyer)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Seller</p>
                                <p className="text-white font-mono">{truncateAddress(transaction.seller)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Created</p>
                                <p className="text-white">{formatDate(transaction.createdAt)}</p>
                              </div>
                            </div>

                            {transaction.description && (
                              <p className="text-gray-300 text-sm italic">
                                "{transaction.description}"
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex flex-col gap-2">
                            <Link to={`/escrow/view/${transaction.transactionId}`}>
                              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 w-full">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            
                            {/* Claim Button for Sellers in In-Progress Transactions */}
                            {status === "in-progress" && isCurrentUserSeller(transaction) && (
                              <Button 
                                onClick={() => handleClaim(transaction)}
                                disabled={claimLoading || verifying}
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white w-full"
                              >
                                {claimLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Claiming...
                                  </>
                                ) : verifying ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Claim Payment
                                  </>
                                )}
                              </Button>
                            )}

                            {/* Cancel Button for Buyers in In-Progress Transactions */}
                            {status === "in-progress" && isCurrentUserBuyer(transaction) && (
                              <Button 
                                onClick={() => handleCancel(transaction)}
                                disabled={cancelLoading || cancelVerifying}
                                size="sm" 
                                className="bg-red-600 hover:bg-red-700 text-white w-full"
                              >
                                {cancelLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Canceling...
                                  </>
                                ) : cancelVerifying ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Checking Inventory...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Escrow
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {/* Show error if claim failed */}
                            {claimError && status === "in-progress" && isCurrentUserSeller(transaction) && (
                              <p className="text-red-400 text-xs mt-1">{claimError}</p>
                            )}

                            {/* Show error if cancel failed */}
                            {cancelError && status === "in-progress" && isCurrentUserBuyer(transaction) && (
                              <p className="text-red-400 text-xs mt-1">{cancelError}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
