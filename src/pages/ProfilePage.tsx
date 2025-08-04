"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Heart, ShoppingCart, TrendingUp, Edit, Share, Copy, ExternalLink } from "lucide-react"

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false)

  const userStats = [
    { label: "NFTs Owned", value: "47" },
    { label: "NFTs Created", value: "23" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "456" },
  ]

  const ownedNFTs = [
    {
      id: 1,
      title: "Cosmic Dreams #1",
      collection: "Cosmic Collection",
      price: "4.2 ETH",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      title: "Digital Warrior",
      collection: "Battle Legends",
      price: "2.8 ETH",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      title: "Abstract Mind",
      collection: "Modern Art",
      price: "1.5 ETH",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const createdNFTs = [
    {
      id: 1,
      title: "My First Creation",
      collection: "Personal Collection",
      price: "0.5 ETH",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      title: "Digital Landscape",
      collection: "Nature Series",
      price: "1.2 ETH",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=256&width=1024"
                alt="Profile Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="relative -mt-16 px-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="w-32 h-32 border-4 border-white/20 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-2xl font-bold">JD</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">John Doe</h1>
                      <p className="text-gray-300 mb-2">@johndoe_nft</p>
                      <p className="text-gray-400 max-w-2xl">
                        Digital artist and NFT collector passionate about creating unique digital experiences. Exploring
                        the intersection of art and technology.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
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

        {/* Profile Tabs */}
        <Tabs defaultValue="owned" className="mb-8">
          <TabsList className="bg-white/10 border-white/20 mb-8">
            <TabsTrigger value="owned" className="data-[state=active]:bg-purple-600">
              Owned ({ownedNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="created" className="data-[state=active]:bg-purple-600">
              Created ({createdNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="favorited" className="data-[state=active]:bg-purple-600">
              Favorited
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ownedNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.title}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-white p-2">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{nft.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{nft.collection}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-white">{nft.price}</div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="created">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {createdNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.title}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-white p-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{nft.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{nft.collection}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-white">{nft.price}</div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorited">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No favorited items yet</p>
              <p className="text-gray-500 text-sm">Items you like will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-4">
              {[
                { action: "Purchased", item: "Cosmic Dreams #1", time: "2 hours ago", price: "4.2 ETH" },
                { action: "Listed", item: "Digital Warrior", time: "1 day ago", price: "2.8 ETH" },
                { action: "Created", item: "Abstract Mind", time: "3 days ago", price: "1.5 ETH" },
                { action: "Sold", item: "My First Creation", time: "1 week ago", price: "0.5 ETH" },
              ].map((activity, index) => (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {activity.action} <span className="text-purple-400">{activity.item}</span>
                          </p>
                          <p className="text-gray-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{activity.price}</p>
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
