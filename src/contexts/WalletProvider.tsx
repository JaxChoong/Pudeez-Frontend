// "use client"

// import type { ReactNode } from "react"
// import { WalletProvider as SuiWalletProvider } from "@mysten/wallet-adapter-react"
// import { SuiWallet } from "@mysten/wallet-adapter-sui-wallet"
// import { UnsafeBurnerWalletAdapter } from "@mysten/wallet-adapter-unsafe-burner"
// import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-wallet-standard"

// const wallets = [new SuiWallet(), new UnsafeBurnerWalletAdapter()]

// interface WalletContextProps {
//   children: ReactNode
// }

// export function WalletProvider({ children }: WalletContextProps) {
//   return (
//     <WalletStandardAdapterProvider>
//       <SuiWalletProvider wallets={wallets} autoConnect>
//         {children}
//       </SuiWalletProvider>
//     </WalletStandardAdapterProvider>
//   )
// }
