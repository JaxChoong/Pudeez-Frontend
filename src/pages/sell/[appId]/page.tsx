// src/pages/SellPage/[id]/page.tsx
"use client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Hammer, Clock } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";

export default function SellPage() {
  const { appId } = useParams();
  const [listingType, setListingType] = useState<'sale' | 'auction'>('sale');
  const [price, setPrice] = useState('');
  const [minBid, setMinBid] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('24');
  const [description, setDescription] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  // Mock data - replace with actual data fetching
  const item = {
      "appid": 381210,
      "classid": "2339867324",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4eF0fqddYxPZA9-SjOKUn3IpCV4iqw",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4eF0fqddYxPZA9-SjOKUn3IpCV4iqw",
      "tradable": 0,
      "name": "Anniversary Head Dwight 0401",
      "type": "",
      "market_name": "Anniversary Head Dwight 0401",
      "market_hash_name": "Anniversary Head Dwight 0401",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0,
      // stuff for pudeez to get later
        "description": "A special anniversary head for Dwight, celebrating 0401.",
        "price": "0.01 SUI",
        "currentBid": "",
        status: "sale", // or "auction"
        "endsIn": "",
  };
  const owner = {
    "name": "Pudeez User",
    "avatar": "https://example.com/avatar.png"
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nftId: appId,
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
        <h1 className="text-3xl font-bold text-white mb-8">List Your item</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* NFT Preview */}
<Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg aspect-square">
                {isImageLoading && (
                  <Shimmer className="absolute inset-0 w-full h-full" />
                )}
                <img
                  src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}`}
                  alt={item.name}
                  className={cn(
                    "w-full h-full object-cover",
                    isImageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={handleImageLoad}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-white">{item.name}</h2>
                <p className="text-gray-400">{item.type}</p>
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
                        <p className="text-sm text-white mb-2">Price (ETH)</p>
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
                        <p className="text-sm text-white mb-2">Minimum Bid (ETH)</p>
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
                  <Button variant="outline" type="button" className="border-white/20 text-white hover:bg-white/10">
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