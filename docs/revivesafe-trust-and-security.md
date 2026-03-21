# ReviveSafe Trust And Security

Updated: March 22, 2026

## Current Truth

ReviveSafe currently supports a programmable contract-wallet beta on Paseo
Asset Hub and Polkadot Asset Hub. The live repo supports:

- wallet connect through LunoKit with Talisman, SubWallet, and Polkadot.js
- mapped-address activation with `revive.map_account()`
- factory-backed wallet creation
- adding existing compatible contract wallets
- proposal submission, approval, ready-to-execute state, and execution
- native token transfers and supported Asset Hub asset transfers

Native multisig import, proxy support, upgrade flows, Inbox, Activity,
Proposals, modules, rules, policies, and settings are not live in the current
beta.

## Security Posture

- ReviveSafe is non-custodial: owners act through their own connected wallets.
- Only owners can approve or execute proposals.
- Existing wallets must pass compatibility checks before they can be added to a
  workspace.
- No contract audit is linked or referenced in this repo today.

Because no published audit is available in-repo, treat the contracts as
**unaudited** until an audit is completed and linked publicly.

## Required User-Facing Disclosures

Every launch surface should say:

- this is a beta
- which chain is being used
- which wallet connections are supported
- that the live beta is for programmable contract wallets
- that no audit is linked in the repo today and the contracts should be treated
  as unaudited
- that compatibility checks apply when adding existing contract wallets
- that users must activate the mapped H160 before write flows

## Reusable Copy

### Short banner copy

ReviveSafe is a beta for programmable contract wallets on Asset Hub. Native
wallet import and proxy flows are not live yet.

### Trust copy

ReviveSafe is non-custodial and open source, but no contract audit is linked in
this repo today. Treat the contracts as unaudited and verify the network and
factory before use.

### Support copy

If a beta flow blocks you, include the network, wallet address, mapped H160,
and proposal id when opening support.

## Mapped Address Disclosure

ReviveSafe write flows rely on the mapped H160 used by `pallet_revive`.
Users should understand:

- the mapped H160 is the address used for contract wallet ownership checks
- `revive.map_account()` is required before create, approve, or execute flows
- the mapping step does not move funds by itself

## What Not To Claim

Do not claim:

- native multisig or proxy import is already live
- public-production custody readiness
- audited contracts
- broader wallet governance features that are not implemented yet
- a full two-rail product implementation today
