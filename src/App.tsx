import { Routes, Route } from "react-router-dom"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { SteamAuthHandler } from "./SteamAuthHandler"
import { SteamProvider } from "./contexts/SteamContext"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import MarketplacePage from "./pages/MarketplacePage"
import ProfilePage from "./pages/ProfilePage"
import CartPage from "./pages/CartPage"
import SellPage from "./pages/sell/[assetId]/page"
import ItemDetailsPage from "./pages/view/[assetId]/page"
import BuyPage from "./pages/buy/[assetId]/page"
import BidPage from "./pages/bid/[assetId]/page"
import SignUpPage from "./pages/SignUpPage"
import EscrowPage from "./pages/escrow/page"
import EscrowViewPage from "./pages/escrow/view/[transactionId]/page"
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
      <SteamProvider>
        <SteamAuthHandler />
        <Navbar />
        <Routes>
          {/* Main marketplace routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/escrow" element={<EscrowPage />} />
          <Route path="/escrow/view/:transactionId" element={<EscrowViewPage />} />
          <Route path="/sell/:assetId" element={<SellPage />} />
          <Route path="/view/:assetId" element={<ItemDetailsPage />} />
          <Route path="/buy/:assetId" element={<BuyPage />} />
          <Route path="/bid/:assetId" element={<BidPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          
        </Routes>
      </SteamProvider>
    </div>
  );
}

export default App
