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
  };
  amount: string;
  status: string; // Can be: initialized, deposited, completed, cancelled
  createdAt: string;
  updatedAt: string;
  steamTradeUrl?: string;
  description?: string;
  role: 'buyer' | 'seller';
}

export default function EscrowViewPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<EscrowTransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!transactionId) {
          setError("Transaction ID not provided");
          setIsLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3111';
        const response = await fetch(`${backendUrl}/api/escrow/transaction/${transactionId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Transaction not found");
          }
          throw new Error(`Failed to fetch transaction: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setTransaction(data.escrow);
        } else {
          throw new Error(data.error || 'Failed to fetch transaction details');
        }
        
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load transaction details");
        setIsLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "initialized":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Clock className="w-4 h-4 mr-2" />
            Initialized
          </Badge>
        );
      case "deposited":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-4 h-4 mr-2" />
            Deposited
          </Badge>
        );
      case "completed":
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
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <Clock className="w-4 h-4 mr-2" />
            Unknown
          </Badge>
        );
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
                </div>
              </div>
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
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.open(`https://suiscan.xyz/testnet/object/${transaction.transactionId}`, '_blank')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Sui Explorer
          </Button>
        </div>
      </div>
    </div>
  );
}
