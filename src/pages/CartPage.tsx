"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/seperator"
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Wallet, Shield, Clock } from "lucide-react"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Cosmic Dreams #1",
      collection: "Cosmic Collection",
      price: 4.2,
      image: "/placeholder.svg?height=120&width=120",
      seller: "ArtistX",
      quantity: 1,
      isAuction: false,
    },
    {
      id: 2,
      title: "Digital Warrior",
      collection: "Battle Legends",
      price: 2.8,
      image: "/placeholder.svg?height=120&width=120",
      seller: "GameDev",
      quantity: 1,
      isAuction: false,
    },
    {
      id: 3,
      title: "Abstract Mind",
      collection: "Modern Art",
      price: 1.5,
      image: "/placeholder.svg?height=120&width=120",
      seller: "ModernArt",
      quantity: 1,
      isAuction: true,
      auctionEnds: "2h 34m",
    },
  ])

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const platformFee = subtotal * 0.025 // 2.5% platform fee
  const gasFee = 0.05 // Estimated gas fee
  const total = subtotal + platformFee + gasFee

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Shopping Cart</h1>
          </div>
          <p className="text-xl text-gray-300">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Discover amazing NFTs to add to your collection</p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Browse Marketplace
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.collection}</p>
                            <p className="text-sm text-gray-400">by {item.seller}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.isAuction && (
                              <Badge className="bg-red-600 text-white">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.auctionEnds}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-white w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-white">
                              {(item.price * item.quantity).toFixed(2)} ETH
                            </div>
                            {item.quantity > 1 && <div className="text-sm text-gray-400">{item.price} ETH each</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-white">
                      <span>Subtotal</span>
                      <span>{subtotal.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Platform Fee (2.5%)</span>
                      <span>{platformFee.toFixed(3)} ETH</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Estimated Gas Fee</span>
                      <span>{gasFee.toFixed(3)} ETH</span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>{total.toFixed(3)} ETH</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6">
                      <Wallet className="w-5 h-5 mr-2" />
                      Pay with Wallet
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with Card
                    </Button>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">Secure Transaction</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Your purchase is protected by blockchain technology and smart contracts.
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• All sales are final</p>
                    <p>• Gas fees may vary based on network congestion</p>
                    <p>• NFTs will be transferred to your wallet after payment</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
