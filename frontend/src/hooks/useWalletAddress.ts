import { useState, useEffect } from "react";

export function useWalletAddress(): string | null {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: unknown) => {
        const safeAccounts = Array.isArray(accounts) ? accounts : [];
        const typedAccounts = safeAccounts.filter(
          (account): account is string => typeof account === "string"
        );
        if (typedAccounts.length > 0) setAddress(typedAccounts[0]);
      })
      .catch(() => {});
    // Also listen for account changes:
    window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress(null);
      } else {
        setAddress(accounts[0]);
      }
    });
  }, []);

  return address;
}
