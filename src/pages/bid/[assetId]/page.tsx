// src/pages/view/[appId]/page.tsx
"use client";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, ShoppingCart, Gavel, Share } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function BidItemDetailsPage() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { assetId } = useParams();

  // Mock data - replace with actual data fetching
  const item = {
    "appid": 381210,
    "classid": "2339867324",
    "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4eF0fqddYxPZA9-SjOKUn3IpCV4iqw",
    "name": "Anniversary Head Dwight 0401",
    "type": "",
    // get from pudeez later
    "price": "0.01 SUI",
    "status": "sale",
    "description": "A special anniversary head for Dwight, celebrating 0401.",
    "currentBid": "",
    "endsIn": "",
  };
  
  const owner = {
    "name": "Pudeez User",
    "avatar": "https://example.com/avatar.png"
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Item Image with Shimmer */}
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
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
              </CardContent>
            </Card>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{item.name}</h1>
              <p className="text-gray-400">{item.type}</p>
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

            <p className="text-gray-300">{item.description}</p>

            {/* Price/Bid Info */}
            {item.status === "sale" ? (
              <div className="space-y-2">
                <p className="text-gray-400">Price</p>
                <p className="text-2xl font-bold">{item.price}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Current Bid</p>
                    <p className="text-2xl font-bold">{item.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Ends In</p>
                    <p className="text-2xl font-bold text-purple-400">{item.endsIn}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                {item.status === "sale" ? (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4 mr-2" />
                    Place Bid
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