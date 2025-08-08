"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, TrendingUp, ShoppingCart, Heart, Eye, ExternalLink, Download, Filter } from "lucide-react"

export default function HistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const transactionHistory = [
    {
      id: 1,
      type: "purchase",
      item: {
        title: "Cosmic Dreams #1",
        image: "/placeholder.svg?height=80&width=80",
        collection: "Cosmic Collection",
      },
  price: "4.2 Sui",
      from: "ArtistX",
      to: "You",
      date: "2024-01-15",
      time: "14:30",
      txHash: "0x1234...5678",
      status: "completed",
    },
    {
      id: 2,
      type: "sale",
      item: {
        title: "Digital Warrior",
        image: "/placeholder.svg?height=80&width=80",
        collection: "Battle Legends",
      },
  price: "2.8 Sui",
      from: "You",
      to: "GameCollector",
      date: "2024-01-14",
      time: "09:15",
      txHash: "0xabcd...efgh",
      status: "completed",
    },
    {
      id: 3,
      type: "bid",
      item: {
        title: "Abstract Mind",
        image: "/placeholder.svg?height=80&width=80",
        collection: "Modern Art",
      },
  price: "1.5 Sui",
      from: "You",
      to: "ModernArt",
      date: "2024-01-13",
      time: "16:45",
      txHash: "0x9876...5432",
      status: "outbid",
    },
    {
      id: 4,
      type: "listing",
      item: {
        title: "Space Helmet",
        image: "/placeholder.svg?height=80&width=80",
        collection: "Sci-Fi Collection",
      },
  price: "3.1 Sui",
      from: "You",
      to: "Marketplace",
      date: "2024-01-12",
      time: "11:20",
      txHash: "0xfedc...ba98",
      status: "active",
    },
  ]

  const viewHistory = [
    {
      id: 1,
      item: {
        title: "Neon Cityscape",
        image: "/placeholder.svg?height=60&width=60",
        collection: "Urban Art",
      },
      viewedAt: "2024-01-15 18:30",
      duration: "2m 34s",
    },
    {
      id: 2,
      item: {
        title: "Dragon Companion",
        image: "/placeholder.svg?height=60&width=60",
        collection: "Fantasy Realm",
      },
      viewedAt: "2024-01-15 17:45",
      duration: "1m 12s",
    },
    {
      id: 3,
      item: {
        title: "Cyber Racer",
        image: "/placeholder.svg?height=60&width=60",
        collection: "Racing League",
      },
      viewedAt: "2024-01-15 16:20",
      duration: "45s",
    },
  ]

  const favoriteHistory = [
    {
      id: 1,
      item: {
        title: "Mystic Portal",
        image: "/placeholder.svg?height=60&width=60",
        collection: "Magic Realm",
      },
      addedAt: "2024-01-14 20:15",
  currentPrice: "5.2 Sui",
    },
    {
      id: 2,
      item: {
        title: "Golden Sword",
        image: "/placeholder.svg?height=60&width=60",
        collection: "Legendary Items",
      },
      addedAt: "2024-01-13 14:30",
  currentPrice: "3.8 Sui",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "failed":
        return "bg-red-600"
      case "outbid":
        return "bg-orange-600"
      case "active":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="w-4 h-4" />
      case "sale":
        return <TrendingUp className="w-4 h-4" />
      case "bid":
        return <TrendingUp className="w-4 h-4" />
      case "listing":
        return <Eye className="w-4 h-4" />
      default:
        return <History className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Activity History</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Track your transactions, views, and favorites</p>
        </div>

        {/* History Tabs */}
        <Tabs defaultValue="transactions" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <TabsList className="bg-white/10 border-white/20 mb-4 md:mb-0">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="views" className="data-[state=active]:bg-purple-600">
                Recently Viewed
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-purple-600">
                Favorites
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="transactions">
            <div className="space-y-4">
              {transactionHistory.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Transaction Type Icon */}
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(transaction.type)}
                      </div>

                      {/* NFT Image */}
                      <img
                        src={transaction.item.image || "/placeholder.svg"}
                        alt={transaction.item.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />

                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{transaction.item.title}</h3>
                            <p className="text-sm text-gray-400">{transaction.item.collection}</p>
                          </div>
                          <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                            {transaction.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Type</p>
                            <p className="text-white capitalize">{transaction.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Price</p>
                            <p className="text-white font-semibold">{transaction.price}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">From/To</p>
                            <p className="text-white">
                              {transaction.from} → {transaction.to}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Date</p>
                            <p className="text-white">
                              {transaction.date} {transaction.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <span>TX: {transaction.txHash}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Explorer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="views">
            <div className="space-y-4">
              {viewHistory.map((view) => (
                <Card
                  key={view.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Eye className="w-6 h-6 text-white" />
                      </div>

                      <img
                        src={view.item.image || "/placeholder.svg"}
                        alt={view.item.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{view.item.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{view.item.collection}</p>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <p className="text-gray-400">Viewed At</p>
                            <p className="text-white">{view.viewedAt}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Duration</p>
                            <p className="text-white">{view.duration}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        View Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="space-y-4">
              {favoriteHistory.map((favorite) => (
                <Card
                  key={favorite.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-white" />
                      </div>

                      <img
                        src={favorite.item.image || "/placeholder.svg"}
                        alt={favorite.item.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{favorite.item.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{favorite.item.collection}</p>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <p className="text-gray-400">Added</p>
                            <p className="text-white">{favorite.addedAt}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Current Price</p>
                            <p className="text-white font-semibold">{favorite.currentPrice}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          View NFT
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
