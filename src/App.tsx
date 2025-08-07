import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit"
import { Container, Flex, Heading } from "@radix-ui/themes"
import { WalletStatus } from "./WalletStatus"
import { OwnedObjects } from "./OwnedObjects"
import { SteamAuthHandler } from "./SteamAuthHandler"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import MarketplacePage from "./pages/MarketplacePage"
import ProfilePage from "./pages/ProfilePage"
import ChatPage from "./pages/ChatPage"
import HistoryPage from "./pages/HistoryPage"
import CartPage from "./pages/CartPage"
import SellPage from "./pages/sell/[assetId]/page"
import ItemDetailsPage from "./pages/view/[assetId]/page"
import BuyPage from "./pages/buy/[assetId]/page"
import BidPage from "./pages/bid/[assetId]/page"
import SignUpPage from "./pages/SignUpPage"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./components/ui/dropdown-menu"

// Helper to get cookie value by name
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

// Helper to delete a cookie by name
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


function App() {
  const currentAccount = useCurrentAccount();
  const [savedAddress, setSavedAddress] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSavedAddress(getCookie("wallet_address"));
  }, []);

  // Update savedAddress when currentAccount changes (after zkLogin)
  useEffect(() => {
    if (currentAccount?.address) {
      setSavedAddress(currentAccount.address);
    }
  }, [currentAccount]);

  // Auto-link user after Steam auth if both wallet and steamId are present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const steamId = params.get("steamId");
    const walletAddress = currentAccount?.address || savedAddress;
    
    if (walletAddress && steamId) {
      console.log('Auto-linking user:', { walletAddress, steamId });
      fetch("/api/user/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, steamID: steamId }),
        credentials: "include",
      })
        .then(response => response.json())
        .then(data => {
          console.log('User link result:', data);
          // Optionally, clean up the URL (remove steamId/displayName)
          const cleanParams = new URLSearchParams(location.search);
          cleanParams.delete("steamId");
          cleanParams.delete("displayName");
          window.history.replaceState({}, document.title, location.pathname + (cleanParams.toString() ? `?${cleanParams}` : ""));
        })
        .catch(error => {
          console.error('Failed to link user:', error);
        });
    }
  }, [currentAccount, savedAddress, location]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Custom ConnectButton with address display

  function WalletConnectDisplay() {
    // Handler for disconnect: clear cookie and reload
    const handleDisconnect = () => {
      deleteCookie("wallet_address");
      window.location.reload();
    };

    if (currentAccount) {
      return <ConnectButton />;
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
    return <ConnectButton />;
  }

  return (
    <div className="min-h-screen bg-black">
      <SteamAuthHandler />
      <Navbar />
      <Routes>
        {/* Main marketplace routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sell/:assetId" element={<SellPage />} />
        <Route path="/view/:assetId" element={<ItemDetailsPage />} />
        <Route path="/buy/:assetId" element={<BuyPage />} />
        <Route path="/bid/:assetId" element={<BidPage />} />

        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Original dApp wallet page */}
        <Route
          path="/wallet"
          element={
            <div className="min-h-screen bg-black cyber-grid scan-lines">
              <Container className="pt-8">
                <Flex direction="column" gap="2">
                  <Heading className="neon-text-cyan font-mono">NEURAL INTERFACE</Heading>
                  <div className="cyber-card p-6">
                    <WalletConnectDisplay />
                    <WalletStatus />
                    {currentAccount && <OwnedObjects />}
                  </div>
                </Flex>
              </Container>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App
