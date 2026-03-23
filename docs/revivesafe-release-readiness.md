# ReviveSafe Release Readiness

Updated: March 22, 2026

## Launch Recommendation

**Private beta**

Reason:

- The programmable contract-wallet flow is real and materially hardened.
- Direct native multisig import is now real with a truthful manual model.
- Truthful beta copy, support links, trust/security docs, and a lightweight
  observability stub now exist in-repo.
- Public beta is still blocked by environment-specific rollout work:
  configured observability, named support ownership, and a final smoke pass on
  the exact factory and chain that will face users.

## Truthful Current Scope

ReviveSafe truly supports today:

- programmable contract wallets on Paseo Asset Hub and Polkadot Asset Hub
- LunoKit wallet connect with Talisman, SubWallet, and Polkadot.js
- mapped-address activation with `revive.map_account()`
- factory-backed wallet creation
- adding existing compatible contract wallets to the workspace
- manual import of direct native `pallet_multisig` wallets from exact members
  plus threshold
- wallet detail reads for owners, balances, pending proposals, and recent
  executed activity
- proposal submission, approval, ready-to-execute state, and execution
- native token transfers and supported Asset Hub asset transfers
- top-level Inbox, Proposals, and Activity pages
- cross-wallet proposal and activity views across imported native and
  programmable wallets

ReviveSafe does **not** truly support today:

- native wallet creation
- automatic native wallet discovery
- proxy wallet flows
- native-to-programmable upgrade flows
- modules, rules, policies, settings, or richer governance flows as end-user
  product surfaces

## Launch Blockers

These still block a serious public beta:

1. The target rollout environment is not fully pinned in-repo yet.
   Fill the chain, factory, explorer, support owner, seeded wallets, and RPC
   details in [the beta operator runbook](./revivesafe-beta-operator-runbook.md).

2. Observability must be configured on the real deployment.
   The code stub exists, but `VITE_OBSERVABILITY_ENDPOINT`, uptime checks, and
   seeded smoke checks still need to be active on the chosen environment.

3. Support ownership still needs named operators.
   The app can point users to support, but a public beta needs an actual owner,
   incident process, and response window.

## Should Fix Before Public Beta

- Ship with a verified `VITE_FACTORY_ADDRESS` for the user-facing chain instead
  of relying on operator setup during onboarding.
- Validate the exact target flow on both supported chains and decide whether
  Polkadot Asset Hub should remain visible or be hidden until verified.
- Add a lightweight deployed-environment smoke script or CI step that checks
  the chosen factory and one seeded wallet automatically.
- Reduce or isolate the heavy operator-tooling bundle. The frontend build still
  emits large chunk warnings, especially around the browser `resolc` tooling.
- Trim any remaining landing claims that imply the full future two-rail product
  instead of the live programmable beta.

## Post-Launch Items

- native wallet creation
- proxy wallet flows
- richer governance proposals, rules, modules, and settings
- broader native history/indexing, asset discovery, and bundle-size optimization

## Required Setup And Env Vars

Required for core app connectivity:

- `VITE_PASEO_ETH_RPC_URL`
- `VITE_PASEO_WS_URL`
- `VITE_PASEO_EXPLORER_URL`
- `VITE_POLKADOT_ASSET_HUB_ETH_RPC_URL`
- `VITE_POLKADOT_ASSET_HUB_WS_URL`
- `VITE_POLKADOT_ASSET_HUB_EXPLORER_URL`

Strongly recommended for beta rollout:

- `VITE_FACTORY_ADDRESS`
- `VITE_BETA_SUPPORT_URL`
- `VITE_BETA_SUPPORT_LABEL`
- `VITE_RELEASE_CHANNEL`
- `VITE_OBSERVABILITY_ENDPOINT`

Optional:

- `VITE_REPOSITORY_URL`

## Supported Wallet And Network Flows

Supported flow today:

1. Connect a supported wallet.
2. Import a direct native multisig by entering the exact members and threshold,
   or activate the account with `revive.map_account()` for programmable flows.
3. Create a programmable contract wallet from the active factory.
4. Add an existing compatible contract wallet if the connected mapped account
   is already an owner.
5. Open top-level Inbox, Proposals, and Activity to review cross-wallet work.
6. Open a wallet and inspect balances, owners or members, pending proposals,
   and recent activity.
7. Submit a native token transfer, Asset Hub asset transfer, or calldata
   proposal.
8. Approve a pending proposal as an owner or direct native member.
9. Execute a ready proposal as an eligible owner or direct native member when
   the underlying call details are available.

Recommended default network:

- `Paseo Asset Hub`

Use `Polkadot Asset Hub` only when the target factory, balances, and support
coverage have been verified there.

## Known Limitations

- Native import is manual and limited to direct multisigs; there is no
  automatic wallet discovery.
- Imported native proposals may be hash-only if the original call cannot be
  recovered from chain history.
- Imported native execution is currently limited to supported balances and
  `pallet-assets` transfers when full call detail is recoverable.
- Add-wallet supports only compatible ReviveSafe contract wallets.
- Programmable owners still act through mapped H160 addresses under the hood.
- Asset discovery remains metadata-driven and capped for UI practicality.
- The deploy console is still present because factory setup remains an operator
  concern.

## Trust And Security Disclosure Requirements

Every launch surface should disclose:

- this is a beta
- which chain is in scope
- which wallet connections are supported
- that the live beta supports programmable contract wallets plus manual import
  of direct native multisigs
- that no audit is linked in the repo today and the contracts should be treated
  as unaudited
- that native import is manual and does not auto-discover wallets
- that proxy import is not live
- that add-wallet only supports compatible contract wallets
- that mapped-address activation is required for programmable wallet writes

Reference copy lives in
[the trust and security doc](./revivesafe-trust-and-security.md).

## QA Checklist

- connect with Talisman, SubWallet, and Polkadot.js
- verify chain switching between Paseo Asset Hub and Polkadot Asset Hub
- verify runtime connection failure banners by simulating a bad WS endpoint
- verify mapping gate success and failure states
- verify direct native multisig import from the exact member set and threshold
- verify create-wallet success on the target factory
- verify SS58 owner input resolves correctly to mapped H160
- verify add-wallet success for an owner account
- verify incompatible contract wallet rejection in add-wallet flow
- verify native token transfer proposal submission
- verify Asset Hub asset transfer proposal submission
- verify top-level Inbox, Proposals, and Activity surfaces reflect live wallet state
- verify imported native approvals can be approved by hash
- verify imported native execution only appears when full supported call detail is available
- verify proposal approval by a second owner
- verify ready-to-execute appears only after threshold is met
- verify execution succeeds and recent activity updates
- verify non-owners cannot see approve or execute controls

## Operations Checklist

- fill the environment inventory in
  [the beta operator runbook](./revivesafe-beta-operator-runbook.md)
- set `VITE_FACTORY_ADDRESS` for the target environment
- set `VITE_BETA_SUPPORT_URL` and confirm someone owns it
- set `VITE_OBSERVABILITY_ENDPOINT`
- add uptime checks for the chosen WS and ETH RPC endpoints
- run the seeded smoke flow on the real factory before rollout
- keep rollback or pause authority with the named incident lead

## Latest Repo Verification

Latest verification run in this repo:

- `pnpm --filter contracts test`
  Passed. 6 tests passed in about 72s. Ganache fell back from native `uws`
  bindings to a pure Node.js implementation, which affected performance only.
- `pnpm --filter frontend lint`
  Passed cleanly after the workflow expansion and copy-truthfulness updates.
- `pnpm --filter frontend build`
  Passed. Vite still emitted existing browser-compatibility warnings from
  `@parity/resolc` and `solc`, plus large chunk warnings for the operator
  tooling bundle.

## Recommended Next Milestone After Beta

The next milestone should be a **public-beta-ready programmable wallet
release with truthful limited native import**, not a premature scope expansion.

That means:

- lock a verified default chain and factory
- automate smoke coverage for the live environment
- operate with real support and observability
- then deepen native indexing, proxy support, and the broader two-rail product model
