import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit"
import { Container, Flex, Heading } from "@radix-ui/themes"
import { WalletStatus } from "./WalletStatus"
import { OwnedObjects } from "./OwnedObjects"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import MarketplacePage from "./pages/MarketplacePage"
import ProfilePage from "./pages/ProfilePage"
import ChatPage from "./pages/ChatPage"
import HistoryPage from "./pages/HistoryPage"
import CartPage from "./pages/CartPage"
import SellPage from "./pages/sell/[appId]/page"
import ItemDetailsPage from "./pages/view/[appId]/page"
function App() {
  const currentAccount = useCurrentAccount()

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          {/* Main marketplace routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/sell/:appId" element={<SellPage />} />
          <Route path="/view/:appId" element={<ItemDetailsPage />} />


          {/* Original dApp wallet page */}
          <Route
            path="/wallet"
            element={
              <div className="min-h-screen bg-black cyber-grid scan-lines">
                <Container className="pt-8">
                  <Flex direction="column" gap="2">
                    <Heading className="neon-text-cyan font-mono">NEURAL INTERFACE</Heading>
                    <div className="cyber-card p-6">
                      <ConnectButton />
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
    </Router>
  )
}

export default App
