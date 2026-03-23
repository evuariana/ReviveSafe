# ReviveSafe Trust And Security

Updated: March 22, 2026

## Current Truth

ReviveSafe currently supports a shared-wallet beta on Paseo Asset Hub and
Polkadot Asset Hub, with programmable contract wallets plus a limited native
import path. The live repo supports:

- wallet connect through LunoKit with Talisman, SubWallet, and Polkadot.js
- mapped-address activation with `revive.map_account()` for programmable writes
- factory-backed wallet creation
- adding existing compatible contract wallets
- manual import of direct native multisig wallets from exact members and
  threshold
- proposal submission, approval, ready-to-execute state, and execution
- native token transfers and supported Asset Hub asset transfers
- top-level Inbox, Activity, and Proposals pages

Proxy support, automatic native wallet discovery, upgrade flows, modules,
rules, policies, and settings are not live in the current beta.

## Security Posture

- ReviveSafe is non-custodial: owners act through their own connected wallets.
- Only owners or direct imported native members can approve or execute proposals.
- Existing wallets must pass compatibility checks before they can be added to a
  workspace.
- Native imports are derived deterministically from the exact member set and
  threshold the user provides.
- No contract audit is linked or referenced in this repo today.

Because no published audit is available in-repo, treat the contracts as
**unaudited** until an audit is completed and linked publicly.

## Required User-Facing Disclosures

Every launch surface should say:

- this is a beta
- which chain is being used
- which wallet connections are supported
- that the live beta supports programmable contract wallets plus manual import
  of direct native multisigs
- that no audit is linked in the repo today and the contracts should be treated
  as unaudited
- that native import is manual, verified, and limited to direct multisigs
- that proxy import and automatic discovery are not live
- that compatibility checks apply when adding existing contract wallets
- that users must activate the mapped H160 before programmable write flows

## Reusable Copy

### Short banner copy

ReviveSafe is a beta shared-wallet workspace on Asset Hub. It supports
programmable contract wallets and manual import of direct native multisigs.
Proxy import is not live yet.

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
- `revive.map_account()` is required before programmable create, approve, or
  execute flows
- the mapping step does not move funds by itself

## What Not To Claim

Do not claim:

- automatic native wallet discovery
- proxy import is already live
- native wallet creation is already live
- full native history reconstruction when only a call hash exists
- public-production custody readiness
- audited contracts
- broader wallet governance features that are not implemented yet
- modules, rules, or settings as live product surfaces
