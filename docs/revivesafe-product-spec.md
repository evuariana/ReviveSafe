# ReviveSafe Product Specification

Last updated: March 20, 2026

## Source Summary

This document is based primarily on three source documents:

- `revivesafe-spec-chat-prompt.md` frames this as a product-definition task, not
  a UI redesign, implementation plan, or hackathon-scope exercise. It asks for
  a clear long-term product definition for ReviveSafe as a unified shared wallet
  platform for Polkadot teams.
- `revivesafe-product-spec-outline.md` establishes the current structural
  baseline: ReviveSafe should be one place for shared wallets, approvals,
  proposals, notifications, members, rules, and capabilities across native and
  programmable wallet rails.
- `revivesafe-benchmark-and-reference-notes.md` provides the supporting market,
  ecosystem, and technical context: Safe and Squads are the product-quality
  benchmarks, recent Polkadot wallet-tool shutdowns create a real gap, and
  Revive plus precompiles create a path to richer programmable wallets if they
  deliver real end-user value.

## Purpose

This document defines what ReviveSafe should become before homepage redesign,
dashboard redesign, or implementation scoping.

It is the product source of truth for:

- product messaging
- terminology
- information architecture
- wallet and proposal concepts
- future UX and design work

## Product Definition

ReviveSafe is a unified shared wallet platform for Polkadot teams.

It gives teams one place to:

- view all shared wallets and shared accounts they participate in
- receive notifications when action is needed
- create proposals
- approve and execute proposals
- manage members, approval rules, and wallet behavior
- work across native and programmable wallet rails inside one product

ReviveSafe is not only:

- a prettier multisig UI
- a treasury-only dashboard
- a PVM or Revive demo
- a contract deployment console with wallet features attached

ReviveSafe should feel like a durable end-user product for teams that control
funds, contracts, and operational actions together on Polkadot.

## Why ReviveSafe Should Exist

Polkadot already has native account-control primitives such as multisig and
proxy, but the day-to-day product experience around them has often been too
technical, too fragmented, or too dependent on knowing the underlying chain
mechanics.

At the same time, the ecosystem now has a real gap in maintained shared-wallet
tooling after the sunset or shutdown of products that many teams depended on.

ReviveSafe should exist because Polkadot teams need:

- a shared wallet product that is team-first instead of tool-first
- one approvals and operations layer across multiple wallets and action types
- better notifications, activity tracking, and signer coordination
- a path from simple shared control to more advanced wallet behavior without
  switching products
- a product-quality answer to the confidence and clarity that Safe and Squads
  created in other ecosystems

## Problem Statement

Today, many Polkadot teams still struggle with basic operational questions:

- What needs my approval right now?
- Which wallet is affected?
- What exactly will happen if this executes?
- Who has already approved?
- Who still needs to act?
- What changed since I last checked?

Native account primitives can answer some of these questions at the protocol
level, but they do not automatically create a strong product experience.

ReviveSafe should solve:

- poor day-to-day shared wallet UX
- fragmented approvals across tools and execution types
- weak coordination and notification flows
- limited visibility into proposal status and team activity
- lack of a strong programmable shared wallet product for Polkadot Hub

## Users And Personas

### Primary users

- protocol teams managing operational wallets
- treasury and foundation signers
- operations and finance teams
- DAO contributors handling shared actions
- technical teams managing assets and contracts on Polkadot Hub

### Secondary users

- integrators embedding shared wallet flows into other apps
- ecosystem teams that need richer approvals than raw native tooling provides

### User needs

- confidence about what a proposed action will do
- one place to track approvals and wallet activity
- a simpler path for common wallet tasks
- richer controls when simple threshold signing is no longer enough
- a wallet model that works across both everyday operations and advanced team
  coordination

## Core Product Promise

ReviveSafe gives Polkadot teams one approval and operations layer for shared
wallet activity.

The user should not have to think first about pallets, precompiles, `map_account`,
or contract architecture. They should understand:

- what needs approval
- who needs to act
- which wallet is affected
- what will happen on execution
- what rules apply to this action

## Why ReviveSafe Should Exist Now

ReviveSafe is timely because two conditions now exist at once:

- the ecosystem has a meaningful gap in product-quality shared wallet tooling
- Polkadot Hub, Revive, and precompiles create a real path to programmable
  shared wallets that can stay Polkadot-native instead of becoming generic EVM
  clones

That combination creates an opportunity to define a long-term product category
for Polkadot teams: a shared wallet platform that supports both existing native
control patterns and richer programmable wallets in one place.

## Product Principles

- Approval-centric, not contract-centric
- Team-first, not tool-first
- Native and programmable wallets should feel like two engines inside one
  product, not two separate apps
- Notifications are part of the product core, not optional polish
- Templates should simplify setup without hiding important behavior
- Technical concepts should be translated into wallet tasks and outcomes
- Activation and account mapping should never define the whole product
- The product should stay honest about what is truly enforced by each rail

## Product Objects

ReviveSafe should center on a small set of durable product objects.

### Workspace

The workspace is the user’s shared-wallet environment inside ReviveSafe.

It contains:

- wallets
- inbox and notifications
- approvals
- recent activity
- connected personal accounts

The workspace is the coordination layer around wallets. It is not itself the
on-chain wallet.

### Wallet

A wallet is the primary shared control object used by a team.

Every wallet has:

- an identity
- a wallet rail
- a wallet pattern
- members and roles
- a default approval rule
- balances and assets
- proposals
- notifications and activity
- modules and wallet rules

### Proposal

A proposal is the main unit of work in ReviveSafe.

Every meaningful action should become a proposal.

Examples:

- native token transfer
- Asset Hub asset transfer
- contract call
- XCM action
- signer or delegate change
- policy change
- module enablement
- batched operations

### Notification

A notification tells a user something changed or needs action.

Examples:

- you need to approve
- proposal reached threshold
- proposal is ready to execute
- proposal executed
- proposal failed
- signer or delegate changed
- wallet imported or created

### Template

A template is a one-click starting preset for creating a wallet.

Templates exist to simplify setup. They should help users get started quickly
without forcing them through advanced module and policy configuration up front.

Templates can apply to one or both rails. They package:

- a starting wallet intent
- a starting module set
- a default approval posture
- default wallet rules

### Module

A module is a wallet behavior package.

Modules are the main way ReviveSafe describes wallet behavior beyond the wallet
core. A module can add:

- actions
- approval overrides
- roles or permissions
- execution behavior
- notification events

Modules may be internal or external over time, but the product language should
remain consistent either way.

### Policy

A policy is a rule that governs wallet behavior.

Policies can exist at two levels:

- wallet-level policies, such as the default approval rule
- module-level policies, such as stricter rules for a specific kind of action

Policies should only be described as enforced when the underlying rail actually
enforces them.

### Rail

The rail is the underlying execution model for a wallet.

ReviveSafe should support at least two rails:

- native rail
- programmable rail

## Wallet Model

ReviveSafe should define a wallet as a combination of a wallet core, a rail, a
wallet pattern, and optional modules.

### Wallet core

The wallet core is always present.

It includes:

- wallet identity
- members
- default approval rule
- proposal queue
- notifications
- activity history

This is what keeps the product unified across rails.

### Wallet rails

ReviveSafe should support two equally first-class wallet rails.

#### Native rail

Purpose:

- best UX for native Polkadot shared account operations
- simpler onboarding
- broad accessibility for teams already living in native Polkadot workflows
- no contract deployment requirement

Native should not be treated as the lesser product. It should be the fastest
way for teams to get shared control in ReviveSafe.

#### Programmable rail

Purpose:

- richer wallet behavior
- modules and extensibility
- stronger policy expression
- deeper Polkadot-native integrations through programmable execution
- advanced team operations without leaving the shared wallet product

Programmable should not be treated as the only “real” wallet model. It is the
more powerful rail, but it still belongs inside the same product.

### Wallet patterns

The wallet pattern describes how shared control works on a given rail.

#### Native wallet patterns

- multisig
- proxy

Proxy is a real native Polkadot control pattern, not just a loose concept.
Within ReviveSafe, proxy should be treated as a first-class native wallet
pattern.

#### Programmable wallet pattern

- contract wallet

The programmable wallet pattern is a contract wallet deployed via Revive. It is
the team’s actual programmable shared wallet, not a global shared contract used
by all teams.

### What every wallet should show

Every wallet page should show:

- wallet identity
- wallet rail and wallet pattern
- members and roles
- default approval rule
- balances and assets
- pending proposals
- recent activity
- enabled modules
- wallet-level rules

Users should feel like they are looking at a team control surface, not just an
address page.

## Native vs Programmable Wallets

ReviveSafe should present native and programmable wallets as equally first-class
options inside one product.

### Native wallet value

Native wallets offer:

- the fastest path to shared control
- lower setup complexity
- direct compatibility with native Polkadot account patterns
- no contract activation or programmable-wallet setup burden

For many teams, native wallets may be enough for simple shared operations.

### Programmable wallet value

Programmable wallets should exist only because they offer user-visible value
that a native multisig UI does not provide cleanly.

Programmable wallets offer:

- richer wallet behavior beyond a single threshold model
- modules that package more complex wallet actions into understandable product
  behavior
- stronger policy expression by action type or context
- multi-step and batched operations
- deeper roles and delegated behavior
- one approval system across transfers, contract calls, and other wallet actions
- extensibility without waiting for runtime changes
- Polkadot-native capabilities through programmable execution backends such as
  precompiles

The honest constraint is important:

- if a team only needs standard N-of-M approvals for standard actions, a strong
  native shared wallet experience may already be sufficient
- programmable wallets are justified when teams need richer rules, richer
  actions, better packaging of complex behavior, or more extensible wallet
  control

### Precompiles in the programmable model

Precompiles should not be treated as a user-facing product category.

They matter because they let programmable wallets expose Polkadot-native actions
through wallet modules. In product terms:

- the user interacts with a wallet and a proposal
- the module determines what action is being proposed
- the programmable wallet executes the action
- some programmable modules may use precompiles under the hood to reach native
  chain functionality

This is what makes “programmable but Polkadot-native” a real product story.

### Activation and account mapping

Account activation and `map_account` are technical requirements of the
programmable rail. They are not product-defining features and should only be
surfaced where necessary during create, import, or setup flows.

## Modules, Templates, And Policies

This section defines the model that ties the wallet system together.

### Templates

Templates are the quick-start entry point.

They answer:

- what kind of wallet is the team trying to create
- what starting behavior should the wallet have
- what default approval posture should be applied

Templates should be user-facing and easy to understand.

Example templates:

- Team Wallet
- Treasury Wallet
- Operations Wallet
- Governance Wallet
- Cross-Chain Wallet

Templates should not be framed as “pick a contract.” Even when a programmable
template maps to a particular contract setup under the hood, the product concept
should remain a starting preset.

### Modules

Modules are the main behavior packages attached to a wallet.

They should be visible enough for users to understand what a wallet can do, but
they should not force users to think in low-level contract architecture terms.

Example modules:

- Native Transfer
- Asset Hub Assets
- Contract Calls
- XCM
- Delegation
- Spending Controls
- Batch Actions
- Automation

Modules should be able to support one or both rails.

Examples:

- a transfer-focused module may support both native and programmable wallets,
  but execute differently on each rail
- an XCM module may be much stronger on the programmable rail
- a spending-controls module may be limited on native and richer on
  programmable

Modules may be:

- internal first-party modules provided by ReviveSafe
- external ecosystem modules later, if the trust and security model is clear

### Policies

Policies are the rules that govern wallet behavior.

Policies should not overwhelm the product model. In most cases they should be
understood as:

- wallet-level defaults
- module-level rule overrides

Examples:

- default approval is 2 of 3
- XCM requires stronger approval than a standard transfer
- only certain members can propose through a specific module
- transfers above a certain value require stricter approval
- a delegate can draft actions but not approve them

### How templates, modules, and policies relate

Templates, modules, and policies should relate like this:

- templates define how a wallet starts
- modules define what behavior the wallet supports
- policies define how the wallet behaves and what rules apply

In practice:

- a template selects a starting wallet intent
- that template enables a starting module set
- the wallet core gets a default approval rule
- certain modules may add stricter or more specialized rules
- users can later manage modules and rules without redefining the wallet from
  scratch

This gives ReviveSafe both simplicity and flexibility:

- templates make setup easy
- modules make behavior understandable
- policies make control meaningful

## Proposal Model

The proposal should be the universal interaction model across the product.

Every meaningful action should become a proposal, regardless of rail.

### What a proposal should contain

- title
- wallet
- proposer
- action summary in plain English
- action type
- module
- execution rail
- approvals needed
- approvals received
- remaining approvers or conditions
- execution status
- execution result or failure reason

### Proposal lifecycle

- draft
- submitted
- pending approval
- ready to execute
- executed
- failed
- cancelled
- expired

### Proposal principles

- explain intent before technical payload
- make impact clear before showing raw calldata or extrinsics detail
- keep approvals, execution, and final status visible at all times
- use one proposal model across rails, even when the underlying execution path
  differs

## Notifications Model

Notifications are part of the core product, not optional polish.

ReviveSafe should have a dedicated inbox or activity center that spans all of a
user’s wallets in a workspace.

### In-app notifications

- pending approval
- proposal ready to execute
- proposal executed
- proposal failed
- signer, delegate, or member changed
- policy changed
- module changed
- wallet created or imported

### Notification principles

- separate “needs action” from “for awareness”
- deduplicate noisy updates
- make wallet and proposal context obvious
- keep the user aware of what changed without making them inspect every wallet
  manually

### Future channels

- browser notifications
- email
- Telegram
- Discord
- push or mobile notifications

Those future channels should extend one notification model, not create separate
product behavior for each channel.

## Dashboard And Navigation Model

The connected dashboard should not just be a list of wallets.

It should answer four questions immediately:

- what needs my action now
- what changed recently
- which wallets I control
- what I can do next

### Top-level navigation

- Home
- Inbox
- Wallets
- Proposals
- Activity
- Settings

### Home dashboard

Recommended sections:

- pending approvals
- proposals ready to execute
- inbox and recent activity
- wallet overview
- quick actions

### Wallet-level navigation

- Overview
- Proposals
- Assets
- Members
- Modules
- Rules
- Activity

The exact UI can change later, but the information model should stay consistent:
the dashboard is the team’s approval and operations layer, not just an address
book or asset list.

## Key User Journeys

### Create a wallet

- choose native or programmable rail
- choose a wallet template
- define members
- define the default approval rule
- review starting modules and wallet rules
- create or deploy the wallet

The experience should feel unified even though the underlying setup differs by
rail.

### Import an existing wallet

- connect account
- import native or programmable wallet
- detect wallet details
- place wallet into the workspace
- begin receiving notifications and activity in one shared product view

### Create a proposal

- choose wallet
- choose action type or module
- review human-readable summary
- submit for approval

### Approve and execute a proposal

- see what the action does
- see what rules apply
- approve with confidence
- know when a proposal is ready to execute
- confirm execution result

### Manage wallet behavior

- update members or delegates
- enable or disable modules
- update wallet rules or module policies
- review the full activity trail

## Differentiation From Existing Products

### Compared with raw native Polkadot tooling

ReviveSafe should offer:

- one workspace across shared wallets
- one inbox for approvals and activity
- one proposal model across actions
- clearer coordination and notification flows
- better explanation of what will happen on execution

### Compared with Safe

ReviveSafe should borrow:

- confidence in shared wallet positioning
- modular programmable wallet framing
- strong trust-building structure

ReviveSafe should differ by:

- treating native and programmable rails as equally first-class in one product
- being Polkadot-native instead of Ethereum-first
- using programmable wallets to reach native chain functionality where useful

### Compared with Squads

ReviveSafe should borrow:

- workflow-first product language
- clean operational clarity
- a strong multi-wallet workspace view
- action-oriented permissions framing

ReviveSafe should differ by:

- unifying native and programmable wallet rails
- supporting Polkadot-native control patterns such as proxy alongside
  programmable wallets
- using templates plus modules to bridge simple and advanced team wallet needs

### Compared with treasury dashboards

ReviveSafe should be broader than treasury:

- funds management
- shared contract operations
- cross-chain actions
- operational approvals
- member and wallet rule management

It should be a shared wallet platform, not only a treasury interface.

## Product Risks And Honest Constraints

- If programmable wallets only reproduce standard multisig with a different
  deployment path, their value will be weak.
- If native support is treated as a second-class adapter, the product will lose
  one of its clearest differentiators.
- If policies are described more strongly than the rail can enforce, users will
  lose trust.
- If modules become too technical or contract-shaped, the product will feel like
  a builder tool instead of an end-user wallet product.
- If templates hide too much behavior, users may create wallets they do not
  fully understand.

## Open Questions And Unresolved Tradeoffs

1. How close should native and programmable module parity be in the core product
   story?
2. Which modules are truly first-class at launch, and which should remain
   advanced or optional in the long-term model?
3. How much of the policy system should be shown directly versus surfaced only
   when a user needs advanced controls?
4. Should external modules be part of the core long-term product story or a
   later extensibility layer?
5. Should XCM be a default cross-rail module in the product story or a stronger
   programmable-only module at first?
6. How should ReviveSafe present proxy creation and management: as a dedicated
   native wallet pattern flow, or as a module-like behavior inside the broader
   wallet creation experience?
7. What is the clearest upgrade or migration story from native wallets to
   programmable wallets without implying that native is incomplete?
8. How should execution responsibility be modeled when a proposal has reached
   approval but still needs a final executor action?
9. Should workspaces have off-chain administrative roles distinct from on-chain
   wallet members and delegates?
10. How visible should technical programmable-wallet setup be in settings after
    creation, especially if account mapping or activation status matters later?

## Recommended Product Thesis

ReviveSafe should be the shared wallet product for Polkadot teams: one place to
manage shared wallets, proposals, approvals, and wallet behavior across both
native and programmable rails.

Its core promise is not “we use PVM” or “we support precompiles.” Its promise
is that Polkadot teams can control shared assets and actions through one trusted
approval experience.

Native wallets make shared control accessible and fast.
Programmable wallets make shared control more expressive and extensible.
Templates make setup simple.
Modules make wallet behavior understandable.
Policies make the wallet trustworthy.

If ReviveSafe gets this right, it becomes not just a better multisig UI, but
the long-term shared wallet and approvals layer for Polkadot teams.
