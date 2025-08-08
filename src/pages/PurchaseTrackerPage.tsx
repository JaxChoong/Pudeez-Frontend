"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Package, Clock, CheckCircle, XCircle, AlertCircle, Filter, Calendar, DollarSign, Gamepad2, Eye, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Custom Progress Component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("w-full bg-gray-700 rounded-full h-2", className)}>
    <div 
      className="bg-gradient-to-r from-cyan-400 to-pink-400 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

interface PurchaseOrder {
  id: string
  itemTitle: string
  itemImage: string
  game: string
  price: string
  purchaseDate: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  transactionHash?: string
  estimatedDelivery?: string
  seller: string
  rarity: string
  orderType: 'buy-now' | 'auction'
  trackingSteps: {
    step: string
    status: 'completed' | 'current' | 'pending'
    timestamp?: string
    description: string
  }[]
}

export default function PurchaseTracker() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedGame, setSelectedGame] = useState("all")
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const mockOrders: PurchaseOrder[] = [
      {
        id: "ORD-001",
        itemTitle: "AK-47 | Redline (Field-Tested)",
        itemImage: "/ak47-redline.png",
        game: "CS:GO",
        price: "0.15 ETH",
        purchaseDate: "2024-01-15T10:30:00Z",
        status: "completed",
        transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
        estimatedDelivery: "2024-01-15T12:00:00Z",
        seller: "ProGamer123",
        rarity: "Classified",
        orderType: "buy-now",
        trackingSteps: [
          { step: "Order Placed", status: "completed", timestamp: "2024-01-15T10:30:00Z", description: "Payment confirmed on blockchain" },
          { step: "Seller Verification", status: "completed", timestamp: "2024-01-15T10:35:00Z", description: "Seller identity verified" },
          { step: "Item Transfer", status: "completed", timestamp: "2024-01-15T11:45:00Z", description: "Item transferred to escrow" },
          { step: "Delivery", status: "completed", timestamp: "2024-01-15T12:00:00Z", description: "Item delivered to your Steam inventory" }
        ]
      },
      {
        id: "ORD-002",
        itemTitle: "Dragon Lore AWP (Minimal Wear)",
        itemImage: "/awp-dragon-lore.png",
        game: "CS:GO",
        price: "2.5 ETH",
        purchaseDate: "2024-01-16T14:20:00Z",
        status: "processing",
        transactionHash: "0xabcdefghijklmnopqrstuvwxyz1234567890abcd",
        estimatedDelivery: "2024-01-16T18:00:00Z",
        seller: "SkinCollector",
        rarity: "Covert",
        orderType: "auction",
        trackingSteps: [
          { step: "Order Placed", status: "completed", timestamp: "2024-01-16T14:20:00Z", description: "Auction won, payment processing" },
          { step: "Seller Verification", status: "completed", timestamp: "2024-01-16T14:25:00Z", description: "Seller identity verified" },
          { step: "Item Transfer", status: "current", description: "Waiting for seller to transfer item to escrow" },
          { step: "Delivery", status: "pending", description: "Item will be delivered to your Steam inventory" }
        ]
      },
      {
        id: "ORD-003",
        itemTitle: "Pudge Arcana Set",
        itemImage: "/pudge-arcana.png",
        game: "DOTA 2",
        price: "0.08 ETH",
        purchaseDate: "2024-01-14T09:15:00Z",
        status: "failed",
        seller: "DotaTrader",
        rarity: "Arcana",
        orderType: "buy-now",
        trackingSteps: [
          { step: "Order Placed", status: "completed", timestamp: "2024-01-14T09:15:00Z", description: "Payment confirmed on blockchain" },
          { step: "Seller Verification", status: "completed", timestamp: "2024-01-14T09:20:00Z", description: "Seller identity verified" },
          { step: "Item Transfer", status: "completed", timestamp: "2024-01-14T10:30:00Z", description: "Item transfer failed - seller no longer owns item" },
          { step: "Delivery", status: "pending", description: "Refund initiated" }
        ]
      },
      {
        id: "ORD-004",
        itemTitle: "Butterfly Knife | Fade",
        itemImage: "/butterfly-knife-fade.png",
        game: "CS:GO",
        price: "1.2 ETH",
        purchaseDate: "2024-01-17T16:45:00Z",
        status: "pending",
        seller: "KnifeDealer",
        rarity: "Covert",
        orderType: "buy-now",
        trackingSteps: [
          { step: "Order Placed", status: "current", timestamp: "2024-01-17T16:45:00Z", description: "Waiting for blockchain confirmation" },
          { step: "Seller Verification", status: "pending", description: "Verifying seller identity" },
          { step: "Item Transfer", status: "pending", description: "Pending seller verification" },
          { step: "Delivery", status: "pending", description: "Pending item transfer" }
        ]
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  const statusConfig = {
    pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30", icon: Clock, label: "PENDING" },
    processing: { color: "bg-blue-500/20 text-blue-400 border-blue-400/30", icon: RefreshCw, label: "PROCESSING" },
    completed: { color: "bg-green-500/20 text-green-400 border-green-400/30", icon: CheckCircle, label: "COMPLETED" },
    failed: { color: "bg-red-500/20 text-red-400 border-red-400/30", icon: XCircle, label: "FAILED" },
    refunded: { color: "bg-purple-500/20 text-purple-400 border-purple-400/30", icon: AlertCircle, label: "REFUNDED" }
  }

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

  const getProgressPercentage = (steps: PurchaseOrder['trackingSteps']) => {
    const completedSteps = steps.filter(step => step.status === 'completed').length
    return (completedSteps / steps.length) * 100
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesGame = selectedGame === "all" || order.game.toLowerCase() === selectedGame.toLowerCase()
    return matchesSearch && matchesStatus && matchesGame
  })

  const games = ["all", "CS:GO", "DOTA 2", "TF2", "RUST", "PUBG"]
  const statuses = ["all", "pending", "processing", "completed", "failed", "refunded"]

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-cyan-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
              <span className="glitch-text neon-text-cyan" data-text="PURCHASE">
                PURCHASE
              </span>
              <span className="neon-text-pink ml-4">TRACKER</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            MONITOR YOUR ASSET PURCHASES AND DELIVERY STATUS
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold neon-text-cyan font-mono">
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-400 font-mono">COMPLETED</div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold neon-text-cyan font-mono">
                {orders.filter(o => o.status === 'processing').length}
              </div>
              <div className="text-sm text-gray-400 font-mono">PROCESSING</div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold neon-text-cyan font-mono">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-400 font-mono">PENDING</div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold neon-text-cyan font-mono">
                {orders.filter(o => o.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-400 font-mono">FAILED</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <Input
                placeholder="SEARCH ORDERS..."
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
                    STATUS: {selectedStatus.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/90 border-cyan-400/30 neon-border">
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className="font-mono text-xs hover:bg-cyan-400/10"
                    >
                      {status.toUpperCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="neon-button-pink font-mono uppercase text-xs">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    GAME: {selectedGame.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/90 border-pink-400/30 neon-border">
                  {games.map((game) => (
                    <DropdownMenuItem
                      key={game}
                      onClick={() => setSelectedGame(game)}
                      className="font-mono text-xs hover:bg-pink-400/10"
                    >
                      {game.toUpperCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
              <div className="font-mono text-cyan-400">LOADING ORDERS...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="font-mono text-gray-400">NO ORDERS FOUND</div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              const isExpanded = expandedOrders.has(order.id)
              
              return (
                <Card key={order.id} className="cyber-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={order.itemImage || "/placeholder.svg"} 
                        alt={order.itemTitle}
                        className="w-16 h-16 object-contain rounded-lg border border-cyan-400/30"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-mono text-lg neon-text-cyan">{order.itemTitle}</h3>
                          <Badge className={getRarityColor(order.rarity)}>{order.rarity}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                          <span>{order.game}</span>
                          <span>•</span>
                          <span>Order #{order.id}</span>
                          <span>•</span>
                          <span>{new Date(order.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={getProgressPercentage(order.trackingSteps)} className="h-1" />
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-xl neon-text-pink mb-2">{order.price}</div>
                        <Badge className={cn("mb-2", statusConfig[order.status].color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="neon-button-cyan font-mono text-xs"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                HIDE
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                DETAILS
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Order Info */}
                          <div className="space-y-4">
                            <h4 className="font-mono text-cyan-400 text-lg">ORDER INFORMATION</h4>
                            <div className="space-y-2 text-sm font-mono">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Seller:</span>
                                <span className="text-white">{order.seller}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Order Type:</span>
                                <span className="text-white">{order.orderType.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Purchase Date:</span>
                                <span className="text-white">{new Date(order.purchaseDate).toLocaleString()}</span>
                              </div>
                              {order.estimatedDelivery && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Est. Delivery:</span>
                                  <span className="text-white">{new Date(order.estimatedDelivery).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            
                            {order.transactionHash && (
                              <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-400/30">
                                <div className="font-mono text-sm text-gray-400 mb-1">Transaction Hash:</div>
                                <div className="font-mono text-xs text-cyan-400 break-all">{order.transactionHash}</div>
                              </div>
                            )}
                          </div>

                          {/* Tracking Steps */}
                          <div className="space-y-4">
                            <h4 className="font-mono text-cyan-400 text-lg">TRACKING PROGRESS</h4>
                            <Progress value={getProgressPercentage(order.trackingSteps)} className="h-2" />
                            
                            <div className="space-y-3">
                              {order.trackingSteps.map((step, index) => {
                                const StepIcon = step.status === 'completed' ? CheckCircle : 
                                               step.status === 'current' ? RefreshCw : Clock
                                return (
                                  <div key={index} className={cn(
                                    "flex items-start gap-3 p-3 rounded-lg border",
                                    step.status === 'completed' ? "bg-green-500/10 border-green-400/30" :
                                    step.status === 'current' ? "bg-blue-500/10 border-blue-400/30" :
                                    "bg-gray-500/10 border-gray-400/30"
                                  )}>
                                    <StepIcon className={cn(
                                      "w-5 h-5 mt-0.5 flex-shrink-0",
                                      step.status === 'completed' ? "text-green-400" :
                                      step.status === 'current' ? "text-blue-400 animate-spin" :
                                      "text-gray-400"
                                    )} />
                                    <div className="flex-1">
                                      <div className="font-mono text-sm font-semibold text-white">{step.step}</div>
                                      <div className="font-mono text-xs text-gray-400">{step.description}</div>
                                      {step.timestamp && (
                                        <div className="font-mono text-xs text-gray-500 mt-1">
                                          {new Date(step.timestamp).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

