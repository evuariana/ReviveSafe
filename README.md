# ReviveSafe

ReviveSafe is a rebuilt PVM-track multisig for Polkadot Hub. It keeps the core Solidity multisig flow, but now makes the Polkadot-native story explicit:

- Solidity contracts compile to PolkaVM bytecode with `resolc`
- The multisig can submit `pallet-assets` transfers through the deterministic ERC-20 precompile addresses
- The frontend uses the Hub ETH RPC for contract interaction and a RelayCode-inspired Dedot client for live asset metadata

## What Changed

- Added `submitAssetTransfer(uint32 assetId, address destination, uint256 amount)` to the wallet contract
- Added deterministic asset-precompile address derivation on-chain and in the frontend
- Switched the contract build flow from the old remote `@parity/revive` helper to local `@parity/resolc`
- Reworked the frontend around env-driven factory configuration instead of pinned ABI/address snapshots
- Added Dedot-powered asset metadata reads so known Hub assets show real names, symbols, and decimals
- Updated the UI so judges can immediately see the PVM + precompile angle in the dashboard and proposal flow

## Stack

- Contracts: Solidity `0.8.28`, `@parity/resolc`, `ethers`
- Frontend: React, Vite, wagmi, RainbowKit, Tailwind
- Chain metadata: `dedot`, `@dedot/chaintypes`
- Target network: Polkadot Hub TestNet (Paseo / PAS)

## Quick Start

Install dependencies:

```bash
pnpm install
```

Create frontend env values:

```bash
cp frontend/.env.example frontend/.env
```

Build everything:

```bash
pnpm --filter contracts build
pnpm --filter frontend build
```

Run the frontend:

```bash
pnpm frontend:dev
```

## Frontend Env

`frontend/.env` expects:

- `VITE_FACTORY_ADDRESS`: deployed `MultiSigFactory` address
- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect project id for RainbowKit
- `VITE_POLKADOT_RPC_URL`: optional override for Hub ETH RPC
- `VITE_POLKADOT_WS_URL`: optional override for the Dedot WebSocket endpoint
- `VITE_BLOCK_EXPLORER_URL`: optional override for Blockscout

## Contract Build + Deploy

Build contracts:

```bash
pnpm contracts:build
```

Deploy the factory:

```bash
cd contracts
RPC_URL=https://services.polkadothub-rpc.com/testnet \
PRIVATE_KEY=0x... \
CONTRACT_NAME=MultiSigFactory \
pnpm deploy-contracts
```

Optional deploy args can be passed through `CONSTRUCTOR_ARGS` as a JSON array.

## Why This Fits The Hackathon

- It is clearly a Track 2 PVM submission, not an EVM copy-paste
- Precompile usage is now a core workflow, not a README claim
- The app surfaces native asset balances and precompile proposals in the demo path
- Dedot integration gives us runtime-aware metadata without falling back to stale hardcoded assumptions

## Notes

- The frontend wallet flow still uses the ETH RPC path for contract execution. I kept that in place so the existing contract UX stays usable while we layer in more RelayCode-style chain context.
- The Dedot setup is intentionally lightweight and follows the same separation of concerns used in RelayCode: contract writes on one side, runtime metadata/context on the other.
