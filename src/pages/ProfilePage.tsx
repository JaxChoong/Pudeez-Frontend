// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom"; 
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
  Tag,
  Hammer,
  Box,
} from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { useImageLoading } from "@/hooks/useImageLoading";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/lib/utils";

export default function ProfilePage() {
  const walletAddress = getCookie("wallet_address");
  const [isFollowing, setIsFollowing] = useState(false);
  const { isLoading: isCoverLoading, handleImageLoad: handleCoverLoad } = useImageLoading();
  const { isLoading: isAvatarLoading, handleImageLoad: handleAvatarLoad } = useImageLoading();
  const { isLoading, handleImageLoad } = useImageLoading();
  interface ApiReturns {
    assets?: Array<any>;
    // add other properties if needed
  }
  const [apiReturns, setApiReturns] = useState<ApiReturns | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteamProfileId = async () => {
      try {
        const response = await fetch(`http://localhost:3111/api/user/get_steamid`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: walletAddress })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.steamID;
      } catch (err) {
        console.error('Error fetching Steam profile ID:', err);
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    }

    const fetchData = async (steamProfileId: string) => {
      try {
        setIsLoadingData(true);
        
        // Option 1: Use your backend as a proxy to Steam Web API
        // Your backend should make the call to: 
        // https://api.steampowered.com/IEconItems_730/GetPlayerItems/v0001/?key=YOUR_API_KEY&steamid=${steamProfileId}&format=json
        const response = await fetch(`http://localhost:3111/api/steam/inventory/${steamProfileId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle Steam Web API response structure
        if (data.result && data.result.items) {
          setApiReturns({ assets: data.result.items });
        } else {
          setApiReturns(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error('Error fetching Steam inventory:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    const initializeData = async () => {
      const steamProfileId = await fetchSteamProfileId();
      console.log("Steam Profile ID:", steamProfileId);
      
      if (steamProfileId) {
        await fetchData(steamProfileId);
      }
    };

    initializeData();
  }, []);

  // Add loading and error states
  if (isLoadingData) {
    return <div className="min-h-screen pt-8 flex items-center justify-center">
      <div className="text-white">Loading inventory...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen pt-8 flex items-center justify-center">
      <div className="text-red-400">Error: {error}</div>
    </div>;
  }

  // Safe access to assets with null check
  const userAssets = apiReturns?.assets?.map((asset: any) => ({
    assetId: asset.assetid,
    classId: asset.classid,
    instanceId: asset.instanceid,
    iconUrl: `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}`,
    name: asset.name,
    amount: asset.amount,
    contextId: asset.contextid,
    status: "inventory",
    description: "none",
    price: "0.01 ETH",
  })) || [];

  console.log("User Assets:", userAssets);
  const userStats = [
    {label : "Items in Inventory", value: userAssets.length.toString()},
    { label: "Items On Sale", value: "4" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "456" },
  ];



  const onSaleNFTs = [
    {
      assetId: 1,
      name: "Mystic Fox",
      collection: "Urban Beasts",
      price: "3.1 ETH",
      iconUrl: "/placeholder.svg?height=300&width=300",
      status: "sale"
    },
    {
      assetId: 2,
      name: "Silent Peak",
      collection: "Nature Spirits",
      price: "1.7 ETH",
      iconUrl: "/placeholder.svg?height=300&width=300",
      status: "sale"
    },
  ];

  const inAuctionNFTs = [
    {
      assetId: 3,
      name: "Neon Samurai",
      collection: "Cyber Legends",
      currentBid: "4.5 ETH",
      endsIn: "2h 30m",
      iconUrl: "/placeholder.svg?height=300&width=300",
      status: "auction"
    },
    {
      assetId: 4,
      name: "Dream Portal",
      collection: "Mystic Realms",
      currentBid: "2.2 ETH",
      endsIn: "5h 12m",
      iconUrl: "/placeholder.svg?height=300&width=300",
      status: "auction"
    },
  ];

  const allNFTs = [...userAssets, ...onSaleNFTs, ...inAuctionNFTs];

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="relative">
            <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl overflow-hidden">
              {isCoverLoading && <Shimmer className="w-full h-full" />}
              <img
                src="/placeholder.svg?height=256&width=1024"
                alt="Profile Cover"
                className={cn(
                  "w-full h-full object-cover",
                  isCoverLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={handleCoverLoad}
              />
            </div>

            <div className="relative -mt-16 px-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="w-32 h-32 border-4 border-white/20 bg-gradient-to-r from-purple-500 to-pink-500">
                  {isAvatarLoading && <Shimmer className="w-full h-full rounded-full" />}
                  <AvatarImage 
                    src="/placeholder.svg?height=128&width=128" 
                    className={cn(isAvatarLoading ? "opacity-0" : "opacity-100")}
                    onLoad={handleAvatarLoad}
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
              Inventory ({userAssets.length})
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
              {userAssets.map((item) => (
                <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* On Sale Items */}
          <TabsContent value="on-sale">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onSaleNFTs.map((item) => (
                <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* In Auction Items */}
          <TabsContent value="in-auction">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inAuctionNFTs.map((item) => (
                <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NFTCard({ item, isLoading, handleImageLoad }: { item: any, isLoading: boolean, handleImageLoad: () => void }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-lg">
          {isLoading && <Shimmer className="absolute inset-0 w-full aspect-square" />}
          <img
            src={item.iconUrl}
            alt={item.name}
            className={cn(
              "w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
          />
          
          {/* Status Badge */}
          {item.status === "sale" && (
            <Badge className="absolute top-2 left-2 bg-green-500/80 hover:bg-green-500/90">
              <Tag className="w-3 h-3 mr-1" /> For Sale
            </Badge>
          )}
          {item.status === "auction" && (
            <Badge className="absolute top-2 left-2 bg-purple-500/80 hover:bg-purple-500/90">
              <Hammer className="w-3 h-3 mr-1" /> Auction
            </Badge>
          )}
          {item.status === "inventory" && (
            <Badge className="absolute top-2 left-2 bg-blue-500/80 hover:bg-blue-500/90">
              <Box className="w-3 h-3 mr-1" /> Inventory
            </Badge>
          )}
        </div>
        
 {/* Content Section with fixed bottom alignment */}
        <div className="p-4 flex flex-col" style={{ minHeight: '160px' }}>
          {/* Text Content */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{item.type}</p>

            {/* Price/Bid Information */}
            <div className="mb-1">
              {item.status === "sale" && (
                <div className="text-lg font-bold text-white">{item.price}</div>
              )}
              {item.status === "auction" && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-0.5">
                    <span className="text-gray-300">Current Bid</span>
                    <span className="text-gray-300">Ends In</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{item.currentBid}</span>
                    <span className="text-sm font-medium text-purple-300">{item.endsIn}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons Container - Fixed at bottom */}
          <div className="flex justify-between gap-2 pt-2">
            <Link 
              to={`/view/${item.assetId}`} 
              className={item.status === "inventory" ? "w-1/3" : "w-full"}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent px-2 h-8"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs ml-1">View</span>
              </Button>
            </Link>
            
            {item.status === "inventory" && (
              <Link to={`/sell/${item.assetId}`} className="w-2/3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent px-2 h-8"
                >
                  <Tag className="w-3 h-3" />
                  <span className="text-xs ml-1">Pudeez for Sale</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}