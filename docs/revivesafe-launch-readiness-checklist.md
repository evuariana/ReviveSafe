# ReviveSafe Launch Readiness Checklist

Updated: March 22, 2026

## Current Truthful Product Scope

ReviveSafe currently supports a **programmable contract-wallet beta** on Paseo
Asset Hub and Polkadot Asset Hub.

Live in code today:

- LunoKit wallet connection with Talisman, SubWallet, and Polkadot.js
- `revive.map_account()` activation gating before write paths
- factory-backed programmable wallet creation
- adding existing compatible contract wallets to the workspace
- wallet detail reads, balances, owners, and recent activity
- proposal submission, approval, ready-to-execute state, and execution
- native token transfers and supported Asset Hub asset transfers
- dashboard queues for `Needs your approval`, `Ready to execute`, and recent
  executed proposals

Not live today:

- native wallet creation
- native wallet import
- proxy wallet flows
- native-to-programmable upgrade flows
- top-level Inbox, Proposals, or Activity pages
- member management, modules, rules, policies, or settings as first-class
  product flows

## What Is Launch-Ready Now

- The contract lifecycle is now truthful: submit, approve, ready, execute.
- The factory no longer trusts arbitrary wallet addresses without compatibility
  checks.
- Non-owners do not see confirm or execute actions.
- The authenticated app now shows clearer beta-scope messaging instead of
  implying live native support.
- Register flow now verifies compatible wallet shape and owner access before
  allowing add-to-workspace.
- Address inputs now accept either mapped H160 addresses or Polkadot SS58
  addresses and normalize them to the mapped H160 used on-chain.
- Runtime connection failures now surface as explicit UI warnings instead of
  silently degrading into misleading empty states.
- `pnpm --filter contracts test` passes.
- `pnpm --filter frontend lint` passes.
- `pnpm --filter frontend build` passes.

## Must Fix Before Launch

These are still the real blockers for a serious public beta:

1. Public-facing scope must stay narrow everywhere you publish it.
   The deployed landing page, docs site, screenshots, and announcements must
   describe ReviveSafe as a programmable contract-wallet beta. Do not claim
   live native wallet import, proxy support, Inbox, upgrade flows, or richer
   rules/modules unless those surfaces are actually shipped.

2. Ship an operator runbook for the target beta environment.
   Include the active factory address, target chain, funded owner accounts,
   faucet guidance, supported wallets, expected mapping flow, and who owns
   incident response during the beta.

3. Add minimal observability before opening to outside users.
   At minimum:
   - frontend error reporting for runtime connection failures and failed revive
     writes
   - uptime checks for the selected WS and ETH RPC endpoints
   - a smoke test against the deployed factory and one seeded wallet
   - a support contact or issue intake path visible to beta users

4. Publish trust and security language that matches reality.
   If the contracts are unaudited, say so plainly. If this is testnet-only,
   say so plainly. Do not imply production custody readiness.

5. Validate the exact target rollout environment end to end.
   The chosen network, factory address, funded demo/beta wallets, asset
   balances, explorer links, and env vars need one final pre-release smoke pass
   on the actual deployment target.

## Can Wait Until Post-Launch

- native wallet create and import
- proxy wallet support
- native-to-programmable upgrade flows
- dedicated Inbox, Proposals, and Activity surfaces
- member management and richer wallet governance flows
- modules, rules, policies, and settings product depth
- broader asset discovery beyond the current metadata-driven cap
- bundle-size optimization for operator tooling
- deeper end-to-end automation beyond smoke coverage

## Setup And Env Requirements

Required frontend env vars:

- `VITE_FACTORY_ADDRESS`
  Optional in development. For a public beta, prefer shipping with a verified
  factory already configured.
- `VITE_PASEO_ETH_RPC_URL`
- `VITE_PASEO_WS_URL`
- `VITE_PASEO_EXPLORER_URL`
- `VITE_POLKADOT_ASSET_HUB_ETH_RPC_URL`
- `VITE_POLKADOT_ASSET_HUB_WS_URL`
- `VITE_POLKADOT_ASSET_HUB_EXPLORER_URL`

Recommended runtime assumptions:

- default beta network: `Paseo Asset Hub`
- use `Polkadot Asset Hub` only after the target factory and seeded balances
  are verified there
- a deployed `MultiSigFactory` should exist before public beta users arrive
- at least two funded owner accounts should be available for approval-flow
  checks

## Supported Flows

Supported user flows today:

1. Connect a supported wallet.
2. Activate the account with `revive.map_account()`.
3. Create a programmable contract wallet from the factory.
4. Add an existing compatible contract wallet if the connected mapped account
   is already an owner.
5. Open the wallet and inspect owners, balances, pending proposals, and recent
   executed activity.
6. Submit a proposal:
   - native token transfer
   - custom calldata transaction
   - Asset Hub asset transfer through the deterministic ERC-20 precompile path
7. Approve a pending proposal as an owner.
8. Execute a ready proposal as an eligible owner.

## Known Limitations

- ReviveSafe is not yet a true two-rail product in implementation.
- Native wallet import is still not truly ready.
- Some public-facing design surfaces still describe future-state IA and wallet
  types beyond the shipped beta, so release materials must be curated
  carefully.
- Only compatible ReviveSafe contract wallets should be treated as supported in
  the add-wallet flow.
- Owners still act through mapped H160 addresses under the hood, even though
  the UI now accepts SS58 input.
- The deploy/operator tools remain part of the app because factory setup still
  matters operationally.
- Asset discovery is metadata-driven and capped for UI practicality.
- The frontend build still emits large-chunk warnings, especially for the
  operator deploy tooling.

## Trust And Security Communication Requirements

Before launch, make sure every user-facing surface says:

- this is a beta
- which network it is for
- which wallets are supported
- that the live beta is for programmable contract wallets
- whether contracts are audited or unaudited
- that only owners can approve and execute proposals
- that compatibility checks apply when adding an existing contract wallet

Recommended trust additions:

- link the source repo and contract source
- link the deployed factory address and explorer
- provide a short explanation of the execution lifecycle
- provide a short explanation of mapped-address activation

## QA Checklist

Core pre-release checks:

- connect with Talisman, SubWallet, and Polkadot.js
- verify chain switching between Paseo Asset Hub and Polkadot Asset Hub
- verify runtime-connection failure banners by simulating a bad WS endpoint
- verify mapping gate success and failure states
- verify create-wallet success on the target factory
- verify duplicate-owner validation in create flow
- verify SS58 owner input resolves correctly to mapped H160
- verify add-wallet success for an owner account
- verify add-wallet rejection or block for non-owner accounts
- verify incompatible contract wallet rejection in the add-wallet flow
- verify native token transfer proposal submission
- verify Asset Hub asset transfer proposal submission
- verify proposal approval by a second owner
- verify ready-to-execute state appears only after threshold is met
- verify execution succeeds and the proposal moves into executed activity
- verify non-owners cannot see approve or execute controls
- verify missing-factory and missing-runtime states render helpful next steps
- verify wallet detail and dashboard do not degrade into fake empty states on
  read failures

## Release Plan

1. Close the pre-launch blockers above.
2. Freeze the public beta scope copy and reuse it across landing, README,
   release notes, and support docs.
3. Deploy the chosen factory and confirm env vars on the real beta environment.
4. Run the QA checklist against the exact deployed environment.
5. Roll out in stages:
   - internal team smoke test
   - invited external beta users
   - broader public beta
6. Monitor runtime/RPC health and failed write volume during the first release
   window.

## Release Recommendation

**Private beta**

Reason:

- The core programmable contract-wallet flow is real and no longer just demo
  logic.
- The product is still too narrow and too operationally dependent on manual
  setup to position as a broad public shared-wallet launch.
- A public beta becomes reasonable after the launch blockers above are closed,
  especially truthful release messaging, operator readiness, and basic
  observability.
