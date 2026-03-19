import { useChainId } from "wagmi";

export function useCurrentChainSymbol() {
  const chainId = useChainId();

  switch (chainId) {
    case 420420417:
      return "PAS";
    case 1: // Ethereum mainnet
      return "ETH";
    case 11155111: // Sepolia testnet
      return "ETH";
    case 137: // Polygon
      return "MATIC";
    default:
      return "WND"; // Default fallback
  }
}

export function getCurrentChainSymbol(chainId?: number): string {
  if (!chainId) return "PAS";

  switch (chainId) {
    case 420420417:
      return "PAS";
    case 1: // Ethereum mainnet
      return "ETH";
    case 11155111: // Sepolia testnet
      return "ETH";
    case 137: // Polygon
      return "MATIC";
    default:
      return "PAS";
  }
}
