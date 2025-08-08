"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Share, Copy, ExternalLink, Users, Package, TrendingUp, Eye } from "lucide-react";
import Shimmer from "@/components/Shimmer";
import { useImageLoading } from "@/hooks/useImageLoading";
import { cn, getCookie } from "@/lib/utils";

interface SteamProfile {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  communityvisibilitystate: number;
  lastlogoff?: number;
  realname?: string;
}

// Helper functions for Steam status
const getPersonaState = (state: number): { text: string; color: string; bgColor: string } => {
  const states = {
    0: { text: "Offline", color: "text-gray-400", bgColor: "bg-gray-500/20" },
    1: { text: "Online", color: "text-green-400", bgColor: "bg-green-500/20" }, 
    2: { text: "Busy", color: "text-red-400", bgColor: "bg-red-500/20" },
    3: { text: "Away", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
    4: { text: "Snooze", color: "text-orange-400", bgColor: "bg-orange-500/20" },
    5: { text: "Looking to Trade", color: "text-blue-400", bgColor: "bg-blue-500/20" },
    6: { text: "Looking to Play", color: "text-purple-400", bgColor: "bg-purple-500/20" }
  };
  return states[state as keyof typeof states] || { text: "Unknown", color: "text-gray-400", bgColor: "bg-gray-500/20" };
};

const getVisibilityState = (state: number): { text: string; icon: React.ReactNode; color: string } => {
  const states = {
    1: { text: "Private", icon: <Eye className="w-3 h-3" />, color: "text-red-400" },
    3: { text: "Public", icon: <Users className="w-3 h-3" />, color: "text-green-400" }
  };
  return states[state as keyof typeof states] || { text: "Friends Only", icon: <Users className="w-3 h-3" />, color: "text-yellow-400" };
};

export default function ProfilePage() {
  const { isLoading: isCoverLoading, handleImageLoad: handleCoverLoad } = useImageLoading();
  const { isLoading: isAvatarLoading, handleImageLoad: handleAvatarLoad } = useImageLoading();
  const [isFollowing, setIsFollowing] = useState(false);
  const [steamProfile, setSteamProfile] = useState<SteamProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const hasFetched = useRef(false);

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
        const response = await fetch(`http://localhost:3111/api/user/get_steam_profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: walletAddress }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setSteamProfile(data.profile);
      } catch (err) {
        console.error('Error fetching Steam profile:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSteamProfileId();
  }, []);

  const userStats = [
    { 
      label: "Inventory Items", 
      value: "0", 
      icon: <Package className="w-5 h-5" />, 
      color: "from-blue-500 to-cyan-500",
      change: "+0%"
    },
    { 
      label: "Items On Sale", 
      value: "0", 
      icon: <TrendingUp className="w-5 h-5" />, 
      color: "from-green-500 to-emerald-500",
      change: "+0%"
    },
    { 
      label: "Followers", 
      value: "1.2K", 
      icon: <Users className="w-5 h-5" />, 
      color: "from-purple-500 to-pink-500",
      change: "+5.2%"
    },
    { 
      label: "Following", 
      value: "456", 
      icon: <Eye className="w-5 h-5" />, 
      color: "from-orange-500 to-red-500",
      change: "+2.1%"
    },
  ];

  if (isLoadingData) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <div className="text-white text-lg font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl font-semibold mb-2">Oops! Something went wrong</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  const personaState = steamProfile ? getPersonaState(steamProfile.personastate) : null;
  const visibilityState = steamProfile ? getVisibilityState(steamProfile.communityvisibilitystate) : null;

  return (
    <div className="min-h-screen pt-8 bg-gradient-to-br from-gray-900 via-purple-900/20 to-violet-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Profile Header */}
        <div className="mb-12">
          <div className="relative">
            {/* Cover Image with Enhanced Glassmorphism */}
            <div className="relative h-48 md:h-72 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10">
              {isCoverLoading && <Shimmer className="w-full h-full" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <img
                src="/placeholder.svg?height=288&width=1024"
                alt="Profile Cover"
                className={cn(
                  "w-full h-full object-cover opacity-60",
                  isCoverLoading ? "opacity-0" : "opacity-60"
                )}
                onLoad={handleCoverLoad}
              />
              
              {/* Floating decorative elements */}
              <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
            </div>

            {/* Enhanced Profile Info Section */}
            <div className="relative -mt-20 px-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
                {/* Enhanced Avatar with Status Indicator */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <Avatar className="relative w-36 h-36 border-4 border-white/20 bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl">
                    {isAvatarLoading && <Shimmer className="w-full h-full rounded-full" />}
                    <AvatarImage
                      src={steamProfile?.avatarfull || "/placeholder.svg?height=144&width=144"}
                      className={cn("transition-all duration-300", isAvatarLoading ? "opacity-0" : "opacity-100")}
                      onLoad={handleAvatarLoad}
                    />
                  </Avatar>
                  
                  {/* Online Status Indicator */}
                  {steamProfile && personaState && (
                    <div className="absolute bottom-2 right-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-4 border-white shadow-lg",
                        steamProfile.personastate === 1 ? "bg-green-400" : 
                        steamProfile.personastate === 2 ? "bg-red-400" :
                        steamProfile.personastate === 3 ? "bg-yellow-400" : "bg-gray-400"
                      )}>
                        {steamProfile.personastate === 1 && (
                          <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Profile Details */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                    <div className="space-y-4">
                      {/* Name and Title */}
                      <div className="space-y-2">
                        <h1 className="text-4xl xl:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {steamProfile?.personaname || "Steam Collector"}
                        </h1>
                        {steamProfile?.realname && (
                          <p className="text-xl text-gray-300 font-medium">{steamProfile.realname}</p>
                        )}
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-3">
                        {steamProfile && personaState && (
                          <Badge variant="secondary" className={cn(
                            "px-3 py-1 text-sm font-medium border-0 backdrop-blur-sm",
                            personaState.bgColor,
                            personaState.color
                          )}>
                            <div className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              steamProfile.personastate === 1 ? "bg-green-400 animate-pulse" : 
                              steamProfile.personastate === 2 ? "bg-red-400" :
                              steamProfile.personastate === 3 ? "bg-yellow-400" : "bg-gray-400"
                            )} />
                            {personaState.text}
                          </Badge>
                        )}
                        
                        {steamProfile && visibilityState && (
                          <Badge variant="outline" className={cn(
                            "px-3 py-1 text-sm font-medium border border-white/20 backdrop-blur-sm bg-white/5",
                            visibilityState.color
                          )}>
                            {visibilityState.icon}
                            <span className="ml-1">{visibilityState.text}</span>
                          </Badge>
                        )}
                      </div>

                      {/* Steam ID and Link */}
                      {steamProfile && (
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm font-mono">
                            Steam ID: <span className="text-gray-300">{steamProfile.steamid}</span>
                          </p>
                          
                          {steamProfile.lastlogoff && (
                            <p className="text-gray-400 text-sm">
                              Last seen: <span className="text-gray-300">
                                {new Date(steamProfile.lastlogoff * 1000).toLocaleDateString()}
                              </span>
                            </p>
                          )}
                          
                          <a 
                            href={steamProfile.profileurl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors group"
                          >
                            View Steam Profile
                            <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
                      >
                        <Share className="w-4 h-4 mr-2" /> Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copy
                      </Button>
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={cn(
                          "transition-all duration-300 shadow-lg backdrop-blur-sm",
                          isFollowing 
                            ? "bg-gray-600 hover:bg-gray-700" 
                            : "bg-purple-600 hover:bg-purple-700"
                        )}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {userStats.map((stat, index) => (
              <Card 
                key={index} 
                className="group relative bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-white/20 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                  stat.color
                )} />
                
                <CardContent className="relative p-6 text-center space-y-3">
                  {/* Icon */}
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r mb-2 group-hover:scale-110 transition-transform duration-300",
                    stat.color
                  )}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl xl:text-4xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {stat.value}
                  </div>
                  
                  {/* Label and Change */}
                  <div className="space-y-1">
                    <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                    <div className="text-xs text-green-400 font-medium">{stat.change}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
