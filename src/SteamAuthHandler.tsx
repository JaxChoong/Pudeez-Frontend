import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useRef } from "react";

export function SteamAuthHandler() {
	const currentAccount = useCurrentAccount();
	const hasRedirected = useRef(false);

	useEffect(() => {
		if (currentAccount?.address && !hasRedirected.current) {
			hasRedirected.current = true;
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			if (!backendUrl) {
				console.error("VITE_BACKEND_URL is not configured");
				return;
			}
			window.location.href = `${backendUrl}/auth/steam/login?walletAddress=${encodeURIComponent(currentAccount.address)}`;
		}
		if (!currentAccount) {
			hasRedirected.current = false;
		}
	}, [currentAccount]);

	// NEW: Handle redirect from Steam
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const steamId = params.get("steamId");
		if (steamId && currentAccount?.address) {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			fetch(`${backendUrl}/api/user/add`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					address: currentAccount.address,
					steamID: steamId,
				}),
			})
				.then((res) => {
					if (!res.ok) throw new Error("Failed to add user");
					// Optionally: clean up URL or show success
				})
				.catch(console.error);
		}
	}, [currentAccount]);

	return null;
}

