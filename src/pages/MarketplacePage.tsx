"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, List, Grid3X3, Filter, Clock, Heart, TrendingUp, Zap, ShoppingCart, Bot, Gamepad2,Ban } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Shimmer from "@/components/Shimmer"
import { useImageLoading } from "@/hooks/useImageLoading"
import { cn } from "@/lib/utils"

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedGame, setSelectedGame] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const { isLoading, handleImageLoad } = useImageLoading()

  // Steam-like game genres
  const genres = [
    { id: "all", label: "ALL GENRES" },
    { id: "action", label: "ACTION" },
    { id: "rpg", label: "RPG" },
    { id: "strategy", label: "STRATEGY" },
    { id: "fps", label: "FPS" },
    { id: "moba", label: "MOBA" },
    { id: "racing", label: "RACING" },
    { id: "sports", label: "SPORTS" },
    { id: "simulation", label: "SIMULATION" },
  ]

  // Popular Steam games
  const games = [
    { id: "all", label: "ALL GAMES" },
    { id: "csgo", label: "CS:GO" },
    { id: "dota2", label: "DOTA 2" },
    { id: "tf2", label: "TF2" },
    { id: "rust", label: "RUST" },
    { id: "pubg", label: "PUBG" },
    { id: "apex", label: "APEX LEGENDS" },
    { id: "valorant", label: "VALORANT" },
    { id: "rocket-league", label: "ROCKET LEAGUE" },
  ]

  // Steam game items data structure
  const gameItems = [
    {
      id: "1",
      title: "AK-47 | Redline",
      game: "Counter-Strike: Global Offensive",
      gameId: "csgo",
      price: "2.5 ETH",
      steamPrice: "$45.20",
      image: "/placeholder.svg?height=300&width=300",
      genre: "fps",
      rarity: "Classified",
      condition: "Field-Tested",
      isAuction: false,
      likes: 1234,
      timeLeft: null,
      steamMarketUrl: "https://steamcommunity.com/market/listings/730/AK-47%20%7C%20Redline%20%28Field-Tested%29",
    },
    {
      id: "2",
      title: "Arcana: Fractal Horns of Inner Abysm",
      game: "Dota 2",
      gameId: "dota2",
      price: "8.7 ETH",
      steamPrice: "$156.99",
      image: "/placeholder.svg?height=300&width=300",
      genre: "moba",
      rarity: "Arcana",
      condition: "Immortal",
      isAuction: true,
      likes: 2341,
      timeLeft: "2h 34m",
      steamMarketUrl: "https://steamcommunity.com/market/listings/570/Fractal%20Horns%20of%20Inner%20Abysm",
    },
    {
      id: "3",
      title: "Unusual Burning Flames Team Captain",
      game: "Team Fortress 2",
      gameId: "tf2",
      price: "15.2 ETH",
      steamPrice: "$275.00",
      image: "/placeholder.svg?height=300&width=300",
      genre: "fps",
      rarity: "Unusual",
      condition: "Unique",
      isAuction: true,
      likes: 892,
      timeLeft: "5h 12m",
      steamMarketUrl: "https://steamcommunity.com/market/listings/440/Unusual%20Team%20Captain",
    },
    {
      id: "4",
      title: "Assault Rifle - Tempered AK47",
      game: "Rust",
      gameId: "rust",
      price: "1.8 ETH",
      steamPrice: "$32.50",
      image: "/placeholder.svg?height=300&width=300",
      genre: "action",
      rarity: "Rare",
      condition: "Factory New",
      isAuction: false,
      likes: 567,
      timeLeft: null,
      steamMarketUrl: "https://steamcommunity.com/market/listings/252490/Assault%20Rifle%20-%20Tempered%20AK47",
    },
    {
      id: "5",
      title: "AWP | Dragon Lore",
      game: "Counter-Strike: Global Offensive",
      gameId: "csgo",
      price: "45.0 ETH",
      steamPrice: "$8,120.00",
      image: "/placeholder.svg?height=300&width=300",
      genre: "fps",
      rarity: "Covert",
      condition: "Factory New",
      isAuction: true,
      likes: 5678,
      timeLeft: "1d 3h",
      steamMarketUrl: "https://steamcommunity.com/market/listings/730/AWP%20%7C%20Dragon%20Lore%20%28Factory%20New%29",
    },
    {
      id: "6",
      title: "Octane: Dune Racer",
      game: "Rocket League",
      gameId: "rocket-league",
      price: "3.2 ETH",
      steamPrice: "$58.75",
      image: "/placeholder.svg?height=300&width=300",
      genre: "sports",
      rarity: "Limited",
      condition: "Titanium White",
      isAuction: false,
      likes: 1456,
      timeLeft: null,
      steamMarketUrl: "https://steamcommunity.com/market/listings/252950/Octane%3A%20Dune%20Racer",
    },
  ]

  const filteredItems = gameItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.game.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === "all" || item.genre === selectedGenre
    const matchesGame = selectedGame === "all" || item.gameId === selectedGame
    return matchesSearch && matchesGenre && matchesGame
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Arcana":
      case "Unusual":
        return "neon-border-purple bg-purple-500/20 text-purple-400"
      case "Covert":
      case "Limited":
        return "neon-border-pink bg-pink-500/20 text-pink-400"
      case "Classified":
        return "neon-border bg-red-500/20 text-red-400"
      case "Rare":
        return "neon-border-cyan bg-cyan-500/20 text-cyan-400"
      default:
        return "neon-border bg-gray-500/20 text-gray-400"
    }
  }

  const renderGameItemCard = (item: any, isGridView = true) => {
    return (
      <Card
        key={item.id}
        className="cyber-card group cursor-pointer transform hover:scale-105 transition-all duration-300"
      >
        <CardContent className="p-0">
          {isGridView ? (
            <>
              <div className="relative overflow-hidden">
                {isLoading && <Shimmer className="absolute inset-0 w-full aspect-square rounded-t-lg" />}
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className={cn(
                    "w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={handleImageLoad}
                  key={item.image || "/placeholder.svg"}
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getRarityColor(item.rarity)}>{item.rarity.toUpperCase()}</Badge>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {item.isAuction && (
                    <Badge className="neon-border bg-red-500/20 text-red-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.timeLeft}
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" className="bg-black/50 hover:bg-black/70 text-pink-400 p-2">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold neon-text-cyan mb-1 font-mono h-12" >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 font-mono">{item.game}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400 text-sm font-mono">
                    <Heart className="w-4 h-4 mr-1" />
                    {item.likes}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold neon-text-pink font-mono">{item.price}</div>
                    <div className="text-xs text-gray-400 font-mono">Steam: {item.steamPrice}</div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-2 mb-3">
                  {item.isAuction ? (
                        <Link to={`/bid/${item.id}`}>
                          <span className="neon-button-pink font-mono uppercase text-xs h-10 px-4 flex items-center justify-center bg-white text-black rounded-md hover:bg-pink-50 transition-all duration-300">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            BID
                          </span>
                        </Link>
                  ) : (
                        <Link
                          to={`/buy/${item.id}`}
                          className="neon-button-cyan font-mono uppercase text-xs h-10 px-4 items-center justify-center flex bg-white text-black rounded-md hover:bg-cyan-100 transition-all duration-300"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          BUY
                        </Link>
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
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className={cn(
                  "w-20 h-20 object-cover rounded-lg flex-shrink-0",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                onLoad={handleImageLoad}
                key={item.image || "/placeholder.svg"}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold neon-text-cyan font-mono">{item.title}</h3>
                  <Badge className={getRarityColor(item.rarity)}>{item.rarity.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-gray-400 font-mono">{item.game}</p>
                <p className="text-xs text-gray-500 font-mono">{item.condition}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold neon-text-pink font-mono mb-1">{item.price}</div>
                <div className="text-xs text-gray-400 font-mono">Steam: {item.steamPrice}</div>
                <div className="h-4 font-mono">
                  {item.isAuction && <div className="text-xs text-gray-400">CURRENT BID</div>}
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
                {item.isAuction ? (
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
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-cyan-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
              <span className="glitch-text neon-text-cyan" data-text="STEAM">
                GAME
              </span>
              <span className="neon-text-pink ml-4">ITEMS</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            TRADE RARE STEAM GAME ITEMS ON THE BLOCKCHAIN
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <Input
                placeholder="SEARCH STEAM ITEMS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-cyan-400/30 text-cyan-400 placeholder-gray-500 font-mono uppercase text-sm neon-border"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="neon-button-cyan font-mono uppercase text-xs">
                    <Filter className="w-4 h-4 mr-2" />
                    FILTERS
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-black/90 border-cyan-400/30 neon-border">
                  <DropdownMenuLabel className="font-mono text-cyan-400 uppercase tracking-wider">
                    Genre Filter
                  </DropdownMenuLabel>
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {genres.map((genre) => (
                        <Button
                          key={genre.id}
                          variant={selectedGenre === genre.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedGenre(genre.id)}
                          className={
                            selectedGenre === genre.id
                              ? "neon-button-cyan font-mono text-xs"
                              : "border-white/20 text-white hover:bg-white/10 font-mono text-xs"
                          }
                        >
                          {genre.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-cyan-400/30" />

                  <DropdownMenuLabel className="font-mono text-pink-400 uppercase tracking-wider">
                    Game Filter
                  </DropdownMenuLabel>
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {games.map((game) => (
                        <Button
                          key={game.id}
                          variant={selectedGame === game.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedGame(game.id)}
                          className={
                            selectedGame === game.id
                              ? "neon-button-pink font-mono text-xs"
                              : "border-white/20 text-white hover:bg-white/10 font-mono text-xs"
                          }
                        >
                          {game.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

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
              ALL ITEMS ({filteredItems.length})
            </TabsTrigger>
            <TabsTrigger value="auction" className="data-[state=active]:neon-button-pink font-mono uppercase text-xs">
              AUCTIONS ({filteredItems.filter((item) => item.isAuction).length})
            </TabsTrigger>
            <TabsTrigger value="buy-now" className="data-[state=active]:neon-button-cyan font-mono uppercase text-xs">
              BUY NOW ({filteredItems.filter((item) => !item.isAuction).length})
            </TabsTrigger>
          </TabsList>
          
          {filteredItems.length === 0 && (
            <div className="text-center mt-12 text-red-400 font-mono">
              <Ban className="w-8 h-8 mb-2 inline-block m-2" />
              No items found
              </div>
          )}
          <TabsContent value="all" className="mt-8">
            <div
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              {filteredItems.map((item) => renderGameItemCard(item, viewMode === "grid"))}
            </div>
          </TabsContent>

          <TabsContent value="auction">
            <div
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              {filteredItems
                .filter((item) => item.isAuction)
                .map((item) => renderGameItemCard(item, viewMode === "grid"))}
            </div>
          </TabsContent>

          <TabsContent value="buy-now">
            <div
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              {filteredItems
                .filter((item) => !item.isAuction)
                .map((item) => renderGameItemCard(item, viewMode === "grid"))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        {filteredItems.length > 0 && viewMode === "grid" && (
          <div className="text-center mt-12">
            <Button size="lg" className="neon-button-cyan font-mono uppercase tracking-wider">
              DIVE DEEPER
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}