// src/pages/SellPage/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Hammer, Clock } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";

export default function SellPage() {
  const { assetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'sale' | 'auction'>('sale');
  const [price, setPrice] = useState('');
  const [minBid, setMinBid] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('24');
  const [description, setDescription] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [item] = useState<any | null>(location.state || null);
  const [loading] = useState(!location.state);
  const [error, setError] = useState<string | null>(null);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // If item is not passed via state, we could implement fetching logic here
  // For now, we'll use the passed state or show an error
  useEffect(() => {
    if (!item && !loading) {
      setError("Asset information not found. Please navigate from your inventory.");
    }
  }, [item, loading]);

  // Get the correct icon URL
  const iconUrl = item && item.iconUrl ? item.iconUrl : 
                  item && item.icon_url_large ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}` : 
                  item && item.icon_url ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}` : undefined;

  // Show loading state
  if (loading) {
    return <div className="text-center text-white py-10">Loading...</div>;
  }

  // Show error state
  if (error || !item) {
    return <div className="text-center text-red-400 py-10">{error || "Asset not found"}</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      assetId: assetId,
      listingType,
      price: listingType === 'sale' ? price : null,
      minBid: listingType === 'auction' ? minBid : null,
      auctionDuration: listingType === 'auction' ? auctionDuration : null,
      description
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">List Your Item</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Asset Preview */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg aspect-square flex items-center justify-center bg-black/20">
                {isImageLoading && (
                  <Shimmer className="absolute inset-0 w-full h-full" />
                )}
                <img
                  src={iconUrl}
                  alt={item.name}
                  className={cn(
                    "max-w-[80%] max-h-[80%] object-contain transition-transform duration-300",
                    isImageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={handleImageLoad}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-white">{item.name}</h2>
                <p className="text-gray-400">{item.type || "Steam Item"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Listing Form */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="sale" onValueChange={(value) => setListingType(value as 'sale' | 'auction')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="sale">
                      <Tag className="w-4 h-4 mr-2" /> Fixed Price
                    </TabsTrigger>
                    <TabsTrigger value="auction">
                      <Hammer className="w-4 h-4 mr-2" /> Auction
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sale">
                    <div className="space-y-4 mb-4">
                      <div>
                        <p className="text-sm text-white mb-2">Price (Sui)</p>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required={listingType === 'sale'}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="auction">
                    <div className="space-y-4 mb-4">
                      <div>
                        <p className="text-sm text-white mb-2">Minimum Bid (Sui)</p>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={minBid}
                          onChange={(e) => setMinBid(e.target.value)}
                          required={listingType === 'auction'}
                        />
                      </div>

                      <div>
                        <p className="text-sm text-white mb-2">Auction Duration</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={auctionDuration === '24' ? 'default' : 'outline'}
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => setAuctionDuration('24')}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs">24 Hours</span>
                          </Button>
                          <Button
                            type="button"
                            variant={auctionDuration === '72' ? 'default' : 'outline'}
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => setAuctionDuration('72')}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs">3 Days</span>
                          </Button>
                          <Button
                            type="button"
                            variant={auctionDuration === '168' ? 'default' : 'outline'}
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => setAuctionDuration('168')}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs">7 Days</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 mb-6">
                  <p className="text-sm text-white mb-2">Description</p>
                  <textarea
                    placeholder="Tell potential buyers about your item..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    {listingType === 'sale' ? 'Pudeez for Sale' : 'Start Auction'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}