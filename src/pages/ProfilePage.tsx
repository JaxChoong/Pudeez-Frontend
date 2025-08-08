// app/profile/page.tsx
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

export default function ProfilePage() {
  // State declarations
  const { isLoading, handleImageLoad } = useImageLoading();
  interface ApiReturns {
    assets?: Array<any>;
    // add other properties if needed
  }
  const [apiReturns, setApiReturns] = useState<ApiReturns | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listedAssets, setListedAssets] = useState<Array<any>>([]);
  const [isLoadingListedAssets, setIsLoadingListedAssets] = useState(false);
  const hasFetched = useRef(false);
  
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetched.current) {
      console.log('ProfilePage - Already fetched, skipping');
      return;
    }

    const addr = getCookie("wallet_address");
    
    // More robust validation
    if (!addr || addr === 'null' || addr === 'undefined' || addr.trim() === '') {
      console.log('ProfilePage - No valid wallet address found');
      setError("No wallet address found. Please connect your wallet.");
      setIsLoadingData(false);
      return;
    }

    hasFetched.current = true;
    const walletAddress = addr.trim();
    console.log('ProfilePage - Using wallet address:', walletAddress);

    // Only proceed if walletAddress is present and valid
    const fetchSteamProfileId = async () => {
      try {
        console.log('Sending request to get Steam ID with wallet address:', walletAddress);
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
        // console.log('Full backend response:', data);
        // console.log('Fetched Steam ID from backend:', data.steamID);
        return data.steamID;
      } catch (err) {
        console.error('Error fetching Steam profile ID:', err);
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    }

    const fetchData = async (steamProfileId: string) => {
      try {
        setIsLoadingData(true);
        
        const response = await fetch(`http://localhost:3111/api/steam/inventory/${steamProfileId}?appid=730&contextid=2`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          
          if (response.status === 403) {
            throw new Error('Steam inventory is private. Please make your Steam inventory public to view items.');
          } else if (response.status === 404) {
            throw new Error('No Steam inventory found for this user.');
          } else {
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        // console.log('Steam inventory response:', data);
        setApiReturns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error('Error fetching Steam inventory:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    const fetchListedAssets = async (walletAddress: string) => {
      try {
        setIsLoadingListedAssets(true);
        console.log('Fetching listed assets for wallet:', walletAddress);
        
        const response = await fetch(`http://localhost:3111/api/walrus/assets/${walletAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Listed assets response:', data);
        setListedAssets(data.assets || []);
      } catch (err) {
        console.error('Error fetching listed assets:', err);
        // Don't set error state for listed assets since it's not critical
        setListedAssets([]);
      } finally {
        setIsLoadingListedAssets(false);
      }
    };

    const initializeData = async () => {
      const steamProfileId = await fetchSteamProfileId();
      // console.log("Steam Profile ID:", steamProfileId);
      if (steamProfileId) {
        // Fetch both Steam inventory and listed assets in parallel
        await Promise.all([
          fetchData(steamProfileId),
          fetchListedAssets(walletAddress)
        ]);
      } else {
        setIsLoadingData(false);
      }
    };

    initializeData();
  }, []);

  // Add loading and error states
  if (isLoadingData || isLoadingListedAssets) {
    return <div className="min-h-screen pt-8 flex items-center justify-center">
      <div className="text-white">Loading inventory and listings...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen pt-8 flex items-center justify-center">
      <div className="text-red-400">Error: {error}</div>
    </div>;
  }

  // Safe access to assets with null check
  const allSteamAssets = apiReturns?.assets?.map((asset: any) => ({
    assetId: asset.assetid,
    classId: asset.classid,
    instanceId: asset.instanceid,
    iconUrl: `https://steamcommunity-a.akamaihd.net/economy/image/${asset.icon_url}`,
    name: asset.name,
    amount: asset.amount,
    contextId: asset.contextid,
    status: "inventory",
  })) || [];

  // Filter out assets that are already listed
  const listedAssetIds = new Set(listedAssets.map(asset => asset.assetid));
  const userAssets = allSteamAssets.filter(asset => !listedAssetIds.has(asset.assetId));

  console.log('ProfilePage - Listed assets:', listedAssets);
  console.log('ProfilePage - Listed asset IDs:', listedAssetIds);
  console.log('ProfilePage - All Steam assets:', allSteamAssets);
  console.log('ProfilePage - Filtered user assets:', userAssets);

  // Helper function to format SUI prices intelligently
  const formatSuiPrice = (price: string): string => {
    const num = parseFloat(price || '0');
    if (num === 0) return "0 SUI";
    
    // Remove trailing zeros after decimal point
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
      price: formatSuiPrice(asset.price || '0'), // Price is already stored in SUI format, format intelligently
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
      currentBid: formatSuiPrice(asset.price || '0'), // Price is already stored in SUI format, format intelligently
      endsIn: "Ongoing", // Could be calculated from auction duration
      collection: "Auction Item",
      status: "auction",
      blobId: asset.blobId,
      walletAddress: asset.walletAddress,
      uploadedAt: asset.uploadedAt
    }));

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header and Stats would go here */}

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

          {/* All Items */}
          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userAssets.map((item) => (
                <NFTCard key={item.assetId} item={item} isLoading={isLoading} handleImageLoad={handleImageLoad} />
              ))}
            </div>
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
                  <span className="text-xs ml-1">Pudeez for Sale</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}