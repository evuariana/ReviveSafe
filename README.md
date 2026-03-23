# ReviveSafe

ReviveSafe is a shared-wallet beta for Asset Hub. Today it combines
programmable contract wallets with manual import of direct native multisigs,
while routing the app through a Dedot and LunoKit-first runtime model:

- Solidity contracts compile to PolkaVM bytecode with `resolc`
- The frontend signs through `pallet_revive` extrinsics, not wagmi/RainbowKit
- The multisig can submit `pallet-assets` transfers through deterministic ERC-20 precompile addresses
- The app uses Dedot for chain context, mapping status, runtime metadata, and revive writes
- ETH RPC stays in place as a read-only adapter for contract state, calldata, and precompile balances

## Current Beta Scope

The truthful product scope in this repo today is:

- programmable contract wallet creation through the factory flow
- adding existing compatible contract wallets to the workspace
- manual import of direct native `pallet_multisig` wallets by exact member set
  and threshold
- proposal submission, approval, ready-to-execute state, and execution
- native token transfers and Asset Hub asset transfers through deterministic precompiles
- top-level Inbox, Proposals, and Activity workspace surfaces
- cross-wallet queueing for approvals, execution, and recent wallet activity
- native pending-proposal reads, approval by hash, and execution of supported
  imported calls when full call detail is recoverable

Not live yet in the current beta:

- native multisig or proxy wallet creation
- automatic native wallet discovery
- proxy wallet import
- native-to-programmable upgrade flows
- wallet rules, modules, policies, or settings as first-class end-user flows

Important native-import limits:

- import is manual and verified, not automatic
- the current native path is for direct multisigs only, not proxy wrappers
- imported native proposals are only fully explainable or executable when the
  original call can be recovered from chain history

## Launch Docs

- Release readiness: [`docs/revivesafe-release-readiness.md`](docs/revivesafe-release-readiness.md)
- Beta operator runbook: [`docs/revivesafe-beta-operator-runbook.md`](docs/revivesafe-beta-operator-runbook.md)
- Trust and security: [`docs/revivesafe-trust-and-security.md`](docs/revivesafe-trust-and-security.md)
- Observability checklist: [`docs/revivesafe-observability-checklist.md`](docs/revivesafe-observability-checklist.md)

## What Changed

- Added `submitAssetTransfer(uint32 assetId, address destination, uint256 amount)` to the wallet contract
- Added deterministic asset-precompile address derivation on-chain and in the frontend
- Switched the contract build flow from the old remote `@parity/revive` helper to local `@parity/resolc`
- Removed wagmi and RainbowKit from the frontend
- Added RelayCode-style LunoKit connect and chain selection controls
- Limited `map_account` gating to programmable wallet flows that actually need a mapped H160
- Rebuilt create, register, wallet detail, and proposal flows on top of `pallet_revive.call`
- Added a deploy console for `instantiateWithCode`, artifact upload, and post-deploy write calls
- Replaced stale config assumptions with explicit Paseo Asset Hub and Polkadot Asset Hub envs
- Added manual native multisig import, native wallet detail pages, and top-level Inbox/Proposals/Activity surfaces

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
- `VITE_REPOSITORY_URL`: optional override for repo and docs links shown in the app
- `VITE_BETA_SUPPORT_URL`: optional support or issue intake URL shown in the app
- `VITE_BETA_SUPPORT_LABEL`: optional short label for the support link
- `VITE_RELEASE_CHANNEL`: optional channel label for observability payloads such as `private-beta`
- `VITE_OBSERVABILITY_ENDPOINT`: optional endpoint that accepts JSON POST or beacon payloads for runtime and write failures

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

## Notes

- Contract writes now go through Revive extrinsics signed by LunoKit wallets.
- Read-only contract hydration still uses the ETH RPC path by design.
- Native wallet import derives the multisig account from the exact member set
  and threshold; it does not try to auto-discover all wallets for a signer.
- The deploy console can compile bundled or pasted Solidity, but the browser `resolc` chunk is large; treat it as an operator setup tool, not a primary end-user workflow.
- The current beta supports Talisman, SubWallet, and Polkadot.js through LunoKit.
- The safest default network for beta testing is Paseo Asset Hub unless your factory and balances are already verified on Polkadot Asset Hub.
- No contract audit is linked or referenced in this repo today. Treat the contracts as unaudited until a published audit exists.
- The frontend now includes a lightweight observability stub. External beta environments should set `VITE_OBSERVABILITY_ENDPOINT` before rollout.

## Writing

- Blog post: [`docs/how-revivesafe-used-relaycode-components.md`](docs/how-revivesafe-used-relaycode-components.md)
