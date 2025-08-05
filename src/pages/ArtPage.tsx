"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, ShoppingCart, Heart, Palette, TrendingUp, Clock, Zap, Eye, Bot } from "lucide-react"
import Shimmer from "@/components/Shimmer"
import { useImageLoading } from "@/hooks/useImageLoading" // Import the new hook
import { cn } from "@/lib/utils" // Import cn for conditional class names

export default function ArtPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { isLoading, handleImageLoad } = useImageLoading() // Use the hook at the top level

  const categories = [
    { id: "all", label: "All Art" },
    { id: "digital", label: "Digital Art" },
    { id: "photography", label: "Photography" },
    { id: "abstract", label: "Abstract" },
    { id: "portrait", label: "Portrait" },
    { id: "landscape", label: "Landscape" },
  ]

  const artNFTs = [
    {
      id: 1,
      title: "Cosmic Dreams",
      artist: "ArtistX",
      price: "4.2 ETH",
      image: "/placeholder.svg?height=400&width=400",
      category: "digital",
      isAuction: false,
      likes: 892,
      views: 2341,
    },
    {
      id: 2,
      title: "Neon Cityscape",
      artist: "CyberArt",
      price: "2.8 ETH",
      image: "/placeholder.svg?height=400&width=400",
      category: "digital",
      isAuction: true,
      likes: 567,
      views: 1823,
    },
    {
      id: 3,
      title: "Abstract Emotions",
      artist: "ModernMind",
      price: "1.5 ETH",
      image: "/placeholder.svg?height=400&width=400",
      category: "abstract",
      isAuction: false,
      likes: 234,
      views: 987,
    },
    {
      id: 4,
      title: "Portrait of Tomorrow",
      artist: "FutureVision",
      price: "6.0 ETH",
      image: "/placeholder.svg?height=400&width=400",
      category: "portrait",
      isAuction: true,
      likes: 1234,
      views: 3456,
    },
    {
      id: 5,
      title: "Digital Sunset",
      artist: "NaturePixel",
      price: "3.1 ETH",
      image: "/placeholder.svg?height=400&width=400",
      category: "landscape",
      isAuction: false,
      likes: 445,
      views: 1567,
    },
    {
      id: 6,
      title: "Urban Photography",
      artist: "StreetLens",
      price: "0.9 ETH",
      image: "/placeholder.svg?height=400&width=400",
      category: "photography",
      isAuction: false,
      likes: 178,
      views: 654,
    },
  ]

  const filteredNFTs = artNFTs.filter((nft) => {
    const matchesSearch =
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.artist.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || nft.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-pink-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Digital Art NFTs</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore unique digital artworks from talented creators around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search art NFTs..."
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
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNFTs.length > 0
            ? filteredNFTs.map((nft) => (
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
                        key={nft.image || "/placeholder.svg"}
                      />
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
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                          <h3 className="text-lg font-semibold text-white mb-1">{nft.title}</h3>
                          <p className="text-sm text-gray-300">by {nft.artist}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {nft.likes}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {nft.views}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{nft.price}</div>
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
                          <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 h-10 text-sm">
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
              ))
            : [1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-red-500/20 flex items-center justify-center">
                    <Palette className="w-16 h-16 text-white/50" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Art Piece #{item}</h3>
                    <p className="text-gray-400 mb-4">Digital Art Collection</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-400 font-semibold">{(Math.random() * 10 + 2).toFixed(1)} SUI</span>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            Load More Artworks
          </Button>
        </div>
      </div>
    </div>
  )
}
