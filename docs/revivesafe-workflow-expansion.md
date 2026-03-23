# ReviveSafe Workflow Expansion

Updated: March 22, 2026

## Executive Summary

This pass moved ReviveSafe from a mostly programmable contract-wallet beta
toward a more credible shared-wallet workspace.

What is real after this pass:

- programmable contract-wallet create, add, propose, approve, ready, and execute
- manual import of direct native `pallet_multisig` wallets on Asset Hub
- top-level `Inbox`, `Proposals`, and `Activity` pages
- combined wallet workspace views across imported native and programmable wallets
- native pending-operation reads, approval by hash, and execution of supported
  recovered calls

What is still not real:

- native wallet creation
- proxy import or proxy management
- automatic discovery of all native wallets for a signer
- native-to-programmable upgrade flows
- modules, rules, policies, or settings as real product surfaces

## Audit: Before This Pass

The repo already supported the core programmable contract-wallet beta:

- factory-backed programmable wallet creation
- adding compatible existing ReviveSafe contract wallets
- wallet-level proposal submission, approval, ready-to-execute state, and execution
- native balance transfers and Asset Hub asset transfers through the contract path
- dashboard previews of pending and executed programmable proposals

The repo did not yet truly support:

- native wallet import
- top-level `Inbox`, `Proposals`, or `Activity` product surfaces
- a combined wallet list across native and programmable rails
- truthful product-level treatment of native workflows
- modules/rules/settings as real end-user capabilities

## What “Native Wallet Import” Means On Polkadot

For ReviveSafe, native wallet import now means:

1. The user enters the exact direct member set and threshold for a native
   `pallet_multisig` wallet.
2. ReviveSafe derives the canonical multisig account deterministically.
3. ReviveSafe verifies that the connected signer is one of the direct members.
4. The app reads native balances, Asset Hub balances, and pending multisig
   operations for that derived account.
5. The imported wallet is stored in browser-local workspace state on the
   current device.

It does **not** mean:

- scanning the chain and automatically discovering every multisig a signer may
  belong to
- importing proxy-wrapped multisig setups
- reconstructing complete history for every old multisig operation

Inference from the official runtime model:

- automatic discovery is not a grounded default path here without an indexer or
  heavy history scan, because the chain stores open multisig operations by
  multisig account and call hash, not by “all multisigs this signer belongs to”
  as a first-class lookup surface

## Native Import Research Findings

### Chain behavior

Using official Polkadot SDK docs plus live runtime inspection on Asset Hub, the
relevant grounded facts are:

- `pallet_multisig` open operations store `when`, `deposit`, `depositor`, and
  `approvals`
- the pending storage entry does **not** reliably carry full call bytes
- if the originating approval was `asMulti`, the underlying runtime call can
  often be reconstructed from chain history
- if the originating approval was `approveAsMulti`, ReviveSafe may only have
  the call hash

Product consequence:

- imported native wallets should be described as **partially actionable**
  overall
- they are not merely read-only
- they are also not fully equivalent to programmable wallets or fully indexed
  Safe-style accounts

### What is real in this repo now

The repo can now truthfully support:

- import of direct native multisigs on supported Asset Hub chains
- pending-operation reads from live multisig storage
- approval of pending native operations by hash
- submission of new native `balances.transferKeepAlive` proposals
- submission of new native `pallet-assets` transfer proposals
- execution of supported imported native proposals when full call detail is
  recoverable

### Actionability decision

Imported native wallets should be treated as:

- **Partially actionable overall**

Why:

- approving by hash is real even when full detail is unavailable
- supported transfer calls are fully actionable when ReviveSafe can rebuild the
  runtime call
- old or hash-only imported operations may remain limited

This is the most truthful middle ground between “watch-only” and “fully
featured”.

## Inbox vs Proposals vs Activity

### Inbox

Inbox is the action center.

It should contain:

- proposals that need the current user’s approval
- proposals that are ready for the current user to execute
- wallet lifecycle notices such as wallet import
- important updates that are relevant now

### Proposals

Proposals is the cross-wallet work queue.

It should contain:

- pending approvals across imported native and programmable wallets
- ready-to-execute proposals across imported native and programmable wallets
- proposal-level status and approval progress

### Activity

Activity is a best-effort workspace feed.

It should contain:

- native events recorded in ReviveSafe with local timestamps
- executed programmable proposals as untimed snapshots recovered from current
  wallet state
- imported native wallet events recorded or recoverable in the workspace
- explicit acknowledgment that native history is partial without dedicated
  indexing and that programmable chronology is incomplete without indexed
  history

## Modules Truth Audit

There is **no real module system** in the current product or codebase.

What exists:

- proposal types
- contract execution policies
- wallet create/import flows
- queue and activity surfaces

What does not exist as a product capability:

- module install/enable/disable
- module-specific policies
- module-specific settings
- module-driven navigation or wallet configuration surfaces

Conclusion:

- ReviveSafe should continue to avoid claiming modules as a live product
  capability
- rules/settings/modules remain future-state product language only

## What Was Implemented In This Pass

### Native wallet import

- added a manual native import flow at `/import`
- derives the canonical multisig account from direct members plus threshold
- rejects mismatched supplied addresses
- verifies the connected account is a direct member
- persists imported native wallets in browser-local workspace state on the
  current device

### Shared workflow surfaces

- added top-level `Inbox`, `Proposals`, and `Activity` routes
- added a shared-surface hook that normalizes imported native and programmable
  proposal data into one queue model
- updated Home and Wallets to reflect the broader shared-wallet workspace

### Native wallet detail and actions

- added native wallet detail views
- shows direct members, balances, asset balances, pending operations, and local
  workspace events
- supports approving pending native operations
- supports executing supported recovered native operations
- supports submitting new native transfer proposals for supported call types

### Truthfulness safeguards

- removed app-wide mapping gating for routes that do not need `revive.map_account()`
- kept mapping requirements for programmable contract-wallet write paths
- updated repo docs and launch/trust notes to match the actual shipped scope
- tightened public-facing landing copy away from fake modules/rules claims

## What Remains Out Of Scope

- proxy import and proxy management
- native wallet creation
- automatic native wallet discovery by signer
- full native history indexing
- support for arbitrary imported runtime calls beyond the currently rebuilt
  transfer set
- native-to-programmable upgrade/successor flows
- modules, rules, policies, and settings as real product surfaces

## Benchmark Notes

### Safe

What Safe does well:

- queue/history separation is extremely clear
- account discovery and queue behavior feel operationally reliable
- history and export affordances reduce ambiguity

What matters for ReviveSafe:

- ReviveSafe should keep `Inbox`, `Proposals`, and `Activity` visibly separate
- ReviveSafe should not imply Safe-like automatic account discovery unless it
  actually ships the infrastructure for it

### Squads

What Squads does well:

- action-oriented multisig workflow
- clear operational framing around proposals and approvals

What matters for ReviveSafe:

- keep the work queue more important than raw balance dashboards
- keep proposal lifecycle language short and decisive

### Mimir

What Mimir does well:

- native Polkadot multisig workflows are first-class
- multisig accounts and extension wallets are treated as coequal product actors
- import and management flows lean into Polkadot-native control patterns

What matters for ReviveSafe:

- native import should feel primary, not like a fallback or watch-only bolt-on
- signer verification is important
- native and programmable rails should coexist in one workspace while still
  exposing their real differences

### Multix and related stateless tooling

What Multix did well:

- strong focus on chain-native multisig mechanics
- emphasis on open, chain-derived data rather than opaque private indexing
- useful handling of complex multisig/proxy setups

What matters for ReviveSafe:

- chain-derived truth is valuable, but pure statelessness has UX limits
- without indexing, some native history and discovery will remain partial
- ReviveSafe should stay honest about those limits instead of smoothing them
  over with fake certainty

## Updated Truthful Product Scope

After this pass, the honest product story is:

- ReviveSafe is a shared-wallet workspace for Asset Hub
- it supports programmable contract wallets and manual import of direct native
  multisigs
- proposals are the shared work model across supported wallet types
- `Inbox`, `Proposals`, and `Activity` are now real product surfaces
- imported native wallets are partially actionable, not read-only and not fully
  equivalent to programmable wallets
- modules/rules/settings are still not implemented product capabilities

## Sources And Research Inputs

Official chain and runtime references:

- Polkadot SDK `pallet_multisig` docs:
  <https://paritytech.github.io/polkadot-sdk/master/pallet_multisig/struct.Multisig.html>
- Polkadot Wiki multisig guide:
  <https://wiki.polkadot.network/learn/learn-account-multisig/>
- Polkadot Wiki multisig usage guides:
  <https://wiki.polkadot.com/learn/learn-guides-accounts-multisig/>

Official benchmark references:

- Safe transaction queue:
  <https://help.safe.global/en/articles/40818-transaction-queue>
- Safe address discovery / owner lookup:
  <https://help.safe.global/en/articles/40824-i-don-t-remember-my-safe-address-where-can-i-find-it>
- Squads multisig basics:
  <https://docs.squads.so/main/basics/what-is-a-multisig>
- Mimir account model:
  <https://docs.mimir.global/basic/accounts>
- Mimir create multisig:
  <https://docs.mimir.global/step-by-step/create-multisig>
- Multix official ChainSafe overview:
  <https://blog.chainsafe.io/multix-advanced-features-for-your-multisig-on-polkadot/>
- Multix sunset announcement:
  <https://forum.polkadot.network/t/multix-sunset-announcement-jan-1-2026/16454>
- PAPI stateless multisig tool:
  <https://forum.polkadot.network/t/papi-stateless-multisig-tool/12782>

Additional verification performed locally in this repo on March 22, 2026:

- live Asset Hub runtime inspection through Dedot
- live inspection of `multisig.multisigs` storage shape
- reconstruction testing for native multisig source extrinsics from block
  history
