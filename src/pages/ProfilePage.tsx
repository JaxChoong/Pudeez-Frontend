// app/profile/page.tsx
"use client";

import { useState } from "react";
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

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const { isLoading: isCoverLoading, handleImageLoad: handleCoverLoad } = useImageLoading();
  const { isLoading: isAvatarLoading, handleImageLoad: handleAvatarLoad } = useImageLoading();
  const { isLoading, handleImageLoad } = useImageLoading();

  const apiReturns = {
  "assets": [
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122368",
      "classid": "2165368697",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122369",
      "classid": "2339867322",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122370",
      "classid": "2339867318",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122371",
      "classid": "2339867317",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122372",
      "classid": "2339867316",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122373",
      "classid": "2339867315",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122376",
      "classid": "2339867321",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122377",
      "classid": "2339867320",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122380",
      "classid": "2339867319",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122381",
      "classid": "2339867324",
      "instanceid": "0",
      "amount": "1"
    },
    {
      "appid": 381210,
      "contextid": "2",
      "assetid": "3348972860985122382",
      "classid": "2339867323",
      "instanceid": "0",
      "amount": "1"
    }
  ],
  "descriptions": [
    {
      "appid": 381210,
      "classid": "2165368697",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFgfqddYxPZBt_h643KgXsVSslYJH8",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFgfqddYxPZBt_h643KgXsVSslYJH8",
      "tradable": 0,
      "name": "Trapper CVGA 2016 Head",
      "type": "",
      "market_name": "Trapper CVGA 2016 Head",
      "market_hash_name": "Trapper CVGA 2016 Head",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867322",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFgfqddYxPZBN-SjOKUn3JkRzQI_Q",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFgfqddYxPZBN-SjOKUn3JkRzQI_Q",
      "tradable": 0,
      "name": "Anniversary Trapper Mask 0301",
      "type": "",
      "market_name": "Anniversary Trapper Mask 0301",
      "market_hash_name": "Anniversary Trapper Mask 0301",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867318",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFgfrgIMFmZWefHGBdYKQ",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFgfrgIMFmZWefHGBdYKQ",
      "tradable": 0,
      "name": "Anniversary Trapper W02",
      "type": "",
      "market_name": "Anniversary Trapper W02",
      "market_hash_name": "Anniversary Trapper W02",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867317",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFlfrgIMFmZWeeSMEcreQ",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFlfrgIMFmZWeeSMEcreQ",
      "tradable": 0,
      "name": "Anniversary Wraith W02",
      "type": "",
      "market_name": "Anniversary Wraith W02",
      "market_hash_name": "Anniversary Wraith W02",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867316",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFxfrgIMFmZWecgKUx6jg",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fFxfrgIMFmZWecgKUx6jg",
      "tradable": 0,
      "name": "Anniversary Hillbilly W02",
      "type": "",
      "market_name": "Anniversary Hillbilly W02",
      "market_hash_name": "Anniversary Hillbilly W02",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867315",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fF8frgIMVmZWedK7loGzQ",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4fF8frgIMVmZWedK7loGzQ",
      "tradable": 0,
      "name": "Anniversary Nurse W03",
      "type": "",
      "market_name": "Anniversary Nurse W03",
      "market_hash_name": "Anniversary Nurse W03",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867321",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4et5frtXcASGB7H9jf_KgXsVh4hWXKc",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4et5frtXcASGB7H9jf_KgXsVh4hWXKc",
      "tradable": 0,
      "name": "Anniversary Nea Torso 0103",
      "type": "",
      "market_name": "Anniversary Nea Torso 0103",
      "market_hash_name": "Anniversary Nea Torso 0103",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867320",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4eZ_frtXcASGB7L9_KKKmCVD3V57Jyf8SqWl",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4eZ_frtXcASGB7L9_KKKmCVD3V57Jyf8SqWl",
      "tradable": 0,
      "name": "Anniversary Claudette Torso 0201",
      "type": "",
      "market_name": "Anniversary Claudette Torso 0201",
      "market_hash_name": "Anniversary Claudette Torso 0201",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867319",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4ehmfrtXcASGB7L9_KKKmCVD3V57J2Uvyhim",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4ehmfrtXcASGB7L9_KKKmCVD3V57J2Uvyhim",
      "tradable": 0,
      "name": "Anniversary Meg Torso 0201",
      "type": "",
      "market_name": "Anniversary Meg Torso 0201",
      "market_hash_name": "Anniversary Meg Torso 0201",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    },
    {
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
      "sealed": 0
    },
    {
      "appid": 381210,
      "classid": "2339867323",
      "instanceid": "0",
      "currency": 0,
      "background_color": "",
      "icon_url": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4e9ifqddYxPZA9-SjOKUn3L1Hg9qDw",
      "icon_url_large": "70hL2L8i8T2NFs_wXTt0269q8WN-lB9mO2xF-pTCOadO6XGQirJFHK1523j8eF7ns7n1NjnVj3gOMRTfgpJceqkXBHHaSIyEbJv5SKpE4e9ifqddYxPZA9-SjOKUn3L1Hg9qDw",
      "tradable": 0,
      "name": "Anniversary Head Jake 0401",
      "type": "",
      "market_name": "Anniversary Head Jake 0401",
      "market_hash_name": "Anniversary Head Jake 0401",
      "commodity": 1,
      "marketable": 0,
      "sealed": 0
    }
  ],
  "total_inventory_count": 11,
  "success": 1,
  "rwgrsn": -2
};

  const userStats = [
    {label : "Items in Inventory", value: apiReturns.total_inventory_count.toString()},
    { label: "Items On Sale", value: "4" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "456" },
  ];


  const inventoryItems = apiReturns.descriptions.map((asset) => ({
    appId: asset.appid,
    classId: asset.classid,
    instanceId: asset.instanceid,
    name: asset.name,
    type: asset.type,
    iconUrl: `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url_large}`,
    smallIconUrl: asset.icon_url,
    marketName: asset.market_name,
    marketHashName: asset.market_hash_name,
    tradable: asset.tradable,
    marketable: asset.marketable,
    commodity: asset.commodity,
    sealed: asset.sealed,
    price: "0.01 SUI", // Placeholder, replace with actual price logic
    status: "inventory", // Placeholder, replace with actual status logic
    description: "No description available",
    currentBid: "", // Placeholder, replace with actual bid logic
    endsIn: "", // Placeholder, replace with actual auction end time logic
  }));

  const onSaleNFTs = [
    {
      appId: 1,
      title: "Mystic Fox",
      collection: "Urban Beasts",
      price: "3.1 ETH",
      image: "/placeholder.svg?height=300&width=300",
      status: "sale"
    },
    {
      appId: 2,
      title: "Silent Peak",
      collection: "Nature Spirits",
      price: "1.7 ETH",
      image: "/placeholder.svg?height=300&width=300",
      status: "sale"
    },
  ];

  const inAuctionNFTs = [
    {
      appId: 3,
      title: "Neon Samurai",
      collection: "Cyber Legends",
      currentBid: "4.5 ETH",
      endsIn: "2h 30m",
      image: "/placeholder.svg?height=300&width=300",
      status: "auction"
    },
    {
      appId: 4,
      title: "Dream Portal",
      collection: "Mystic Realms",
      currentBid: "2.2 ETH",
      endsIn: "5h 12m",
      image: "/placeholder.svg?height=300&width=300",
      status: "auction"
    },
  ];

  const allNFTs = [...inventoryItems, ...onSaleNFTs, ...inAuctionNFTs];

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
              Inventory ({allNFTs.length})
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
              {inventoryItems.map((item) => (
                <NFTCard key={item.classId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* On Sale Items */}
          <TabsContent value="on-sale">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onSaleNFTs.map((item) => (
                <NFTCard key={item.appId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* In Auction Items */}
          <TabsContent value="in-auction">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inAuctionNFTs.map((item) => (
                <NFTCard key={item.appId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
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
              "w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300",
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
              to={`/view/${item.appId}`} 
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
              <Link to={`/sell/${item.appId}`} className="w-2/3">
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