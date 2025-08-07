import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useRef, useState } from "react";
import { getCookie, deleteCookie } from "@/lib/utils";

export function SteamAuthHandler() {
	const currentAccount = useCurrentAccount();
	const hasRedirected = useRef(false);
	const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

	// Sync wallet address from currentAccount or cookies
	useEffect(() => {
		if (currentAccount?.address) {
			setWalletAddress(currentAccount.address);
		} else {
			const cookieAddress = getCookie("wallet_address");
			if (cookieAddress) setWalletAddress(cookieAddress);
		}
	}, [currentAccount]);

useEffect(() => {
	if (walletAddress && !hasRedirected.current) {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		if (!backendUrl) {
			console.error("VITE_BACKEND_URL is not configured");
			return;
		}
		fetch(`${backendUrl}/api/user/get_steamid`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ address: walletAddress }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data.steamID) {
					hasRedirected.current = true;
					window.location.href = `${backendUrl}/auth/steam/login?walletAddress=${encodeURIComponent(walletAddress)}`;
				}
			})
			.catch((err) => {
				console.error("Failed to check SteamID:", err);
			});
	}
	if (!walletAddress) {
		hasRedirected.current = false;
	}
}, [walletAddress]);

	// Handle redirect from Steam
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const steamId = params.get("steamId");
		if (steamId && walletAddress) {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			fetch(`${backendUrl}/api/user/add`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					address: walletAddress,
					steamID: steamId,
				}),
			})
				.then((res) => {
					if (!res.ok) throw new Error("Failed to add user");
					// Clean up URL and go back to base URL
					window.history.replaceState({}, document.title, window.location.pathname);
					window.location.replace("/");
				})
				.catch(() => {
					// deleteCookie("wallet_address");
					window.history.replaceState({}, document.title, window.location.pathname);
					window.location.replace("/");
				});
		}
	}, [walletAddress]);

	return null;
}

