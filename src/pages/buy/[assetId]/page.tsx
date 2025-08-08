"use client";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Gavel, Share } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

export default function BuyPage() {
  const [isImageLoading, setIsImageLoading] = useState(true);
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
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
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
      </div>
    </div>
  );
}
