"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share, Copy } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { useImageLoading } from "@/hooks/useImageLoading";
import { cn, getCookie } from "@/lib/utils";

export default function ProfilePage() {
  const { isLoading: isCoverLoading, handleImageLoad: handleCoverLoad } = useImageLoading();
  const { isLoading: isAvatarLoading, handleImageLoad: handleAvatarLoad } = useImageLoading();
  const [isFollowing, setIsFollowing] = useState(false);
  const [steamProfileId, setSteamProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const addr = getCookie("wallet_address");

    if (!addr || addr === 'null' || addr === 'undefined' || addr.trim() === '') {
      setError("No wallet address found. Please connect your wallet.");
      return;
    }

    hasFetched.current = true;
    const walletAddress = addr.trim();

    const fetchSteamProfileId = async () => {
      try {
        const response = await fetch(`http://localhost:3111/api/user/get_steamid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: walletAddress }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setSteamProfileId(data.steamID);
      } catch (err) {
        console.error('Error fetching Steam profile ID:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSteamProfileId();
  }, []);

  const userStats = [
    { label: "Inventory Items", value: "0" },
    { label: "Items On Sale", value: "0" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "456" },
  ];

  if (isLoadingData) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="relative">
            <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl overflow-hidden">
              {isCoverLoading && <Shimmer className="w-full h-full" />}
              <img
                src="/placeholder.svg?height=256&width=1024"
                alt="Profile Cover"
                className={cn(
                  "w-full h-full object-cover",
                  isCoverLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={handleCoverLoad}
              />
            </div>

            <div className="relative -mt-16 px-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="w-32 h-32 border-4 border-white/20 bg-gradient-to-r from-purple-500 to-pink-500">
                  {isAvatarLoading && <Shimmer className="w-full h-full rounded-full" />}
                  <AvatarImage
                    src="/placeholder.svg?height=128&width=128"
                    className={cn(isAvatarLoading ? "opacity-0" : "opacity-100")}
                    onLoad={handleAvatarLoad}
                  />
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Steam Collector</h1>
                      {steamProfileId && (
                        <p className="text-gray-300 mb-2">{steamProfileId}</p>
                      )}
                      <p className="text-gray-400 max-w-2xl">
                        Collecting and trading Steam items on the blockchain.
                      </p>

                    </div>
                    <div className="flex gap-3 border-white mt-10">
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Share className="w-4 h-4 mr-2" /> Share
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" /> Copy Link
                      </Button>
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
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
      </div>
    </div>
  );
}
