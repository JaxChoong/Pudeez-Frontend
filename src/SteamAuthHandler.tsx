import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useRef, useState } from "react";
import { getCookie, setCookie } from "@/lib/utils";
import { createApiUrl } from "@/lib/backendUrl";

export function SteamAuthHandler() {
	const currentAccount = useCurrentAccount();
	const hasRedirected = useRef(false);
	const isProcessingReturn = useRef(false);
	const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

	// Sync wallet address from currentAccount or cookies
	useEffect(() => {
		if (currentAccount?.address) {
			setWalletAddress(currentAccount.address);
			setCookie("wallet_address", currentAccount.address);
		} else {
			const cookieAddress = getCookie("wallet_address");
			if (cookieAddress && cookieAddress !== 'null' && cookieAddress !== 'undefined') {
				setWalletAddress(cookieAddress);
			}
		}
	}, [currentAccount]);

	// Handle redirect from Steam first (highest priority)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const steamId = params.get("steamId");
		const displayName = params.get("displayName");
		
		if (steamId && walletAddress && !isProcessingReturn.current) {
			isProcessingReturn.current = true;
			console.log('Processing Steam auth return:', { steamId, displayName, walletAddress });
			
			fetch(createApiUrl('/api/user/add'), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					address: walletAddress,
					steamID: steamId,
				}),
			})
				.then((res) => {
					if (!res.ok && res.status !== 409) { // 409 = user already exists, which is ok
						throw new Error(`HTTP ${res.status}`);
					}
					return res.json();
				})
				.then((data) => {
					console.log('User link successful:', data);
					// Clean up URL and redirect to profile
					window.history.replaceState({}, document.title, '/profile');
					window.location.replace('/profile');
				})
				.catch((err) => {
					console.error('Failed to link user:', err);
					// Clean up URL and go to home
					window.history.replaceState({}, document.title, '/');
					window.location.replace('/');
				});
		}
	}, [walletAddress]);

	// Check if user needs Steam auth (only if not processing return)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const hasSteamId = params.get("steamId");
		
		// Don't check for Steam auth if we're processing a return or already redirected
		if (hasSteamId || isProcessingReturn.current || hasRedirected.current || !walletAddress) {
			return;
		}

		const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3111';
		fetch(createApiUrl('/api/user/get_steamid'), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ address: walletAddress }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data.steamID) {
					console.log('No Steam ID found, redirecting to Steam auth...');
					hasRedirected.current = true;
					window.location.href = `${backendUrl}/auth/steam/login?walletAddress=${encodeURIComponent(walletAddress)}`;
				} else {
					console.log('Steam ID found:', data.steamID);
				}
			})
			.catch((err) => {
				console.error("Failed to check SteamID:", err);
			});
	}, [walletAddress]);

	// Reset flags when wallet address changes
	useEffect(() => {
		if (!walletAddress) {
			hasRedirected.current = false;
			isProcessingReturn.current = false;
		}
	}, [walletAddress]);

	return null;
}

