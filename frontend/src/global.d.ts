declare global {
  interface Window {
    ethereum?: import("viem").Eip1193Provider;
  }
}

export default global;

declare module "*.sol?raw" {
  const source: string;
  export default source;
}
