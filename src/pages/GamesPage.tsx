"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, ShoppingCart, Heart, Gamepad2, TrendingUp, Clock, Zap, Bot } from "lucide-react"
import Shimmer from "@/components/Shimmer"
import { useImageLoading } from "@/hooks/useImageLoading" // Import the new hook
import { cn } from "@/lib/utils" // Import cn for conditional class names

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { isLoading, handleImageLoad } = useImageLoading() // Use the hook at the top level

  const categories = [
    { id: "all", label: "All Games" },
    { id: "rpg", label: "RPG" },
    { id: "strategy", label: "Strategy" },
    { id: "action", label: "Action" },
    { id: "racing", label: "Racing" },
    { id: "sports", label: "Sports" },
  ]

  const gameNFTs = [
    {
      id: 1,
      title: "Legendary Sword of Fire",
      game: "Fantasy Quest",
      price: "2.5 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "rpg",
      rarity: "Legendary",
      isAuction: false,
      likes: 234,
    },
    {
      id: 2,
      title: "Cyber Racer X1",
      game: "Neon Racing",
      price: "1.8 ETH",
      image: "/placeholder.svg?height=300&width=300", // Added specific query
      category: "racing",
      rarity: "Epic",
      isAuction: true,
      likes: 189,
    },
    {
      id: 3,
      title: "Dragon Companion",
      game: "Mystic Realms",
      price: "3.2 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "rpg",
      rarity: "Mythic",
      isAuction: false,
      likes: 456,
    },
    {
      id: 4,
      title: "Space Station Alpha",
      game: "Galactic Empire",
      price: "5.0 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "strategy",
      rarity: "Legendary",
      isAuction: true,
      likes: 678,
    },
    {
      id: 5,
      title: "Warrior Armor Set",
      game: "Battle Legends",
      price: "1.2 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "action",
      rarity: "Rare",
      isAuction: false,
      likes: 123,
    },
    {
      id: 6,
      title: "Championship Trophy",
      game: "Pro Soccer 2024",
      price: "0.8 ETH",
      image: "/placeholder.svg?height=300&width=300",
      category: "sports",
      rarity: "Epic",
      isAuction: false,
      likes: 89,
    },
  ]

  const filteredNFTs = gameNFTs.filter((nft) => {
    const matchesSearch =
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.game.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || nft.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Mythic":
        return "bg-purple-600"
      case "Legendary":
        return "bg-orange-600"
      case "Epic":
        return "bg-blue-600"
      case "Rare":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Gaming NFTs</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover rare in-game items, characters, and assets from your favorite games
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search gaming NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.length > 0
            ? filteredNFTs.map((nft) => {
                return (
                  <Card
                    key={nft.id}
                    className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        {isLoading && <Shimmer className="absolute inset-0 w-full aspect-square rounded-t-lg" />}
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.title}
                          className={cn(
                            "w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300",
                            isLoading ? "opacity-0" : "opacity-100", // Fade in effect
                          )}
                          onLoad={handleImageLoad}
                          // Add key to force remount and re-trigger onLoad if src changes
                          key={nft.image || "/placeholder.svg"}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getRarityColor(nft.rarity)} text-white`}>{nft.rarity}</Badge>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {nft.isAuction && (
                            <Badge className="bg-red-600 text-white">
                              <Clock className="w-3 h-3 mr-1" />
                              Auction
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-white p-2">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-white mb-1">{nft.title}</h3>
                          <p className="text-sm text-gray-400">{nft.game}</p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Heart className="w-4 h-4 mr-1" />
                            {nft.likes}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">{nft.price}</div>
                            <div className="h-4">
                              {nft.isAuction && <div className="text-xs text-gray-400">Current bid</div>}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                          {nft.isAuction ? (
                            <Button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 h-10 text-sm">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Place Bid
                            </Button>
                          ) : (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 h-10 text-sm">
                              <Zap className="w-4 h-4 mr-2" />
                              Buy Now
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent w-10 h-10 p-0 flex items-center justify-center"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent w-10 h-10 p-0 flex items-center justify-center"
                          >
                            <Bot className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            : [1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Gamepad2 className="w-16 h-16 text-white/50" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Game NFT #{item}</h3>
                    <p className="text-gray-400 mb-3">Gaming Collection</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-semibold">{(Math.random() * 5 + 1).toFixed(1)} SUI</span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            Load More NFTs
          </Button>
        </div>
      </div>
    </div>
  )
}
