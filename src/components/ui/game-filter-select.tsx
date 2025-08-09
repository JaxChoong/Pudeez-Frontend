// src/components/ui/game-filter-select.tsx
"use client";

import * as React from "react";
import { Check,  Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import steamAppsData from "@/data/steam_apps.json";

interface SteamApp {
  appid: number;
  name: string;
}

const steamApps: SteamApp[] = steamAppsData as SteamApp[];

interface GameFilterSelectProps {
  value?: string | null;
  onValueChange?: (appId: string | null, gameName: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function GameFilterSelect({
  value,
  onValueChange,
  placeholder = "Search for a game...",
  className,
}: GameFilterSelectProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredApps, setFilteredApps] = React.useState<SteamApp[]>([]);
  const [selectedGame, setSelectedGame] = React.useState<SteamApp | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Find selected game when value changes
  React.useEffect(() => {
    if (value && value !== "all") {
      const game = steamApps.find(app => app.appid.toString() === value);
      setSelectedGame(game || null);
      setInputValue(game ? game.name : "");
    } else {
      setSelectedGame(null);
      setInputValue("");
    }
  }, [value]);

  // Filter apps based on input
  React.useEffect(() => {
    if (inputValue.length > 1) {
      const filtered = steamApps.filter((app) =>
        app.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredApps(filtered.slice(0, 10)); // Limit to 10 results
      setIsOpen(true);
    } else {
      setFilteredApps([]);
      setIsOpen(false);
    }
  }, [inputValue]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (app: SteamApp) => {
    setSelectedGame(app);
    setInputValue(app.name);
    onValueChange?.(app.appid.toString(), app.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedGame(null);
    setInputValue("");
    onValueChange?.(null, null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleShowAll = () => {
    setSelectedGame(null);
    setInputValue("");
    onValueChange?.(null, null);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={selectedGame ? selectedGame.name : placeholder}
          className={cn(
            "w-full pl-8 pr-8 py-2 bg-black/40 border border-white/20 rounded-md",
            "text-white placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
            "font-mono text-sm"
          )}
          onFocus={() => {
            if (inputValue.length > 1) setIsOpen(true);
          }}
        />
        {selectedGame && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full mt-1 bg-black/90 border border-white/20 rounded-md shadow-lg",
          "max-h-60 overflow-auto backdrop-blur-sm"
        )}>
          {/* Show All Games Option */}
          <div
            className={cn(
              "px-3 py-2 cursor-pointer hover:bg-white/10 flex items-center justify-between",
              "text-white font-mono text-sm border-b border-white/10"
            )}
            onClick={handleShowAll}
          >
            <span className="text-cyan-400">ALL GAMES</span>
            {!selectedGame && <Check className="h-4 w-4 text-cyan-400" />}
          </div>
          
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.appid}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-white/10 flex items-center justify-between",
                  "text-white font-mono text-sm"
                )}
                onClick={() => handleSelect(app)}
              >
                <div className="flex flex-col">
                  <span>{app.name}</span>
                  <span className="text-xs text-gray-400">App ID: {app.appid}</span>
                </div>
                {selectedGame?.appid === app.appid && (
                  <Check className="h-4 w-4 text-purple-400" />
                )}
              </div>
            ))
          ) : inputValue.length > 1 ? (
            <div className="px-3 py-2 text-gray-400 font-mono text-sm">
              No games found matching "{inputValue}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
