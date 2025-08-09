// src/pages/escrow/view/[transactionId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  ExternalLink,
  Copy,
  Calendar,
  DollarSign,
  FileText,
  Link as LinkIcon,
  RefreshCw
} from "lucide-react";

interface EscrowTransactionDetail {
  transactionId: string;
  buyer: string;
  seller: string;
  item: {
    name: string;
    image: string;
    game: string;
    assetId: string;
    description?: string;
    rarity?: string;
    condition?: string;
  };
  amount: string;
  status: "in-progress" | "cancelled" | "finished";
  createdAt: string;
  updatedAt: string;
  steamTradeUrl?: string;
  description?: string;
  escrowAddress?: string;
  blockchainTxHash?: string;
  timeline?: Array<{
    timestamp: string;
    event: string;
    description: string;
  }>;
}

export default function EscrowViewPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<EscrowTransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - replace with actual API calls
  const mockTransactionDetail: EscrowTransactionDetail = {
    transactionId: transactionId || "esc_001",
    buyer: "0xabc123def456789012345678901234567890abcd",
    seller: "0x789012345678901234567890abcdef123456789",
    item: {
      name: "AK-47 | Redline (Field-Tested)",
      image: "https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDz9-TQXJVfdhX_Qp4g3gNiM6vYBkXNak8L5IKwS4s9OaYLElNoxEGpDVWKDQZVz870s7gvQL-2K9mAfhuw",
      game: "Counter-Strike: Global Offensive",
      assetId: "12345678901",
      description: "The AK-47 delivers more damage than the M4A1-S and M4A4, but with higher recoil and less accuracy.",
      rarity: "Classified",
      condition: "Field-Tested"
    },
    amount: "2.5 SUI",
    status: "in-progress",
    createdAt: "2025-08-09T10:30:00Z",
    updatedAt: "2025-08-09T10:30:00Z",
    steamTradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=123456&token=abcdef",
    description: "Purchasing AK-47 Redline skin through secure escrow",
    escrowAddress: "0xescrow123456789012345678901234567890abcd",
    blockchainTxHash: "0x1234567890abcdef1234567890abcdef12345678",
    timeline: [
      {
        timestamp: "2025-08-09T10:30:00Z",
        event: "Escrow Created",
        description: "Buyer initiated escrow transaction"
      },
      {
        timestamp: "2025-08-09T10:32:00Z",
        event: "Funds Deposited",
        description: "2.5 SUI deposited to escrow contract"
      },
      {
        timestamp: "2025-08-09T10:35:00Z",
        event: "Seller Notified",
        description: "Steam trade URL provided to seller"
      }
    ]
  };

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/escrow/transaction/${transactionId}`);
        // if (!response.ok) throw new Error("Transaction not found");
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          if (transactionId) {
            setTransaction(mockTransactionDetail);
          } else {
            setError("Transaction ID not provided");
          }
          setIsLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || "Failed to load transaction details");
        setIsLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

  const getStatusBadge = (status: EscrowTransactionDetail["status"]) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-4 h-4 mr-2" />
            In Progress
          </Badge>
        );
      case "finished":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-4 h-4 mr-2" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
              Loading transaction details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Transaction Not Found</h2>
            <p className="text-gray-400 mb-6">{error || "The requested transaction could not be found."}</p>
            <Link to="/escrow">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Escrow
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/escrow")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Transaction Details</h1>
            </div>
            {getStatusBadge(transaction.status)}
          </div>
          <p className="text-gray-400">
            Transaction ID: <span className="font-mono text-white">{transaction.transactionId}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Item Details */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Item Details
              </h3>
              
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-black/20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={transaction.item.image}
                    alt={transaction.item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-1">
                    {transaction.item.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">{transaction.item.game}</p>
                  {transaction.item.rarity && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-1">
                      {transaction.item.rarity}
                    </Badge>
                  )}
                  {transaction.item.condition && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 ml-2">
                      {transaction.item.condition}
                    </Badge>
                  )}
                </div>
              </div>

              {transaction.item.description && (
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">{transaction.item.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Transaction Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold text-lg">{transaction.amount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Buyer:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{truncateAddress(transaction.buyer)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.buyer)}
                      className="p-1 h-6 w-6"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Seller:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{truncateAddress(transaction.seller)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.seller)}
                      className="p-1 h-6 w-6"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {transaction.escrowAddress && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Escrow Contract:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{truncateAddress(transaction.escrowAddress)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.escrowAddress!)}
                        className="p-1 h-6 w-6"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{formatDate(transaction.createdAt)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">{formatDate(transaction.updatedAt)}</span>
                </div>
              </div>

              {transaction.steamTradeUrl && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Steam Trade URL:
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(transaction.steamTradeUrl, '_blank')}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        {transaction.timeline && transaction.timeline.length > 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mt-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Transaction Timeline
              </h3>
              
              <div className="space-y-4">
                {transaction.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white">{event.event}</h4>
                        <span className="text-gray-400 text-sm">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {transaction.description && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mt-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <p className="text-gray-300">{transaction.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Blockchain Link */}
        {transaction.blockchainTxHash && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => window.open(`https://suiexplorer.com/txblock/${transaction.blockchainTxHash}`, '_blank')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Sui Explorer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
