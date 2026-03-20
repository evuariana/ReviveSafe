# ReviveSafe

ReviveSafe is a rebuilt PVM-track multisig for Polkadot Asset Hub. It keeps the
core Solidity multisig flow, but now routes the app through a Dedot and
LunoKit-first runtime model:

- Solidity contracts compile to PolkaVM bytecode with `resolc`
- The frontend signs through `pallet_revive` extrinsics, not wagmi/RainbowKit
- The multisig can submit `pallet-assets` transfers through deterministic ERC-20 precompile addresses
- The app uses Dedot for chain context, mapping status, runtime metadata, and revive writes
- ETH RPC stays in place as a read-only adapter for contract state, calldata, and precompile balances

## What Changed

- Added `submitAssetTransfer(uint32 assetId, address destination, uint256 amount)` to the wallet contract
- Added deterministic asset-precompile address derivation on-chain and in the frontend
- Switched the contract build flow from the old remote `@parity/revive` helper to local `@parity/resolc`
- Removed wagmi and RainbowKit from the frontend
- Added RelayCode-style LunoKit connect and chain selection controls
- Added a blocking `map_account` setup gate so every write path uses a mapped H160
- Rebuilt create, register, wallet detail, and proposal flows on top of `pallet_revive.call`
- Added a deploy console for `instantiateWithCode`, artifact upload, and post-deploy write calls
- Replaced stale config assumptions with explicit Paseo Asset Hub and Polkadot Asset Hub envs

## Stack

- Contracts: Solidity `0.8.28`, `@parity/resolc`, `ethers`
- Frontend: React, Vite, Tailwind, `@luno-kit/react`, `@luno-kit/ui`
- Chain metadata and revive writes: `dedot`, `@dedot/chaintypes`
- Supported networks:
  - Paseo Asset Hub (default)
  - Polkadot Asset Hub

## Quick Start

Toolchain:

- Node `24.14.0`
- pnpm `10.30.3`

The workspace now pins both through `package.json` and `pnpm-workspace.yaml`, so
contributors can use `pnpm` directly or `nvm use` with the repo root version.

Install dependencies:

```bash
pnpm install
```

Create frontend env values:

```bash
cp frontend/.env.example frontend/.env
```

Leave `VITE_FACTORY_ADDRESS` blank until you deploy or register a
`MultiSigFactory`. The dashboard and deploy page both handle a missing factory
cleanly.

Build everything:

```bash
pnpm --filter contracts build
pnpm --filter frontend build
pnpm --filter frontend lint
```

Run the frontend:

```bash
pnpm frontend:dev
```

Run the frontend preview:

```bash
pnpm frontend:build
pnpm frontend:preview
```

## Frontend Env

`frontend/.env` expects:

- `VITE_FACTORY_ADDRESS`: optional deployed `MultiSigFactory` address
- `VITE_PASEO_ETH_RPC_URL`: optional override for Paseo Asset Hub ETH RPC
- `VITE_PASEO_WS_URL`: optional override for Paseo Asset Hub websocket
- `VITE_PASEO_EXPLORER_URL`: optional override for Paseo explorer
- `VITE_POLKADOT_ASSET_HUB_ETH_RPC_URL`: optional override for Polkadot Asset Hub ETH RPC
- `VITE_POLKADOT_ASSET_HUB_WS_URL`: optional override for Polkadot Asset Hub websocket
- `VITE_POLKADOT_ASSET_HUB_EXPLORER_URL`: optional override for Polkadot Asset Hub explorer

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
- The app surfaces mapping, revive writes, deploy flows, and precompile proposals in the demo path
- Dedot integration gives us runtime-aware metadata instead of stale hardcoded assumptions
- The connect button, chain selector, and input patterns now align with RelayCode instead of the old wallet stack

## Notes

- Contract writes now go through Revive extrinsics signed by LunoKit wallets.
- Read-only contract hydration still uses the ETH RPC path by design.
- The deploy console can compile bundled or pasted Solidity, but the browser `resolc` chunk is large; this is expected for the hackathon operator workflow.

## Writing

- Blog post: [`docs/how-revivesafe-used-relaycode-components.md`](docs/how-revivesafe-used-relaycode-components.md)
