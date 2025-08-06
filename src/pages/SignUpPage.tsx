"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"

export default function SignUpPage() {
  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Sign up with Google clicked")

    const suiClient = new SuiClient({ url: import.meta.env.VITE_FULLNODE_URL });
    suiClient.getLatestSuiSystemState().then(
        (systemState) => {
            let epoch = systemState.epoch; console.log(systemState)
            const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
            const ephemeralKeyPair = new Ed25519Keypair();
            const randomness = generateRandomness();
            const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

            const REDIRECT_URL = "http%3A%2F%2F127.0.0.1%3A5173%2Fauth-redirect";
            const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid&nonce=${nonce}`

            window.open(GOOGLE_AUTH_URL, "_blank")
        }
    );

    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="cyber-card backdrop-blur-sm bg-black/60 border-cyan-400/30">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <Gamepad2 className="w-12 h-12 text-cyan-400 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold font-mono">
                    <span className="glitch-text neon-text-cyan" data-text="GAME">
                      GAME
                    </span>
                    <span className="neon-text-pink ml-2">ITEMS</span>
                  </h1>
                </div>
              </div>

              <h2 className="text-2xl font-bold neon-text-cyan mb-2 font-mono uppercase tracking-wider">
                JOIN THE MARKETPLACE
              </h2>

              <p className="text-gray-300 font-mono text-sm uppercase tracking-wide">
                TRADE RARE STEAM ITEMS ON THE BLOCKCHAIN
              </p>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyan-400/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/60 px-4 text-gray-400 font-mono tracking-wider">AUTHENTICATION</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <div className="space-y-6">
              <Button
                onClick={handleGoogleSignUp}
                className="w-full h-14 neon-button-cyan font-mono uppercase text-sm tracking-wider relative overflow-hidden group"
              >
                <div className="flex items-center justify-center space-x-3">
                  {/* Google Icon */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>SIGN UP WITH GOOGLE</span>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              {/* Additional info */}
              <div className="text-center">
                <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">SECURE • FAST • DECENTRALIZED</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-cyan-400/20">
              <p className="text-xs text-gray-500 text-center font-mono">
                BY SIGNING UP, YOU AGREE TO OUR{" "}
                <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer underline">TERMS OF SERVICE</span> AND{" "}
                <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer underline">PRIVACY POLICY</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-pink-400/50"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400/50"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>
      </div>
    </div>
  )
}
