// src/pages/SellPage/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCurrentAccount, useSignTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Hammer, Clock } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { cn } from "@/lib/utils";
import steamAppsData from "@/data/steam_apps.json";

interface SteamGame {
  appid: number;
  name: string;
  // Add other properties if needed
}
const steamApps: SteamGame[] = steamAppsData as SteamGame[]
interface SteamAsset {
  appid?: string;
  contextid?: string;
  assetid?: string;
  classid?: string;
  instanceid?: string;
  amount?: string;
  name?: string;
  market_name?: string;
  icon_url?: string;
  icon_url_large?: string;
  iconUrl?: string;
  assetId?: string;
  classId?: string;
  instanceId?: string;
  contextId?: string;
  status?: string;
}

export default function SellPage() {
  const { assetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { mutate: signTransaction } = useSignTransaction();
  
  const [listingType, setListingType] = useState<'sale' | 'auction'>('sale');
  const [price, setPrice] = useState('');
  const [minBid, setMinBid] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('24');
  const [description, setDescription] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [item] = useState<SteamAsset | null>(location.state?.item || null);
  const [loading] = useState(!location.state);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Game selection dropdown state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<{appid: string, name: string} | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [steamId, setSteamId] = useState(item?.appid || '');

  // Filter games based on search term
  const filteredGames = steamApps
    .filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10);

  useEffect(() => {
    if (!item && !loading) {
      setError("Asset information not found. Please navigate from your inventory.");
    }
  }, [item, loading, assetId]);

  // Set initial game selection if item has an appid
  useEffect(() => {
    if (item?.appid) {
      const game = steamApps.find(g => g.appid.toString() === item.appid);
      if (game) {
        setSelectedGame({ appid: game.appid.toString(), name: game.name });
        setSteamId(game.appid.toString());
      }
    }
  }, [item]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const iconUrl = item && item.iconUrl ? item.iconUrl : 
                  item && item.icon_url_large ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}` : 
                  item && item.icon_url ? `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}` : undefined;

  if (loading) {
    return <div className="text-center text-white py-10">Loading...</div>;
  }

  if (error || !item) {
    return <div className="text-center text-red-400 py-10">{error || "Asset not found"}</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      setError("Please connect your wallet to list items");
      return;
    }

    if (!item) {
      setError("Item data not found");
      return;
    }

    if (!steamId) {
      setError("Please select a game");
      return;
    }

    if (listingType === 'sale' && !price) {
      setError('Please enter a sale price');
      return;
    }

    if (listingType === 'auction' && !minBid) {
      setError('Please enter a minimum bid amount');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const assetData = {
        appid: steamId, // Use the selected game's appid
        contextid: item.contextId,
        assetid: item.assetId,
        classid: item.classId,
        instanceid: item.instanceId,
        amount: item.amount || "1",
        walletAddress: currentAccount.address,
        icon_url: item.iconUrl ? item.iconUrl.replace('https://steamcommunity-a.akamaihd.net/economy/image/', '') : '',
        name: item.name || 'Unknown Item',
        price: listingType === 'sale' ? price : minBid,
        listingType,
        description,
        auctionDuration: listingType === 'auction' ? auctionDuration : null
      };

      // Rest of your handleSubmit implementation...
      // (keep all the existing Walrus upload and transaction signing logic)
      
    } catch (error) {
      console.error('Error submitting listing:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">List Your Item</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Asset Preview */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg aspect-square flex items-center justify-center bg-black/20">
                {isImageLoading && (
                  <Shimmer className="absolute inset-0 w-full h-full" />
                )}
                <img
                  src={iconUrl}
                  alt={item.name}
                  className={cn(
                    "max-w-[80%] max-h-[80%] object-contain transition-transform duration-300",
                    isImageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={handleImageLoad}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-white">{item.name}</h2>
              </div>
            </CardContent>
          </Card>

          {/* Listing Form */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Game Selection Dropdown */}
                <div className="mb-4 relative">
                  <p className="text-sm text-white mb-2">Select Game</p>
                  <Input
                    type="text"
                    placeholder="Search for a game..."
                    value={selectedGame ? selectedGame.name : searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                      if (selectedGame && e.target.value !== selectedGame.name) {
                        setSelectedGame(null);
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Small delay to allow click
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {showDropdown && filteredGames.length > 0 && (
                    <div 
                      className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-gray-800 border border-white/10 shadow-lg"
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside
                    >
                      {filteredGames.map((game) => (
                        <div
                          key={game.appid}
                          className="px-4 py-2 text-white hover:bg-white/10 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            setSelectedGame({appid: game.appid.toString(), name: game.name});
                            setSteamId(game.appid.toString());
                            setSearchTerm('');
                            setShowDropdown(false);
                          }}
                        >
                          {game.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Steam ID Input (hidden but included in form submission) */}
                <input type="hidden" name="appid" value={steamId} />
                <Tabs defaultValue="sale" onValueChange={(value) => setListingType(value as 'sale' | 'auction')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="sale">
                      <Tag className="w-4 h-4 mr-2" /> Fixed Price
                    </TabsTrigger>
                    <TabsTrigger value="auction">
                      <Hammer className="w-4 h-4 mr-2" /> Auction
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sale">
                    <div className="space-y-4 mb-4">
                      <div>
                        <p className="text-sm text-white mb-2">Price (Sui)</p>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required={listingType === 'sale'}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="auction">
                    <div className="space-y-4 mb-4">
                      <div>
                        <p className="text-sm text-white mb-2">Minimum Bid (Sui)</p>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={minBid}
                          onChange={(e) => setMinBid(e.target.value)}
                          required={listingType === 'auction'}
                        />
                      </div>

                      <div>
                        <p className="text-sm text-white mb-2">Auction Duration</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={auctionDuration === '24' ? 'default' : 'outline'}
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => setAuctionDuration('24')}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs">24 Hours</span>
                          </Button>
                          <Button
                            type="button"
                            variant={auctionDuration === '72' ? 'default' : 'outline'}
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => setAuctionDuration('72')}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs">3 Days</span>
                          </Button>
                          <Button
                            type="button"
                            variant={auctionDuration === '168' ? 'default' : 'outline'}
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => setAuctionDuration('168')}
                          >
                            <Clock className="w-4 h-4 mb-1" />
                            <span className="text-xs">7 Days</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 mb-6">
                  <p className="text-sm text-white mb-2">Description</p>
                  <textarea
                    placeholder="Tell potential buyers about your item..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {!currentAccount && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md mb-4">
                    <p className="text-yellow-400 text-sm">Please connect your wallet to list items</p>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !currentAccount || !steamId}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? 'Listing...' : (listingType === 'sale' ? 'List for Sale' : 'Start Auction')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}