# ReviveSafe Testnet Readiness And Demo Plan

Updated: March 22, 2026

## Executive Summary

ReviveSafe is not yet the full approved product model from the V2 product,
messaging, and UI docs.

The truthful demoable product today is:

- a programmable shared-wallet flow on Polkadot Asset Hub / Paseo Asset Hub
- LunoKit wallet connection plus `revive.map_account()` gating
- factory-backed contract wallet create and register flows
- contract-backed proposal submission, approval, ready-to-execute state, and execution
- Asset Hub token transfers through the deterministic ERC-20 precompile path
- dashboard action queues and wallet-scoped recent activity

The highest-risk mismatch was that the app still talked like a broader native +
programmable shared-wallet product while the implementation was mostly a
programmable contract wallet app. This pass moved the wallet core toward the
product model instead: proposals now stay pending until an explicit execution,
any owner can execute once threshold is reached by default, and the contract now
has a real execution-policy hook for future stricter rules.

## Approved Model Vs Current Repo

| Area | Approved product model | Current repo after hardening | Status |
| --- | --- | --- | --- |
| Wallet types | Native + Programmable in one product | Programmable contract wallet path is real; native wallet path is not implemented end to end | Partial |
| Import flow | Native wallet import is first-class | Existing contract wallets can be registered; native multisig/proxy import is not live | Partial |
| Proposal model | Universal proposal model | Real for contract wallet transfers and Asset Hub asset transfers; broader settings/member/rules proposal types are not implemented | Partial |
| Inbox / Activity | Top-level product surfaces | No dedicated Inbox page; dashboard queues and wallet recent activity now provide the truthful live substitute | Partial |
| Wallet detail | Team control surface with tabs | Real wallet overview, owners, balances, pending proposals, recent executed activity; modules/rules/settings depth is not there | Partial |
| Native-to-programmable lifecycle | Guided successor flow | Not implemented | Missing |
| Modules / Policies / Rules | User-visible product model | Not implemented as a real product surface | Missing |

## Current Truthful Product Scope

### Real and working in code

- Wallet connection through LunoKit
- Network-aware Dedot client setup
- `revive.map_account()` gating before write paths
- Factory-backed programmable wallet creation
- Registering an already deployed contract wallet
- Wallet detail reads over ETH RPC
- Proposal submission through `pallet_revive.call`
- Approval flow
- Explicit ready-to-execute state plus execution flow
- Deterministic asset-precompile transfer submission
- Dashboard sections for `Needs your approval`, `Ready to execute`, and recent executed activity
- Wallet-scoped recent activity
- Key loading, empty, and error states on dashboard, wallets, and wallet detail

### Fixed in this hardening pass

- The wallet contract now keeps proposals pending until an explicit execution instead of auto-executing on final approval
- Default execution policy now matches the product model: any owner can execute once threshold is reached
- A contract-level execution-policy hook exists for future stricter rules through wallet self-governance
- Zero-value / empty proposals and invalid asset-transfer proposals are now blocked at the contract layer as well as in the UI
- Zero-address owner replacement is now blocked in wallet governance
- Non-owners no longer see action buttons on wallet proposals
- Wallet and factory read failures no longer degrade into fake empty states
- Dashboard now shows live proposal queues and recent activity instead of only wallet counts
- Asset metadata discovery now surfaces explicit errors instead of silently degrading to an empty list, and the discovery window is broader for demo use

### Still mock, partial, or not implemented

- Native wallet create flow
- Native wallet import flow
- Proxy wallet path
- Dedicated Inbox page
- Dedicated top-level Activity page
- Dedicated top-level Proposals page
- Member management proposals
- Rules/modules/settings product model from the approved docs
- Native-to-programmable upgrade flow

## Prioritized Gaps

### Highest priority remaining demo gaps

1. Native rail is only partially real
   The app now supports manual import of direct native multisigs, but native
   create, proxy flows, and fully indexed history are still missing.

2. Wallet configuration depth is still shallow
   Modules, rules, policies, lifecycle, and upgrade relationships are product
   concepts in docs, not real app flows yet.

3. Native history remains partial without indexing
   Imported native proposals can be recovered from chain state, but hash-only
   proposals still limit how much detail the UI can show.

### Medium priority risks

1. The Polkadot Asset Hub network is available in config, but Paseo Asset Hub is the safer demo path unless a factory and balances are already verified on Polkadot Asset Hub.
2. Registering an existing wallet only makes sense when the connected mapped account is an owner, otherwise it will not show up under `My Wallets`.
3. Frontend bundle size is still large for a hackathon demo build.
4. Asset discovery is still metadata-driven and capped for UI practicality, so very high-ID assets may still need a targeted follow-up if they are part of the demo.

## Required Env Vars And Setup

### Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Create the frontend env file:

```bash
cp frontend/.env.example frontend/.env
```

3. Build the repo:

```bash
pnpm --filter contracts build
pnpm --filter frontend build
pnpm --filter frontend lint
```

4. Run the app:

```bash
pnpm frontend:dev
```

### Required frontend env vars

From [`frontend/.env.example`](/Users/evisha/Projects/ReviveSafe/frontend/.env.example):

- `VITE_FACTORY_ADDRESS`
  Optional. Leave blank if you will deploy or manually set the factory in the app.
- `VITE_PASEO_ETH_RPC_URL`
- `VITE_PASEO_WS_URL`
- `VITE_PASEO_EXPLORER_URL`
- `VITE_POLKADOT_ASSET_HUB_ETH_RPC_URL`
- `VITE_POLKADOT_ASSET_HUB_WS_URL`
- `VITE_POLKADOT_ASSET_HUB_EXPLORER_URL`

### Demo operator requirements

- A supported browser wallet extension through LunoKit
  Talisman, SubWallet, or Polkadot.js
- At least one funded testnet account for mapping and deployment
- Preferably two funded owner accounts for the approval demo
- A deployed `MultiSigFactory` address, or time in the demo to deploy one
- A wallet funded with the native token for transfer tests
- A wallet funded with at least one supported Asset Hub asset for the precompile transfer demo

### Recommended network

- Recommended demo network: `Paseo Asset Hub`
- Use `Polkadot Asset Hub` only if the factory, owner accounts, and asset balances are already verified there

## Exact Test Flows

### 1. Wallet connection and gating

Steps:

1. Open the app.
2. Connect a wallet from the landing page.
3. Attempt to open `/dashboard`.

Expected result:

- Unauthenticated `/dashboard` redirects back to `/`
- After connect, the app enters the dashboard layout
- If the account is not mapped yet, the mapping gate blocks the workspace and shows the mapped H160

### 2. Map the account

Steps:

1. On the mapping gate, click `Activate wallet`.
2. Sign the `revive.map_account()` transaction.

Expected result:

- Mapping completes successfully
- The workspace unlocks
- The dashboard shows the account as `Active`

### 3. Factory setup

Steps:

1. If `Factory` is missing on the dashboard, open `Contracts`.
2. Compile and deploy `MultiSigFactory`, or set a known deployed factory as active.

Expected result:

- Dashboard workspace status shows `Factory: Configured`
- Wallet list queries begin loading from the active factory

### 4. Create wallet

Steps:

1. Open `Create wallet`.
2. Confirm the connected mapped H160 is prefilled as the first owner.
3. Add at least one more owner.
4. Set a threshold such as `2 of 2`.
5. Submit the create transaction.

Expected result:

- The wallet is created on-chain
- It appears in `Wallets`
- Wallet detail shows owners, threshold, native balance, and empty proposal/activity states

### 5. Add existing contract wallet

Steps:

1. Open `Add contract wallet`.
2. Paste an existing deployed `MultiSigWallet` address.
3. Submit.

Expected result:

- Success banner appears
- The wallet appears in `Wallets` if the connected mapped account is one of the owners

### 6. Proposal creation: native transfer or contract call

Steps:

1. Open a wallet you own.
2. Click `Create proposal`.
3. Choose `Native transfer`.
4. Enter a recipient and either:
   - a positive amount, or
   - calldata for a contract call
5. Submit.

Expected result:

- The proposal appears in the wallet proposal queue immediately
- It records the proposer approval
- If threshold is not yet reached, status is `Awaiting approvals`
- If threshold is reached, status moves to `Ready to execute`

### 7. Approval flow

Steps:

1. Switch to a second owner account.
2. Map the second account if needed.
3. Open the same wallet and approve the pending proposal.

Expected result:

- Approval count increments
- The dashboard `Needs your approval` queue updates
- If threshold is reached, the proposal moves into `Ready to execute`

### 8. Execution flow

Steps:

1. Execute the approved proposal from any owner on the wallet.

Expected result:

- Proposal leaves the pending queue
- It appears in wallet `Recent activity`
- Dashboard `Recent activity` updates

Important note:

- The default wallet policy now matches the product model:
  - non-owners cannot act
  - any owner can execute once threshold is reached
  - a stricter confirming-owner execution policy exists in the contract for future use, but there is no UI for changing it yet

### 9. Asset-precompile transfer flow

Steps:

1. Open a wallet holding a supported Asset Hub asset.
2. Create a proposal in `Asset transfer` mode.
3. Select the asset, recipient, and amount.
4. Submit, approve, and execute the proposal.

Expected result:

- The proposal is decoded as an Asset Hub token transfer
- The deterministic precompile address is visible in the proposal detail card
- After execution, the wallet asset balance changes
- Recent activity shows the executed transfer

### 10. Read-only and error-state behavior

Steps:

1. Open a wallet from a non-owner account.
2. Open `Create wallet` or `Add contract wallet` with no factory configured.
3. Open a bad wallet address or a wallet on the wrong network.

Expected result:

- Non-owners see read-only messaging and no proposal action buttons
- Missing factory shows actionable guidance instead of silent failure
- Bad wallet reads show explicit error messaging instead of fake zero balances or fake empty queues

## Expected Results Summary

- Connect -> gated workspace -> mapped account -> live dashboard
- Factory configured -> wallet list populated
- Create wallet -> wallet visible and usable
- Register existing contract wallet -> visible if current account is an owner
- Submit proposal -> queue updates immediately
- Approve proposal -> counts update correctly and threshold moves the proposal into `Ready to execute`
- Execute proposal -> queue clears and recent activity updates
- Asset transfer -> decoded as Asset Hub transfer and reflected in balances/activity

## Verification Results

### Passed locally

- `pnpm --filter contracts build`
- `pnpm --filter contracts test`
- `pnpm --filter frontend lint`
- `pnpm --filter frontend build`

### Not fully verified locally in this environment

These still require a real extension wallet, funded testnet accounts, and live chain interaction:

- Wallet connection completion through an extension
- `revive.map_account()` success on-chain
- Factory deployment on-chain
- Contract wallet creation on-chain
- Proposal approval across multiple real owners
- Proposal execution on-chain
- Asset-precompile transfer success on-chain

Additional note:

- The new contract lifecycle and policy behavior were verified in a local Ganache-backed contract test harness, but end-to-end browser execution against a live Asset Hub testnet was not rerun in this pass.

## Known Blockers Or Risks

1. Native wallet create/import/proxy flows are not implemented end to end.
2. No dedicated Inbox page exists yet.
3. No dedicated product-level Activity page exists yet.
4. Modules/rules/settings depth from the approved product is not implemented.
5. Demo quality depends on having multiple funded mapped accounts.
6. Frontend build still emits a large-bundle warning.
7. Frontend build still prints Vite externalization warnings around `@parity/resolc` browser compilation.
8. There is still no UI for changing the new contract execution policy, so the wallet runs on the default any-owner execution rule for now.

## Recommended Demo Narrative

1. Start with the truthful framing:
   ReviveSafe today is the programmable shared-wallet path for Polkadot Asset Hub, with the broader native/shared-wallet product direction still ahead.
2. Connect and map an account.
3. Show the dashboard status and factory readiness.
4. Create a shared wallet live.
5. Submit a proposal.
6. Switch to another owner and approve it.
7. Execute it from an approved owner.
7. Execute it from any owner once the proposal is ready.
8. Return to the dashboard and wallet activity to show the proposal lifecycle end to end.
9. If available, repeat the same flow with an Asset Hub token transfer to highlight the precompile integration.

## What To Show Judges

- Wallet connection through a Polkadot wallet extension
- `revive.map_account()` as the Revive-specific setup gate
- A real on-chain programmable shared wallet creation flow
- A proposal moving from creation to approval to execution
- The contract-first execution model
  Proposals become ready, then any owner can execute by default
- The future-facing policy hook
  The contract already supports stricter execution rules through wallet governance even though the UI does not expose it yet
- Asset Hub token transfer through the deterministic ERC-20 precompile path
- Dashboard action queues and wallet recent activity updating after execution
- Honest scope communication
  Programmable path is live today; native wallet import is real but manual and limited
