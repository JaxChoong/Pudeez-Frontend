"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCurrentAccount, ConnectButton, useDisconnectWallet } from "@mysten/dapp-kit"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import {
  Search,
  ShoppingCart,
  User,
  MessageCircle,
  History,
  Menu,
  X,
  Gamepad2,
  Palette,
  Zap,
} from "lucide-react"

// Helper to get cookie value by name
function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookiePart = parts.pop();
    if (cookiePart) {
      return cookiePart.split(';').shift() || '';
    }
  }
  return '';
}

function WalletConnectWrapper() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [savedAddress, setSavedAddress] = useState("");

  useEffect(() => {
    setSavedAddress(getCookie("wallet_address"));
  }, []);

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleDisconnect = () => {
    // Disconnect from Sui dApp kit first
    if (account) {
      disconnect();
    }
    
    // Clear all localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Delete all cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    });
    
    // Reset saved address
    setSavedAddress("");
    
    // Force reload to ensure clean state
    setTimeout(() => {
      window.location.reload();
    }, 100); // Small delay to ensure disconnect completes
  };

  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded font-mono text-xs hover:bg-cyan-700 transition">
            {formatAddress(account.address)}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 cursor-pointer">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  if (savedAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded font-mono text-xs hover:bg-cyan-700 transition">
            {formatAddress(savedAddress)}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 cursor-pointer">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <div className="wallet-connect-wrapper">
      <ConnectButton connectText="Connect Wallet" />
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems] = useState(3) // Mock cart items count
  const location = useLocation()

  const navItems = [
    { path: "/marketplace", label: "NEXUS", icon: Search },
    { path: "/chat", label: "COMM", icon: MessageCircle },
    { path: "/history", label: "LOG", icon: History },
    { path: "/profile", label: "USER", icon: User },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-lg border-b border-cyan-400/20 scan-lines">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-pink-500 border border-cyan-400/50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="neon-text-cyan font-mono font-bold text-xl tracking-wider">Pudeez</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
              <Input
                placeholder="SEARCH NEURAL NETWORK..."
                className="pl-10 bg-black/40 border-cyan-400/30 text-cyan-400 placeholder-gray-500 font-mono uppercase text-sm neon-border"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 transition-all duration-300 font-mono text-xs uppercase tracking-wider ${
                    location.pathname === item.path
                      ? "neon-text-cyan neon-border bg-cyan-500/10"
                      : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-pink-400 hover:bg-pink-500/10">
                <ShoppingCart className="w-4 h-4" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-black text-xs w-5 h-5 rounded-none flex items-center justify-center font-mono">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Sui Wallet Connection */}
            <div className="flex items-center">
              <div className="ml-2">
                <WalletConnectWrapper />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-cyan-400">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 cyber-card mt-2">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                <Input
                  placeholder="SEARCH..."
                  className="pl-10 bg-black/40 border-cyan-400/30 text-cyan-400 placeholder-gray-500 font-mono"
                />
              </div>

              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 transition-all duration-300 font-mono text-sm uppercase tracking-wider ${
                      location.pathname === item.path
                        ? "neon-text-cyan neon-border bg-cyan-500/10"
                        : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <Link
                to="/cart"
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-pink-400 hover:bg-pink-500/5 font-mono text-sm uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>CART ({cartItems})</span>
              </Link>

              <div className="pt-3">
                <WalletConnectWrapper />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
