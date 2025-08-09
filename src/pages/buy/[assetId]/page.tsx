"use client";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Share, X, AlertCircle, CheckCircle } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEscrowTransaction, validateSteamTradeUrl } from "@/hooks/useEscrowTransaction";
import { useSteam } from "@/contexts/SteamContext";

export default function BuyPage() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [steamTradeUrl, setSteamTradeUrl] = useState("");
  const [isTradeUrlValid, setIsTradeUrlValid] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const { assetId } = useParams();
  const location = useLocation();
  const currentAccount = useCurrentAccount();
  const { createEscrow, loading: escrowLoading, error: escrowError } = useEscrowTransaction();
  const { steamUser } = useSteam();

  // Parse initial item from location.state
  const initialItem =
    typeof location.state === "string"
      ? (() => {
          try {
            return JSON.parse(location.state);
          } catch (e) {
            console.error("Failed to parse item:", e);
            return null;
          }
        })()
      : location.state;

  const [item, setItem] = useState<any | null>(initialItem?.item || null);
  const [loading, setLoading] = useState(!initialItem);
  const [error, setError] = useState<string | null>(null);

  const fetchAsset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First try to get from marketplace, fallback to walrus endpoint
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/marketplace/assets`);
      if (res.ok) {
        const data = await res.json();
        const marketplaceAsset = data.assets?.find((asset: any) => asset.assetid === assetId);
        if (marketplaceAsset) {
          setItem(marketplaceAsset);
          return;
        }
      }
      
      // Fallback to walrus endpoint
      res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/walrus/asset/${assetId}`);
      if (!res.ok) throw new Error("Asset not found");
      const data = await res.json();
      setItem(data.asset);
    } catch (err: any) {
      setError(err.message || "Failed to load asset");
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    if (!item && assetId) {
      fetchAsset();
    } else if (item && assetId) {
      // Check availability when item is loaded
      checkAssetAvailability();
    }
  }, [assetId, fetchAsset, item]);

  // Handle trade URL change with validation
  const handleTradeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setSteamTradeUrl(url);
    setIsTradeUrlValid(validateSteamTradeUrl(url));
  };

  const handleImageLoad = () => setIsImageLoading(false);

  // Helper function to format SUI amounts with appropriate decimal places
  const formatSuiAmount = (amount: number): string => {
    if (amount === 0) return '0';
    
    // For very small amounts, show 8 decimal places to capture tiny fees
    if (amount < 0.01) {
      return amount.toFixed(8).replace(/\.?0+$/, ''); // Remove trailing zeros
    }
    // For small amounts, show 6 decimal places
    else if (amount < 0.1) {
      return amount.toFixed(6).replace(/\.?0+$/, ''); // Remove trailing zeros
    }
    // For regular amounts, show 4 decimal places
    else if (amount < 1) {
      return amount.toFixed(4).replace(/\.?0+$/, ''); // Remove trailing zeros
    }
    // For larger amounts, show 3 decimal places
    else {
      return amount.toFixed(3).replace(/\.?0+$/, ''); // Remove trailing zeros
    }
  };

  // Calculate costs for the modal
  const calculateCosts = () => {
    const basePrice = parseFloat(item?.price?.replace(/[^\d.]/g, '') || '0');
    const transactionFee = 0.025; // 2.5% - replace this later
    const feeAmount = basePrice * transactionFee;
    const total = basePrice + feeAmount;
    
    return {
      basePrice: formatSuiAmount(basePrice),
      feeAmount: formatSuiAmount(feeAmount),
      total: formatSuiAmount(total)
    };
  };

  // Check asset availability in seller's Steam inventory
  const checkAssetAvailability = async () => {
    if (!assetId) return false;

    setIsCheckingAvailability(true);
    setAvailabilityError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets/${assetId}/availability`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Asset not found in database');
        } else if (response.status === 503) {
          // Steam API not available, continue anyway but show warning
          console.warn('Steam inventory checking not available');
          return true;
        }
        throw new Error(`Failed to check availability: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.available) {
        // Asset is no longer available, remove it from marketplace
        setAvailabilityError('This asset is no longer available in the seller\'s inventory.');
        
        // Call backend to remove the asset
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets/${assetId}/remove-unavailable`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reason: 'Asset no longer in seller inventory'
            })
          });
          console.log('Unavailable asset removed from marketplace');
        } catch (removeError) {
          console.error('Failed to remove unavailable asset:', removeError);
        }
        
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking asset availability:', error);
      setAvailabilityError(error instanceof Error ? error.message : 'Failed to check asset availability');
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Handle buy button click with availability check
  const handleBuyClick = async () => {
    // First check if the asset is still available
    const isAvailable = await checkAssetAvailability();
    
    if (!isAvailable) {
      // Don't show the modal if asset is not available
      return;
    }

    setShowBuyModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowBuyModal(false);
    setSteamTradeUrl("");
  };

  // Handle confirm purchase
  const handleConfirmPurchase = async () => {
    if (!currentAccount?.address) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!validateSteamTradeUrl(steamTradeUrl)) {
      alert("Please enter a valid Steam Trade URL");
      return;
    }

    if (!item) {
      alert("Item data not available");
      return;
    }

    try {
      // Extract price from item (remove "SUI" and convert to number)
      const priceStr = item.price?.replace(/[^\d.]/g, '') || '0';
      const priceInSui = parseFloat(priceStr);
      
      if (priceInSui <= 0) {
        alert("Invalid item price");
        return;
      }

      // Get seller address from item data
      // This should be the wallet address of the seller, not Steam ID
      const sellerAddress = item.walletAddress || item.seller;
      if (!sellerAddress) {
        alert("Seller wallet address not found");
        return;
      }

      // Extract Steam information from item data
      const appId = item.appid; // Remove fallback to 730
      const classId = item.classid;
      const instanceId = item.instanceid;
      const sellerSteamId = item.sellerSteamId || item.steamId || item.steamID;
      
      // Use buyer Steam ID from global context instead of trade URL
      const buyerSteamId = steamUser?.steamID;

      // Validate required Steam data
      if (!buyerSteamId) {
        alert("Please log in with Steam before making a purchase");
        return;
      }

      if (!appId) {
        alert("Invalid item: missing game app ID");
        return;
      }

      console.log('Escrow parameters:', {
        seller: sellerAddress,
        assetId: item.assetid || assetId,
        assetName: item.title || item.name,
        priceInSui,
        appId,
        sellerSteamId,
        buyerSteamId,
        tradeUrl: steamTradeUrl
      });

      // Create escrow transaction
      const result = await createEscrow({
        seller: sellerAddress,
        assetId: item.assetid || assetId || "",
        assetName: item.title || item.name || "Unknown Item",
        assetAmount: 1, // Assuming 1 item for now
        tradeUrl: steamTradeUrl,
        priceInSui: priceInSui,
        appId: appId,
        iconUrl: item.icon_url || "",
        contextId: item.contextid || "2", // Use contextid from item or default to 2
        classId: classId,
        instanceId: instanceId,
        sellerSteamId: sellerSteamId,
        buyerSteamId: buyerSteamId,
      });

      if (result.digest) {
        alert(`Purchase initiated successfully! Transaction: ${result.digest}\nWalrus Blob ID: ${result.walrusBlobId}`);
        handleCloseModal();
        
        // Optionally navigate to a transaction status page
        // navigate(`/transaction/${result.digest}`);
      }

    } catch (error: any) {
      console.error("Purchase failed:", error);
      alert(`Purchase failed: ${error.message || "Unknown error"}`);
    }
  };

  const imageUrl =
    item?.image ||
    (item?.icon_url
      ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`
      : undefined);

  if (loading) return <div className="text-center text-white py-10">Loading...</div>;
  if (error || !item) return <div className="text-center text-red-400 py-10">{error || "Asset not found"}</div>;

  const owner = {
    name: item?.steamID || item?.ownerName || "Unknown User",
    avatar: item?.steamAvatar || item?.ownerAvatar || "https://via.placeholder.com/80",
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image + Shimmer */}
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-black/10">
                  {isImageLoading && <Shimmer className="absolute inset-0 w-full h-full" />}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item.name || item.title || "Asset"}
                      className={cn(
                        "w-full h-full object-contain",
                        isImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      onLoad={handleImageLoad}
                      onError={() => setIsImageLoading(false)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{item.title || item.name || "Untitled Asset"}</h1>
              {/* <p className="text-gray-400">{item.type || item.genre}</p> */}
            </div>
              <div className="pt-2">
                <p className="text-gray-400">Price</p>
                <p className="text-2xl font-bold">
                  {item.price ? 
                    `${formatSuiAmount(parseFloat(item.price.replace(/[^\d.]/g, '') || '0'))} SUI` 
                    : "-"
                  }
                </p>
              </div>
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={owner.avatar} />
                <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-400">Creator</p>
                <p className="font-medium">{owner.name}</p>
              </div>
            </div>

            <p className="text-gray-300">{item.description || "No description provided."}</p>

            <div className="bg-black/40 rounded-lg p-4 border border-white/10 space-y-2">
              {[
                { label: "Asset ID", value: item.assetid },
                { label: "Blob ID", value: item.blobId },
                { label: "App ID", value: item.appid },
                { label: "Context ID", value: item.contextid },
                { label: "Class ID", value: item.classid },
                { label: "Instance ID", value: item.instanceid },
                {
                  label: "Uploaded At",
                  value: item.uploadedAt
                    ? new Date(item.uploadedAt).toLocaleString()
                    : "-",
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm text-gray-300">
                  <span className="font-semibold text-white">{label}:</span>
                  <span className="break-all text-right">{value ?? "-"}</span>
                </div>
              ))}
            </div>


            {/* Availability Error Display */}
            {availabilityError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{availabilityError}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBuyClick}
                disabled={isCheckingAvailability || !!availabilityError}
              >
                {isCheckingAvailability ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                    Checking Availability...
                  </>
                ) : availabilityError ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Not Available
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Buy Modal */}
        {showBuyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  Purchase Item
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Item Summary */}
                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="w-16 h-16 bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={item.name || item.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {item.title || item.name || "Untitled Asset"}
                    </h4>
                    <p className="text-gray-400 text-xs">{item.game}</p>
                  </div>
                </div>

                {/* Steam Trade URL Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">
                    Steam Trade URL *
                  </label>
                  <Input
                    type="url"
                    placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                    value={steamTradeUrl}
                    onChange={handleTradeUrlChange}
                    className={cn(
                      "w-full bg-black/40 border-white/20 text-white placeholder:text-gray-500 font-mono text-sm",
                      steamTradeUrl && !isTradeUrlValid ? "border-red-500" : "",
                      steamTradeUrl && isTradeUrlValid ? "border-green-500" : ""
                    )}
                  />
                  
                  {/* Validation feedback */}
                  {steamTradeUrl && (
                    <div className={cn(
                      "flex items-center gap-2 text-sm",
                      isTradeUrlValid ? "text-green-400" : "text-red-400"
                    )}>
                      {isTradeUrlValid ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Valid Steam Trade URL</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          <span>Invalid Steam Trade URL format</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* How to find trade URL link */}
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                      onClick={() => window.open('https://www.youtube.com/watch?v=ZLFP1E-nXSU&t=2s', '_blank')}
                    >
                      How?
                    </button>
                    <span className="text-gray-500">- How to find your Steam Trade URL</span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 p-4 bg-black/20 rounded-lg border border-white/10">
                  <h5 className="font-semibold text-white text-sm mb-3">Cost Breakdown</h5>
                  
                  {(() => {
                    const costs = calculateCosts();
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Item Price:</span>
                          <span className="text-white font-mono">{costs.basePrice} SUI</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Transaction Fee:</span>
                          <span className="text-white font-mono">{costs.feeAmount} SUI</span>
                        </div>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between text-base font-semibold">
                          <span className="text-white">Total:</span>
                          <span className="text-purple-400 font-mono">{costs.total} SUI</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Error display */}
                {escrowError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{escrowError}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmPurchase}
                    disabled={!steamTradeUrl.trim() || !isTradeUrlValid || escrowLoading || !currentAccount?.address}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {escrowLoading ? (
                      "Processing..."
                    ) : !currentAccount?.address ? (
                      "Connect Wallet"
                    ): (
                      "Confirm Purchase"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
