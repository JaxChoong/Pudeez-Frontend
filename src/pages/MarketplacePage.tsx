"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, List, Grid3X3, Filter, Clock, Heart, TrendingUp, Zap, Bot, Gamepad2,Ban } from "lucide-react"
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
import { marketplaceService, type MarketplaceAsset } from "@/services/marketplaceService"
import { GameFilterSelect } from "@/components/ui/game-filter-select"

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [selectedGameName, setSelectedGameName] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState("grid")
  const [marketplaceAssets, setMarketplaceAssets] = useState<MarketplaceAsset[]>([])
  const [isLoadingAssets, setIsLoadingAssets] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isLoading, handleImageLoad } = useImageLoading()

  // Fetch marketplace assets on component mount
  useEffect(() => {
    const fetchMarketplaceAssets = async () => {
      try {
        console.log('[MarketplacePage] Starting to fetch marketplace assets...')
        setIsLoadingAssets(true)
        setError(null)
        const response = await marketplaceService.getMarketplaceAssets(100, 0)
        console.log('[MarketplacePage] Raw response from marketplaceService:', response)
        console.log('[MarketplacePage] Assets array:', response.assets)
        console.log('[MarketplacePage] Assets count:', response.assets?.length || 0)
        setMarketplaceAssets(response.assets)
        console.log('[MarketplacePage] Set marketplace assets, state should update')
      } catch (err) {
        console.error('[MarketplacePage] Error fetching marketplace assets:', err)
        setError('Failed to load marketplace assets. Please try again later.')
      } finally {
        setIsLoadingAssets(false)
        console.log('[MarketplacePage] Finished loading assets')
      }
    }

    fetchMarketplaceAssets()
  }, [])

  // Handle game selection from the filter
  const handleGameSelection = (appId: string | null, gameName: string | null) => {
    setSelectedGame(appId)
    setSelectedGameName(gameName)
  }

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

  // Use marketplace assets if available, fallback to static data for demo
  const gameItems = marketplaceAssets.length > 0 ? marketplaceAssets : [
    // Static fallback data (keeping one item for when no real data is available)
    {
      id: "demo-1",
      title: "No items listed yet",
      game: "Marketplace",
      gameId: "demo",
      price: "0 ETH",
      steamPrice: "$0.00",
      image: "/placeholder.svg?height=300&width=300",
      genre: "other",
      rarity: "Common",
      condition: "New",
      isAuction: false,
      likes: 0,
      timeLeft: null,
      steamMarketUrl: "#",
    },
  ]

  console.log('[MarketplacePage] Current marketplaceAssets.length:', marketplaceAssets.length)
  console.log('[MarketplacePage] Using gameItems:', gameItems.length > 0 ? `${gameItems.length} items` : 'no items')
  console.log('[MarketplacePage] First few gameItems:', gameItems.slice(0, 3))

  const filteredItems = gameItems.filter((item, index) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.game.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = selectedGenre === "all" 
    const matchesGame = selectedGame === "all" || selectedGame === null || item.gameId === selectedGame
    
    const passes = matchesSearch && matchesGenre && matchesGame
    
    // Debug log for first item
    if (index === 0) {
      console.log('[MarketplacePage] First item filter debug:', {
        item: item.title,
        matchesSearch,
        matchesGenre, 
        matchesGame,
        passes,
        searchTerm,
        selectedGenre,
        selectedGame,
        itemGameId: item.gameId
      })
    }
    
    return passes
  })

  console.log('[MarketplacePage] Filter criteria:', { searchTerm, selectedGenre, selectedGame })
  console.log('[MarketplacePage] Total gameItems before filtering:', gameItems.length)
  console.log('[MarketplacePage] Filtered items count:', filteredItems.length)
  console.log('[MarketplacePage] Filtered items:', filteredItems.slice(0, 3))

  const renderGameItemCard = (item: any, isGridView = true) => {
    return (
      <Card
        key={item.assetid}
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
                    "w-full aspect-square object-contain group-hover:scale-110 transition-transform duration-500",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={handleImageLoad}
                  key={item.image || "/placeholder.svg"}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="neon-border bg-blue-500/20 text-blue-400">STEAM</Badge>
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
                    {item.steamName || 'Unknown User'}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold neon-text-pink font-mono">{item.price}</div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-2 mb-3">
                  {item.isAuction ? (
                        <Link to={`/bid/${item.assetid}`}
                        state= { item }>
                          <span className="neon-button-pink font-mono uppercase text-xs h-10 px-4 flex items-center justify-center bg-white text-black rounded-md hover:bg-pink-50 transition-all duration-300">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            BID
                          </span>
                        </Link>
                  ) : (
                        <Link
                          to={`/buy/${item.assetid}`}
                          state= {{ item }}
                          className="neon-button-cyan font-mono uppercase text-xs h-10 px-4 items-center justify-center flex bg-white text-black rounded-md hover:bg-cyan-100 transition-all duration-300"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          BUY
                        </Link>
                  )}
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
                  "w-20 h-20 object-contain rounded-lg flex-shrink-0",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                onLoad={handleImageLoad}
                key={item.image || "/placeholder.svg"}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold neon-text-cyan font-mono">{item.title}</h3>
                  <Badge className="neon-border bg-blue-500/20 text-blue-400">STEAM</Badge>
                </div>
                <p className="text-sm text-gray-400 font-mono">{item.game}</p>
                <p className="text-xs text-gray-500 font-mono">Owner: {item.steamName || 'Unknown User'}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold neon-text-pink font-mono mb-1">{item.price}</div>
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
                  <div className="p-3" style = {{paddingBottom: "10rem"}}>
                    <GameFilterSelect
                      value={selectedGame}
                      onValueChange={handleGameSelection}
                      placeholder="Search for a game..."
                      className="w-full"
                    />
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

        {/* Loading State */}
        {isLoadingAssets && (
          <div className="text-center mt-12">
            <div className="text-cyan-400 font-mono">Loading marketplace items...</div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="cyber-card">
                  <Shimmer className="w-full aspect-square rounded-t-lg" />
                  <div className="p-4">
                    <Shimmer className="h-4 w-3/4 mb-2" />
                    <Shimmer className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center mt-12 text-red-400 font-mono">
            <Ban className="w-8 h-8 mb-2 inline-block m-2" />
            {error}
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!isLoadingAssets && !error && (
          <>
            {/* Selected Game Display */}
            {selectedGameName && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-purple-300 font-mono text-sm">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Filtering by game: <span className="text-white font-semibold">{selectedGameName}</span></span>
                  <button
                    onClick={() => handleGameSelection(null, null)}
                    className="ml-auto text-xs hover:text-white bg-purple-500/20 hover:bg-purple-500/30 px-2 py-1 rounded"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}
            
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
        </> 
        )} {/* Close the !isLoadingAssets && !error conditional */}

        {/* Load More */}
        {filteredItems.length > 0 && viewMode === "grid" && !isLoadingAssets && (
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