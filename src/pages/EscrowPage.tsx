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
  RefreshCw
} from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { cn } from "@/lib/utils";

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
}

export default function EscrowPage() {
  const currentAccount = useCurrentAccount();
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("in-progress");

  // Mock data for demonstration - replace with actual API calls
  const mockEscrowData: EscrowTransaction[] = [
    {
      transactionId: "esc_001",
      buyer: "0xabc...def",
      seller: "0x789...012",
      item: {
        name: "AK-47 | Redline (Field-Tested)",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDz9-TQXJVfdhX_Qp4g3gNiM6vYBkXNak8L5IKwS4s9OaYLElNoxEGpDVWKDQZVz870s7gvQL-2K9mAfhuw",
        game: "Counter-Strike: Global Offensive",
        assetId: "12345678901"
      },
      amount: "2.5 SUI",
      status: "in-progress",
      createdAt: "2025-08-09T10:30:00Z",
      updatedAt: "2025-08-09T10:30:00Z",
      steamTradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=123456&token=abcdef",
      description: "Purchasing AK-47 Redline skin"
    },
    {
      transactionId: "esc_002",
      buyer: "0xdef...abc",
      seller: "0x345...678",
      item: {
        name: "AWP | Dragon Lore (Factory New)",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59PfWwIzJxdwr9ArVhWvws8RvlDDEDv7UrPYTj2r1UcAy1tYHAYuZ5ZcZIHJDWUqSEZwv970hk0qUErWO5xHrpjijpOWteRBq_rWNSyPjH5OXkjCu-ewvFuhHJTK3Ihg",
        game: "Counter-Strike: Global Offensive",
        assetId: "23456789012"
      },
      amount: "150.0 SUI",
      status: "finished",
      createdAt: "2025-08-08T14:20:00Z",
      updatedAt: "2025-08-08T16:45:00Z",
      steamTradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=789012&token=xyz123",
      description: "High-value AWP Dragon Lore purchase"
    },
    {
      transactionId: "esc_003",
      buyer: "0x678...901",
      seller: "0x234...567",
      item: {
        name: "Karambit | Fade (Factory New)",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhhfg3_ErVhXfAF4Rv1NiIRv7Uy",
        game: "Counter-Strike: Global Offensive",
        assetId: "34567890123"
      },
      amount: "75.8 SUI",
      status: "cancelled",
      createdAt: "2025-08-07T09:15:00Z",
      updatedAt: "2025-08-07T11:30:00Z",
      steamTradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=345678&token=def456",
      description: "Trade cancelled by seller"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchEscrowTransactions = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/escrow/user/${currentAccount?.address}`);
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setEscrowTransactions(mockEscrowData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching escrow transactions:", error);
        setIsLoading(false);
      }
    };

    if (currentAccount?.address) {
      fetchEscrowTransactions();
    } else {
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
