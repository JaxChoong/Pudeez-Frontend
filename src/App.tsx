import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useCurrentAccount } from "@mysten/dapp-kit"
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
import { useEffect } from "react"
import { setCookie } from "@/lib/utils"
import InventoryPage from "./pages/InventoryPage"

function App() {
  const currentAccount = useCurrentAccount();

  // Always update cookie when currentAccount changes (after zkLogin), only if valid
  useEffect(() => {
    if (currentAccount?.address && currentAccount.address !== 'null' && currentAccount.address !== 'undefined' && currentAccount.address.trim() !== '') {
      setCookie("wallet_address", currentAccount.address);
    }
  }, [currentAccount]);

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
        <Route path="/inventory" element={<InventoryPage />} />
        
      </Routes>
    </div>
  );
}

export default App
