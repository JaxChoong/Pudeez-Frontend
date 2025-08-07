import React from "react"
import ReactDOM from "react-dom/client"
import "@mysten/dapp-kit/dist/index.css"
import "@radix-ui/themes/styles.css"

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Theme } from "@radix-ui/themes"

import App from "./App.tsx"
import { BrowserRouter as Router } from "react-router-dom"
import { networkConfig } from "./networkConfig.ts"
import { RegisterEnokiWallets } from "./registerEnokiWallets.tsx"
import "./index.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Theme appearance="dark">
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
            <RegisterEnokiWallets />
            <WalletProvider>
              <App />
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </Theme>
    </Router>
  </React.StrictMode>,
)
