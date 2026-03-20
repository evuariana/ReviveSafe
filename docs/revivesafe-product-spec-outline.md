# ReviveSafe Product Spec Outline

Last updated: March 20, 2026

## Purpose

This document defines what ReviveSafe should become before homepage redesign,
dashboard redesign, or implementation phasing. It is the product source of
truth for future copy, UX, and AI-generated design prompts.

## Product Definition

ReviveSafe is a unified shared wallet platform for Polkadot teams.

It is not only:
- a prettier multisig UI
- a Solidity contract demo
- a treasury dashboard
- a hackathon-only product

It should become one place where teams can:
- see all shared wallets and shared accounts they participate in
- receive notifications when action is needed
- create proposals
- approve and execute proposals
- manage wallet members, rules, and capabilities
- work across native and programmable wallet rails in one product

## Core Product Promise

ReviveSafe gives Polkadot teams one approval and operations layer for shared
wallet activity.

The user should not have to think first about pallets, precompiles, or contract
architecture. They should understand:
- what needs approval
- who needs to act
- which wallet is affected
- what will happen on execution

## Product Problem

Polkadot already has native account-control primitives like pallet multisig and
proxy, but the UX around them has historically been fragmented, technical, or
tool-first rather than team-first.

The ecosystem also has a current gap in maintained multisig tooling after the
recent sunsetting or shutdown of important products.

ReviveSafe should solve:
- poor day-to-day shared wallet UX
- fragmented approvals across tools and execution types
- weak team coordination and notification flows
- lack of a strong programmable shared wallet product for Polkadot Hub

## Product Users

### Primary users
- protocol teams
- foundation and treasury signers
- operations teams
- DAO contributors
- technical teams managing contracts and assets on Polkadot Hub

### Secondary users
- integrators embedding shared-wallet flows into apps
- ecosystem teams needing richer approvals than raw extrinsics UI

## Product Objects

Everything in ReviveSafe should center on these objects:

### Workspace
The user’s overall shared-wallet environment inside ReviveSafe.

Contains:
- wallets
- approvals
- notifications
- recent activity
- connected accounts

### Wallet
A shared control object used by a team.

Wallets can eventually be:
- native shared wallets
- programmable wallets

Wallets have:
- members
- approval rules
- balances
- proposals
- activity
- capabilities

### Proposal
The main unit of work in the product.

Every meaningful action should become a proposal.

Examples:
- native token transfer
- Asset Hub token transfer
- contract call
- XCM action
- signer change
- policy change
- module enablement
- batched operations

### Notification
An event that tells a user something changed or needs action.

Examples:
- you need to approve
- proposal reached threshold
- proposal executed
- proposal failed
- signer changed
- wallet imported

### Module
An optional capability added to a programmable wallet.

Examples:
- asset transfer module
- batch operations module
- policy module
- XCM module
- automation module

### Policy
Rules that determine how a wallet behaves.

Examples:
- threshold by action type
- spend limits
- proposer vs signer permissions
- timing or destination restrictions

### Execution Rail
How the proposed action actually runs.

Potential rails:
- native Polkadot account/pallet rail
- programmable wallet rail via Revive
- precompile-powered action rail

## Product Architecture Model

ReviveSafe should be understood as a unified product over multiple wallet
engines and execution rails.

### Native wallet rail
Purpose:
- best UX for existing Polkadot-style shared account operations
- simpler onboarding
- no Revive account activation required

### Programmable wallet rail
Purpose:
- advanced wallet behavior
- modules
- policies
- richer operations and extensibility

### Polkadot-native integration rail
Purpose:
- expose Polkadot-native features through one wallet UX
- likely via precompiles or other integration patterns

## Why Programmable Wallets Exist

Programmable wallets should not exist in ReviveSafe just because PVM exists.

They are justified only if they create user-visible value that a native multisig
UI does not provide cleanly.

Examples of programmable-wallet value:
- one approval queue for multiple action types
- policy-based approvals
- spending limits
- proposer/delegate roles
- batched operations
- precompile-powered native asset actions
- contract-heavy team operations
- future extensibility without waiting for runtime changes

## Modules, Templates, and Policies

### Modules
Modules are optional capabilities attached to a programmable wallet.

They are not separate products and should not require users to understand
low-level contract architecture.

### Templates
Templates are the user-facing packaging of wallet capabilities.

Example templates:
- standard shared wallet
- treasury wallet
- operations wallet
- policy-controlled wallet
- cross-chain wallet

Templates can later map to:
- enabled modules
- preconfigured policies

### Policies
Policies define how a wallet behaves by action type or context.

Examples:
- low-value transfer uses lower threshold
- high-value transfer uses higher threshold
- XCM action requires stricter approval
- delegate can draft but not approve

## Notifications Model

Notifications are part of the product core, not optional polish.

### In-app notifications
- pending approval
- proposal ready to execute
- executed
- failed
- signer changed
- wallet imported

### Inbox
There should be a dedicated inbox or activity center in the product.

### Future channels
- browser notifications
- email
- Telegram
- Discord
- push/mobile

## Dashboard Model

The connected home screen should not just be a list of wallets.

The dashboard should primarily answer:
- what needs my action now
- what changed recently
- which wallets I control
- what I can do next

### Recommended dashboard sections
- pending approvals
- inbox / notifications / recent activity
- wallet overview
- quick actions

## Wallet Model

Every wallet page should show:
- wallet identity
- wallet type
- members and rules
- balances and assets
- pending proposals
- activity
- enabled capabilities or modules

Users should feel like they are looking at a team control surface, not just an
address page.

## Proposal Model

The proposal is the universal interaction model.

Each proposal should clearly show:
- title
- wallet
- proposer
- action type
- execution rail
- approvals needed
- approvals received
- execution result

## UX Principles

- Approval-centric, not contract-centric
- Team-first, not tool-first
- Native and programmable wallets should feel like two engines inside one
  product, not two separate apps
- Notifications should be visible everywhere they matter
- Activation should never define the whole product
- Technical concepts should be hidden behind task-oriented language

## Product Positioning Principles

ReviveSafe should be positioned closer to:
- Safe-quality shared wallet UX
- Squads-style operations clarity
- Polkadot-native integrations and execution rails

ReviveSafe should not be positioned as:
- a generic “control room”
- a PVM-first hackathon demo
- a deploy console with a wallet attached

## Open Questions

These need to be resolved in the dedicated spec-writing chat:

1. Are native and programmable wallets equally first-class in the product?
2. How much of native wallet support is in the core product definition versus a
   later execution adapter?
3. Is proxy part of the long-term wallet model or outside the first product
   definition?
4. Should XCM be a first-class wallet capability in the core product story?
5. Are templates visible to users at creation time, or should capabilities be
   exposed more directly?
6. Should programmable-wallet activation exist only during create/import flows,
   or also in wallet settings?

## Recommended Next Documents

After this outline is approved, create:
- full product spec
- messaging and terminology guide
- UX and IA spec
- Gemini prompt pack for homepage and dashboard redesign

## References

- Polkadot Hub smart contracts: https://docs.polkadot.com/reference/polkadot-hub/smart-contracts/
- Revive / smart contract functionality: https://docs.polkadot.com/parachains/customize-runtime/add-smart-contract-functionality/
- Revive account mapping and Ethereum-style accounts: https://docs.polkadot.com/smart-contracts/for-eth-devs/accounts/
- Polkadot precompiles overview: https://docs.polkadot.com/smart-contracts/precompiles/
- ERC-20 asset precompile: https://docs.polkadot.com/smart-contracts/precompiles/erc20/
- XCM precompile: https://docs.polkadot.com/develop/smart-contracts/precompiles/xcm-precompile/
- Safe modules docs: https://docs.safe.global/advanced/smart-account-modules
- Safe smart account concepts: https://docs.safe.global/advanced/smart-account-concepts
- Squads multisig product page: https://squads.xyz/multisig
- Squads v4 product update: https://squads.xyz/blog/v4-and-new-squads-app
- Mimir 2025 plan: https://forum.polkadot.network/t/mimir-2025-plan/13732
- Mimir sunset announcement: https://forum.polkadot.network/t/mimir-sunset-announcement/16749
- Multix sunset announcement: https://forum.polkadot.network/t/multix-sunset-announcement-jan-1-2026/16454
