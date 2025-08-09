// src/pages/ProfilePage/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom"; 
import { ExternalLink, Tag, Hammer, Box } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { useImageLoading } from "@/hooks/useImageLoading";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/lib/utils";
import { AutocompleteSelect } from "@/components/ui/autocomplete-select";
import SteamApps from "@/data/steam_apps.json";

// List of supported Steam games with their app IDs, loaded from SteamApps.json
const SUPPORTED_GAMES = (SteamApps as Array<{ name: string; appid: number; contextId?: number }>).map(app => ({
  name: app.name,
  appId: app.appid,
  contextId: app.contextId ?? 2, // default to 2 if not provided
}));


export default function InventoryPage() {
  // State declarations
  const { isLoading, handleImageLoad } = useImageLoading();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [steamProfileId, setSteamProfileId] = useState<string | null>(null);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  
  interface ApiReturns {
    assets?: Array<any>;
  }
  const [apiReturns, setApiReturns] = useState<ApiReturns | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listedAssets, setListedAssets] = useState<Array<any>>([]);
  const [isLoadingListedAssets, setIsLoadingListedAssets] = useState(false);
  const hasFetched = useRef(false);
  console.log(error);
  useEffect(() => {
    if (hasFetched.current) return;

    const addr = getCookie("wallet_address");
    
    if (!addr || addr === 'null' || addr === 'undefined' || addr.trim() === '') {
      setError("No wallet address found. Please connect your wallet.");
      setIsLoadingData(false);
      return;
    }

    hasFetched.current = true;
    const walletAddress = addr.trim();

    const fetchSteamProfileId = async () => {
      try {
        const response = await fetch(`http://localhost:3111/api/user/get_steamid`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: walletAddress })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSteamProfileId(data.steamID);
        return data.steamID;
      } catch (err) {
        console.error('Error fetching Steam profile ID:', err);
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    };

    const fetchListedAssets = async (walletAddress: string) => {
      try {
        setIsLoadingListedAssets(true);
        const response = await fetch(`http://localhost:3111/api/walrus/assets/${walletAddress}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setListedAssets(data.assets || []);
      } catch (err) {
        console.error('Error fetching listed assets:', err);
        setListedAssets([]);
      } finally {
        setIsLoadingListedAssets(false);
      }
    };

    const initializeData = async () => {
      await fetchSteamProfileId();
      await fetchListedAssets(walletAddress);
    };

    initializeData();
  }, []);

  const fetchInventory = async () => {
    if (!steamProfileId || !selectedGame) return;
    
    try {
      setIsLoadingData(true);
      setError(null);
      setInventoryError(null);
      setApiReturns(null); // Clear previous results
      
      const game = SUPPORTED_GAMES.find(g => g.name === selectedGame);
      if (!game) {
        throw new Error("Selected game not found");
      }

      const response = await fetch(
        `http://localhost:3111/api/steam/inventory/${steamProfileId}?appid=${game.appId}&contextid=${game.contextId}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        if (response.status === 404) {
          throw new Error('No Steam inventory found for this user.');
        } else {
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
      }
      
      const data = await response.json();
      setApiReturns(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('403')) {
        // Handle private inventory or empty inventory case gracefully
        setInventoryError('No items found or inventory is private');
        setApiReturns({ assets: [] }); // Set empty inventory
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
      console.error('Error fetching Steam inventory:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Safe access to assets with null check
  const allSteamAssets = apiReturns?.assets?.map((asset: any) => ({
    assetId: asset.assetid,
    classId: asset.classid,
    instanceId: asset.instanceid,
    iconUrl: `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}`,
    name: asset.name,
    amount: asset.amount,
    contextId: asset.contextid,
    appid: asset.appid, // Include appid from Steam inventory response
    status: "inventory",
  })) || [];

  // Filter out assets that are already listed
  const listedAssetIds = new Set(listedAssets.map(asset => asset.assetid));
  const userAssets = allSteamAssets.filter(asset => !listedAssetIds.has(asset.assetId));

  // Helper function to format SUI prices intelligently
  const formatSuiPrice = (price: string): string => {
    const num = parseFloat(price || '0');
    if (num === 0) return "0 SUI";
    const formatted = num.toFixed(4).replace(/\.?0+$/, '');
    return `${formatted} SUI`;
  };

  // Transform listed assets into the format expected by the UI
  const onSaleNFTs = listedAssets
    .filter(asset => !asset.listingType || asset.listingType === 'sale')
    .map(asset => ({
      assetId: asset.assetid,
      classId: asset.classid,
      instanceId: asset.instanceid,
      iconUrl: asset.icon_url ? `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}` : "/placeholder.svg",
      name: asset.name || 'Unknown Item',
      price: formatSuiPrice(asset.price || '0'),
      collection: "Listed Item",
      status: "sale",
      blobId: asset.blobId,
      walletAddress: asset.walletAddress,
      uploadedAt: asset.uploadedAt
    }));

  const inAuctionNFTs = listedAssets
    .filter(asset => asset.listingType === 'auction')
    .map(asset => ({
      assetId: asset.assetid,
      classId: asset.classid,
      instanceId: asset.instanceid,
      iconUrl: asset.icon_url ? `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}` : "/placeholder.svg",
      name: asset.name || 'Unknown Item',
      currentBid: formatSuiPrice(asset.price || '0'),
      endsIn: "Ongoing",
      collection: "Auction Item",
      status: "auction",
      blobId: asset.blobId,
      walletAddress: asset.walletAddress,
      uploadedAt: asset.uploadedAt
    }));


  // Add loading and error states
  if (isLoadingListedAssets) {
    return <div className="min-h-screen pt-8 flex items-center justify-center">
      <div className="text-white">Loading profile data...</div>
    </div>;
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs for NFTs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-white/10 border-white/20 mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              Inventory ({userAssets.length})
            </TabsTrigger>
            <TabsTrigger value="on-sale" className="data-[state=active]:bg-purple-600">
              On Sale ({onSaleNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="in-auction" className="data-[state=active]:bg-purple-600">
              In Auction ({inAuctionNFTs.length})
            </TabsTrigger>
          </TabsList>

          {/* Game Selection */}
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select a game to view inventory
                </label>
              <AutocompleteSelect
                value={selectedGame}
                onValueChange={setSelectedGame}
                placeholder="Search for a Steam game..."
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
              />
              </div>
              <Button 
                onClick={fetchInventory}
                disabled={!selectedGame || isLoadingData}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoadingData ? "Loading..." : "Load Inventory"}
              </Button>
            </div>
          </div>

          {/* All Items */}
          <TabsContent value="all">
            {isLoadingData ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-white">Loading inventory...</div>
              </div>
            ) : inventoryError ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-lg border border-white/10">
                <Box className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No items found</h3>
                <p className="text-gray-400 mb-4">Your inventory is empty or private for {selectedGame}</p>
              </div>
            ) : userAssets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userAssets.map((item) => (
                  <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-lg border border-white/10">
                {selectedGame ? (
                  <>
                    <Box className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No items found</h3>
                    <p className="text-gray-400 mb-4">You don't have any items in your {selectedGame} inventory</p>
                  </>
                ) : (
                  <>
                    <Box className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Select a game to view inventory</h3>
                    <p className="text-gray-400">Choose a game from the dropdown above to see your items</p>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          {/* On Sale Items */}
          <TabsContent value="on-sale">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onSaleNFTs.map((item) => (
                <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>

          {/* In Auction Items */}
          <TabsContent value="in-auction">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inAuctionNFTs.map((item) => (
                <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NFTCard({ item, isLoading, handleImageLoad }: { item: any, isLoading: boolean, handleImageLoad: () => void }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-lg">
          {isLoading && <Shimmer className="absolute inset-0 w-full aspect-square" />}
          <img
            src={item.iconUrl}
            alt={item.name}
            className={cn(
              "w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
          />
          
          {/* Status Badge */}
          {item.status === "sale" && (
            <Badge className="absolute top-2 left-2 bg-green-500/80 hover:bg-green-500/90">
              <Tag className="w-3 h-3 mr-1" /> For Sale
            </Badge>
          )}
          {item.status === "auction" && (
            <Badge className="absolute top-2 left-2 bg-purple-500/80 hover:bg-purple-500/90">
              <Hammer className="w-3 h-3 mr-1" /> Auction
            </Badge>
          )}
          {item.status === "inventory" && (
            <Badge className="absolute top-2 left-2 bg-blue-500/80 hover:bg-blue-500/90">
              <Box className="w-3 h-3 mr-1" /> Inventory
            </Badge>
          )}
        </div>
        
        {/* Content Section with fixed bottom alignment */}
        <div className="p-4 flex flex-col" style={{ minHeight: '160px' }}>
          {/* Text Content */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{item.type}</p>

            {/* Price/Bid Information */}
            <div className="mb-1">
              {item.status === "sale" && (
                <div className="text-lg font-bold text-white">{item.price}</div>
              )}
              {item.status === "auction" && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-0.5">
                    <span className="text-gray-300">Current Bid</span>
                    <span className="text-gray-300">Ends In</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{item.currentBid}</span>
                    <span className="text-sm font-medium text-purple-300">{item.endsIn}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons Container - Fixed at bottom */}
          <div className="flex justify-between gap-2 pt-2">
            <Link 
              to={`/view/${item.assetId}`}
              state={item}
              className={item.status === "inventory" ? "w-1/3" : "w-full"}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent px-2 h-8"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs ml-1">View</span>
              </Button>
            </Link>
            
            {item.status === "inventory" && (
              <Link to={`/sell/${item.assetId}`} state={{ item }} className="w-2/3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent px-2 h-8"
                >
                  <Tag className="w-3 h-3" />
                  <span className="text-xs ml-1">List for Sale</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}