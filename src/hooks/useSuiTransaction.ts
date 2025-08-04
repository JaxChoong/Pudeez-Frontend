// "use client"

// import { useState } from "react"
// import { useWallet } from "@mysten/wallet-adapter-react"
// import type { TransactionBlock } from "@mysten/sui.js/transactions"
// import { suiClient, TX_OPTIONS } from "../lib/suiClient"

// export function useSuiTransaction() {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const { signAndExecuteTransactionBlock } = useWallet()

//   const executeTransaction = async (transactionBlock: TransactionBlock) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const result = await signAndExecuteTransactionBlock({
//         transactionBlock,
//         options: TX_OPTIONS,
//       })

//       // Wait for transaction to be confirmed
//       const confirmedTx = await suiClient.waitForTransactionBlock({
//         digest: result.digest,
//         options: TX_OPTIONS,
//       })

//       setLoading(false)
//       return confirmedTx
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Transaction failed"
//       setError(errorMessage)
//       setLoading(false)
//       throw err
//     }
//   }

//   return {
//     executeTransaction,
//     loading,
//     error,
//   }
// }
