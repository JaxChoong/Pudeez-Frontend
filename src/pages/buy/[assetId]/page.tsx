"use client";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Gavel, Share, X, HelpCircle } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

export default function BuyPage() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [steamTradeUrl, setSteamTradeUrl] = useState("");
  const { assetId } = useParams();
  const location = useLocation();

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
    if (!item && assetId) fetchAsset();
  }, [assetId, fetchAsset, item]);

  const handleImageLoad = () => setIsImageLoading(false);

  // Calculate costs for the modal
  const calculateCosts = () => {
    const basePrice = parseFloat(item?.price?.replace(/[^\d.]/g, '') || '0');
    const transactionFee = 0.025; // 2.5% - replace this later
    const feeAmount = basePrice * transactionFee;
    const total = basePrice + feeAmount;
    
    return {
      basePrice: basePrice.toFixed(3),
      feeAmount: feeAmount.toFixed(3),
      total: total.toFixed(3)
    };
  };

  // Handle buy button click
  const handleBuyClick = () => {
    setShowBuyModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowBuyModal(false);
    setSteamTradeUrl("");
  };

  // Handle confirm purchase
  const handleConfirmPurchase = () => {
    // This will be replaced with actual purchase logic later
    console.log("Purchase confirmed with trade URL:", steamTradeUrl);
    alert("Purchase functionality will be implemented soon!");
    handleCloseModal();
  };

  const imageUrl =
    item?.image ||
    (item?.icon_url
      ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`
      : undefined);

  if (loading) return <div className="text-center text-white py-10">Loading...</div>;
  if (error || !item) return <div className="text-center text-red-400 py-10">{error || "Asset not found"}</div>;

  const owner = {
    name: item?.ownerName || "Unknown User",
    avatar: item?.ownerAvatar || "https://via.placeholder.com/80",
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
                <p className="text-2xl font-bold">{item.price || "-"}</p>
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
                { label: "Steam ID", value: item.steamID },
                { label: "Steam Name", value: item.steamName },
                { label: "Wallet Address", value: item.walletAddress },
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


            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={handleBuyClick}
              >
                {item.isAuction ? (
                  <>
                    <Gavel className="w-4 h-4 mr-2" />
                    Place Bid
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
                  {item.isAuction ? 'Place Bid' : 'Purchase Item'}
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
                    onChange={(e) => setSteamTradeUrl(e.target.value)}
                    className="w-full bg-black/40 border-white/20 text-white placeholder:text-gray-500 font-mono text-sm"
                  />
                  
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
                    disabled={!steamTradeUrl.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {item.isAuction ? 'Place Bid' : 'Confirm Purchase'}
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
