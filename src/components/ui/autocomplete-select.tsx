// src/components/ui/autocomplete-select.tsx
"use client";

import * as React from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import steamAppsData from "@/data/steam_apps.json";
const steamApps: SteamApp[] = steamAppsData as SteamApp[];

interface SteamApp {
  appid: number;
  name: string;
}

interface AutocompleteSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AutocompleteSelect({
  value,
  onValueChange,
  placeholder = "Search for a game...",
  className,
}: AutocompleteSelectProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredApps, setFilteredApps] = React.useState<SteamApp[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  const handleSelect = (app: SteamApp) => {
    setInputValue(app.name);
    onValueChange?.(app.name);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {inputValue && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setInputValue("");
              onValueChange?.("");
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && filteredApps.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="max-h-60 overflow-y-auto">
            {filteredApps.map((app) => (
              <div
                key={app.appid}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-10 pr-4 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => handleSelect(app)}
              >
                <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === app.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </span>
                <span>{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}