// app/profile/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  ShoppingCart,
  TrendingUp,
  Share,
  Copy,
  ExternalLink,
  Gavel,
  DollarSign,
} from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { useImageLoading } from "@/hooks/useImageLoading";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const { isLoading, handleImageLoad } = useImageLoading();

  const userStats = [
    {label : "Items in Inventory", value: "4"},
    { label: "Items On Sale", value: "4" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "456" },
  ];

  const onSaleNFTs = [
    {
      id: 1,
      title: "Mystic Fox",
      collection: "Urban Beasts",
      price: "3.1 ETH",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      title: "Silent Peak",
      collection: "Nature Spirits",
      price: "1.7 ETH",
      image: "null",
    },
  ];

  const inAuctionNFTs = [
    {
      id: 3,
      title: "Neon Samurai",
      collection: "Cyber Legends",
      currentBid: "4.5 ETH",
      endsIn: "2h 30m",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      title: "Dream Portal",
      collection: "Mystic Realms",
      currentBid: "2.2 ETH",
      endsIn: "5h 12m",
      image: "/placeholder.svg?height=300&width=300",
    },
  ];

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="relative">
            <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl overflow-hidden">
              {isLoading && <Shimmer className="w-full h-full" />}
              <img
                src="/placeholder.svg?height=256&width=1024"
                alt="Profile Cover"
                className={cn(
                  "w-full h-full object-cover",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={handleImageLoad}
              />
            </div>

            <div className="relative -mt-16 px-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="w-32 h-32 border-4 border-white/20 bg-gradient-to-r from-purple-500 to-pink-500">
                  {isLoading && <Shimmer className="w-full h-full rounded-full" />}
                  <AvatarImage 
                    src="/placeholder.svg?height=128&width=128" 
                    className={cn(isLoading ? "opacity-0" : "opacity-100")}
                    onLoad={handleImageLoad}
                  />
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">John Doe</h1>
                      <p className="text-gray-300 mb-2">@johndoe_nft</p>
                      <p className="text-gray-400 max-w-2xl">
                        NFT artist and collector, sharing visions through blockchain.
                      </p>
                    </div>
                    <div className="flex gap-3 border-white mt-10">
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent ">
                        <Share className="w-4 h-4 mr-2" /> Share
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" /> Copy Link
                      </Button>
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {userStats.map((stat, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs for NFTs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-white/10 border-white/20 mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              All Items ({onSaleNFTs.length + inAuctionNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="on-sale" className="data-[state=active]:bg-purple-600">
              On Sale ({onSaleNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="in-auction" className="data-[state=active]:bg-purple-600">
              In Auction ({inAuctionNFTs.length})
            </TabsTrigger>
          </TabsList>

          {/* All Items */}
          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...onSaleNFTs, ...inAuctionNFTs].map((nft) => (
                <NFTCard key={nft.id} nft={nft} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* On Sale Items */}
          <TabsContent value="on-sale">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onSaleNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* In Auction Items */}
          <TabsContent value="in-auction">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inAuctionNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Updated NFTCard Component with shimmer effect
function NFTCard({ nft, isLoading, handleImageLoad }: { nft: any, isLoading: boolean, handleImageLoad: () => void }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {isLoading && <Shimmer className="absolute inset-0 w-full aspect-square" />}
          <img
            src={nft.image}
            alt={nft.title}
            className={cn(
              "w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1">{nft.title}</h3>
          <p className="text-sm text-gray-400 mb-3">{nft.collection}</p>

          {"price" in nft ? (
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-white">{nft.price}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-300">Current Bid</div>
                <div className="text-sm text-gray-300">Ends In</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-white">{nft.currentBid}</div>
                <div className="text-sm font-medium text-purple-300">{nft.endsIn}</div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Gavel className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <DollarSign className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}