"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, List, Grid3X3, Filter, Clock, Heart, TrendingUp, Zap, ShoppingCart, Bot } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Shimmer from "@/components/Shimmer"
import { useImageLoading } from "@/hooks/useImageLoading" // Import the new hook
import { cn } from "@/lib/utils" // Import cn for conditional class names

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const { isLoading, handleImageLoad } = useImageLoading() // Use the hook at the top level

  const allNFTs = [
    {
      id: "1",
      title: "Cosmic Dreams",
      creator: "ArtistX",
      price: "4.2 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "art",
      isAuction: false,
      likes: 892,
      timeLeft: null,
    },
    {
      id: "2",
      title: "Legendary Sword",
      creator: "GameDev",
      price: "2.8 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "gaming",
      isAuction: true,
      likes: 567,
      timeLeft: "2h 34m",
    },
    {
      id: "3",
      title: "Digital Portrait",
      creator: "PixelArt",
      price: "1.5 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "art",
      isAuction: false,
      likes: 234,
      timeLeft: null,
    },
    {
      id: "4",
      title: "Space Helmet",
      creator: "SciFiGamer",
      price: "3.1 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "gaming",
      isAuction: true,
      likes: 445,
      timeLeft: "5h 12m",
    },
  ]

  const filteredNFTs = allNFTs.filter(
    (nft) =>
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.creator.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderNFTCard = (nft: any, isGridView = true) => {
    return (
      <Card
        key={nft.id}
        className="cyber-card group cursor-pointer transform hover:scale-105 transition-all duration-300"
      >
        <CardContent className="p-0">
          {isGridView ? (
            <>
              <div className="relative overflow-hidden">
                {isLoading && <Shimmer className="absolute inset-0 w-full aspect-square rounded-t-lg" />}
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.title}
                  className={cn(
                    "w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500",
                    isLoading ? "opacity-0" : "opacity-100", // Fade in effect
                  )}
                  onLoad={handleImageLoad}
                  key={nft.image || "/placeholder.svg"}
                />
                <div className="absolute top-3 left-3">
                  <Badge
                    className={
                      nft.category === "art"
                        ? "neon-border-pink bg-pink-500/20 text-pink-400"
                        : "neon-border-cyan bg-cyan-500/20 text-cyan-400"
                    }
                  >
                    {nft.category.toUpperCase()}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {nft.isAuction && (
                    <Badge className="neon-border bg-red-500/20 text-red-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {nft.timeLeft}
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-pink-400 p-2">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold neon-text-cyan mb-1 font-mono">{nft.title}</h3>
                <p className="text-sm text-gray-400 mb-3 font-mono">by {nft.creator}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400 text-sm font-mono">
                    <Heart className="w-4 h-4 mr-1" />
                    {nft.likes}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold neon-text-pink font-mono">{nft.price}</div>
                    <div className="h-4 font-mono">
                      {nft.isAuction && <div className="text-xs text-gray-400">CURRENT BID</div>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-2 mb-3">
                  {nft.isAuction ? (
                    <Button className="neon-button-pink font-mono uppercase text-xs h-10 px-4">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      BID
                    </Button>
                  ) : (
                    <Button className="neon-button-cyan font-mono uppercase text-xs h-10 px-4">
                      <Zap className="w-4 h-4 mr-2" />
                      BUY
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="neon-button-purple bg-transparent w-10 h-10 p-0 flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="neon-button-cyan bg-transparent w-10 h-10 p-0 flex items-center justify-center"
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center p-4 gap-4">
              {isLoading && <Shimmer className="w-20 h-20 rounded-lg flex-shrink-0" />}
              <img
                src={nft.image || "/placeholder.svg"}
                alt={nft.title}
                className={cn(
                  "w-20 h-20 object-cover rounded-lg flex-shrink-0",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                onLoad={handleImageLoad}
                key={nft.image || "/placeholder.svg"}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold neon-text-cyan font-mono">{nft.title}</h3>
                  <Badge
                    className={
                      nft.category === "art"
                        ? "neon-border-pink bg-pink-500/20 text-pink-400"
                        : "neon-border-cyan bg-cyan-500/20 text-cyan-400"
                    }
                  >
                    {nft.category.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 font-mono">by {nft.creator}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold neon-text-pink font-mono mb-1">{nft.price}</div>
                <div className="h-4 font-mono">
                  {nft.isAuction && <div className="text-xs text-gray-400">CURRENT BID</div>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="neon-button-cyan font-mono uppercase text-xs h-8 px-3"
                >
                  <Bot className="w-4 h-4 mr-1" />
                  AI
                </Button>
                {nft.isAuction ? (
                  <Button className="neon-button-pink font-mono uppercase text-xs h-8 px-4">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    BID
                  </Button>
                ) : (
                  <Button className="neon-button-cyan font-mono uppercase text-xs h-8 px-4">
                    <Zap className="w-4 h-4 mr-2" />
                    BUY
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="glitch-text neon-text-cyan" data-text="PUDEEZ">
              PUDEEZ
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            DISCOVER, ACQUIRE, AND TRADE UNIQUE DIGITAL ASSETS
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <Input
                placeholder="SEARCH NEURAL NETWORK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-cyan-400/30 text-cyan-400 placeholder-gray-500 font-mono uppercase text-sm neon-border"
              />
            </div>
            <div className="flex gap-2">
              <Button className="neon-button-cyan font-mono uppercase text-xs">
                <Filter className="w-4 h-4 mr-2" />
                FILTERS
              </Button>
              <div className="flex neon-border overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "neon-button-cyan" : "text-gray-400 hover:text-cyan-400"}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "neon-button-cyan" : "text-gray-400 hover:text-cyan-400"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="cyber-card">
            <TabsTrigger value="all" className="data-[state=active]:neon-button-cyan font-mono uppercase text-xs">
              ALL ITEMS
            </TabsTrigger>
            <TabsTrigger value="art" className="data-[state=active]:neon-button-pink font-mono uppercase text-xs">
              ART
            </TabsTrigger>
            <TabsTrigger value="gaming" className="data-[state=active]:neon-button-cyan font-mono uppercase text-xs">
              GAMING
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              {filteredNFTs.map((nft) => renderNFTCard(nft, viewMode === "grid"))}
            </div>
          </TabsContent>

          <TabsContent value="art">
            <div
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              {filteredNFTs
                .filter((nft) => nft.category === "art")
                .map((nft) => renderNFTCard(nft, viewMode === "grid"))}
            </div>
          </TabsContent>

          <TabsContent value="gaming">
            <div
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              {filteredNFTs
                .filter((nft) => nft.category === "gaming")
                .map((nft) => renderNFTCard(nft, viewMode === "grid"))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}
