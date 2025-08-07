import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { setCookie, getCookie } from "@/lib/utils";
import { OwnedObjects } from "./OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();
  const location = useLocation();
  const [savedAddress, setSavedAddress] = useState("");

  // Save wallet address to cookies when connected
  useEffect(() => {
    if (account?.address) {
      setCookie("wallet_address", account.address);
    }
  }, [account?.address]);

  // Fetch wallet address from cookies on refresh or navigation
  useEffect(() => {
    setSavedAddress(getCookie("wallet_address"));
  }, [location]);

  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>

      {account ? (
        <Flex direction="column">
          <Text>Wallet connected</Text>
          <Text>Address: {account.address}</Text>
        </Flex>
      ) : savedAddress ? (
        <Flex direction="column">
          <Text>Wallet address from cookies</Text>
          <Text>Address: {savedAddress}</Text>
        </Flex>
      ) : (
        <Text>Wallet not connected</Text>
      )}
      <OwnedObjects />
    </Container>
  );
}

