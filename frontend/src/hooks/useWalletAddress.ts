import { Eip1193Provider } from "ethers";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: Eip1193Provider | undefined;
  }
}

export function useWalletAddress(): string | null {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts.length > 0) setAddress(accounts[0]);
      })
      .catch(() => {});
    // Also listen for account changes:
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress(null);
      } else {
        setAddress(accounts[0]);
      }
    });
  }, []);

  return address;
}
