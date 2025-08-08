// src/pages/view/[appId]/page.tsx
"use client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

export default function ItemDetailsPage() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { assetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState<any | null>(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState<string | null>(null);

  const fetchAsset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/walrus/asset/${assetId}`);
      if (!res.ok) throw new Error(`Asset not found`);
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

  const iconUrl = item && item.iconUrl ? item.iconUrl : 
                  item && item.icon_url ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}` : undefined;

  if (loading) return <div className="text-center text-white py-10">Loading...</div>;
  if (error || !item) return <div className="text-center text-red-400 py-10">{error || "Asset not found"}</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Item Image with Shimmer */}
          <div className="w-full md:w-1/3 flex justify-center">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="relative aspect-square flex items-center justify-center bg-black/20 rounded-lg">
                  {isImageLoading && (
                    <Shimmer className="absolute inset-0 w-full h-full rounded-lg" />
                  )}
                  <img
                    src={iconUrl}
                    alt={item.name}
                    className={cn(
                      "max-w-[80%] max-h-[80%] object-contain transition-transform duration-300",
                      isImageLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={handleImageLoad}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Item Details Table */}
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-white mb-4">{item.name}</h1>
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <table className="w-full text-left text-sm text-gray-300">
                <tbody>
                  {Object.entries(item)
                    .filter(([key]) => !["price", "status", "description", "name"].includes(key))
                    .map(([key, value]) => (
                      <tr key={key} className="border-b border-white/5 last:border-b-0">
                        <td className="py-2 pr-4 font-semibold capitalize text-white w-1/3">{key}</td>
                        <td className="py-2 break-all">{String(value)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}