# ReviveSafe Product Specification V2

Last updated: March 20, 2026

## Source Summary

This document is based primarily on three source documents:

- `revivesafe-spec-chat-prompt.md` frames this work as a dedicated
  product-definition exercise, not a UI redesign, implementation plan, or
  hackathon-scope simplification.
- `revivesafe-product-spec-outline.md` provides the structural baseline:
  ReviveSafe should be a unified shared wallet platform for Polkadot teams
  across native and programmable rails.
- `revivesafe-benchmark-and-reference-notes.md` provides the external product
  and ecosystem context: Safe and Squads are the quality benchmarks, Polkadot
  has a real shared-wallet product gap, and Revive plus precompiles create a
  path to programmable wallets that can still feel Polkadot-native.

## What Changed In V2

This version keeps the core direction of the original spec but clarifies several
product areas that were previously underdefined:

- wallet lifecycle and evolution
- native wallet import as a first-class journey
- native-to-programmable upgrade as a guided successor flow
- wallet settings differences across rails
- visible but unavailable upgrade prompts on native wallets
- future expansion through new precompiles without changing the product model
- optional wallet identity and risk enrichment for better member and wallet
  context

## Purpose

This document defines what ReviveSafe should become before homepage redesign,
dashboard redesign, or implementation phasing.

It is intended to be the product source of truth for:

- product positioning
- terminology
- wallet concepts
- proposal and approvals concepts
- information architecture
- future UX and design work

## Product Definition

ReviveSafe is a unified shared wallet platform for Polkadot teams.

It gives teams one place to:

- view shared wallets and shared accounts they participate in
- receive notifications when action is needed
- create proposals
- approve and execute proposals
- manage members, roles, rules, and wallet behavior
- work across native and programmable wallet rails inside one product

ReviveSafe is not only:

- a prettier multisig UI
- a treasury-only dashboard
- a PVM or Revive demo
- a deploy console with wallet features attached

ReviveSafe should be defined as a meaningful end-user product for teams that
need to coordinate shared funds, shared operations, and shared on-chain actions
over time.

## Why ReviveSafe Should Exist

Polkadot already has powerful native account-control primitives such as multisig
and proxy, but the product layer around them has often been fragmented,
technical, and hard for teams to use day to day.

The ecosystem also now has a clear product gap after recent multisig-tool
sunsets and shutdowns.

ReviveSafe should exist because Polkadot teams need:

- a team-first shared wallet product
- one approval and operations layer across many wallet actions
- better notifications and signer coordination
- a clean way to import and improve existing native wallets
- a path from simple shared control to richer programmable control without
  changing products

## Problem Statement

Many Polkadot teams still struggle to answer basic operational questions:

- What needs my approval right now?
- Which wallet is affected?
- What exactly will happen if this executes?
- Who has already approved?
- Who still needs to act?
- What changed since I last checked?

Native account primitives can support shared control, but they do not by
themselves create a strong team product.

ReviveSafe should solve:

- poor day-to-day shared wallet UX
- fragmented approvals across tools and execution types
- weak notification and coordination flows
- low visibility into wallet activity and proposal state
- lack of a strong programmable shared wallet product for Polkadot

## Users And Personas

### Primary users

- protocol teams
- foundation and treasury signers
- operations and finance teams
- DAO contributors
- technical teams managing contracts and assets on Polkadot Hub

### Secondary users

- integrators embedding shared-wallet workflows into other apps
- ecosystem teams that need richer approvals than raw native tooling provides

### Core user needs

- confidence in what an action will do before approval
- one place to see approvals, activity, and wallet state
- simple setup for common team wallet needs
- richer controls when simple threshold signing is no longer enough
- continuity between existing native wallets and future programmable wallets

## Core Product Promise

ReviveSafe gives Polkadot teams one approval and operations layer for shared
wallet activity.

The user should not have to think first about pallets, precompiles,
`map_account`, or contract architecture. They should understand:

- what needs approval
- who needs to act
- which wallet is affected
- what will happen on execution
- what rules apply to this action

## Why ReviveSafe Should Exist Now

ReviveSafe is timely because two conditions now exist at once:

- the ecosystem has a real gap in maintained, product-quality shared-wallet
  tooling
- Polkadot Hub, Revive, and precompiles create a path to more expressive wallet
  behavior without abandoning Polkadot-native execution

That combination creates the opportunity for ReviveSafe to become the shared
wallet and approvals layer for Polkadot teams.

## Product Principles

- Approval-centric, not contract-centric
- Team-first, not tool-first
- ReviveSafe is one shared-wallet product with two rails: native is the
  simplest rail and programmable is the extensible rail
- Templates should make setup easy
- Modules should make wallet behavior understandable
- Policies should make control meaningful
- Notifications are part of the product core, not optional polish
- Imported wallets should feel first-class, not like second-class records
- Technical setup steps should never define the whole product
- The product must stay honest about what each rail truly enforces

## Product Objects

ReviveSafe should center on a small number of durable product objects.

### Workspace

The workspace is the user’s shared-wallet environment inside ReviveSafe.

It contains:

- wallets
- inbox and notifications
- recent activity
- connected personal accounts
- member and wallet context

The workspace is a coordination layer around wallets. It is not itself the
on-chain wallet.

### Wallet

A wallet is the primary shared control object used by a team.

Every wallet has:

- an identity
- a rail
- a wallet pattern
- members and roles
- a default approval rule
- proposals
- activity
- assets and balances
- modules
- policies
- settings

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
- member or delegate changed
- wallet imported
- upgrade available

### Template

A template is a one-click starting preset for creating or upgrading a wallet.

Templates should package:

- a wallet intent
- a starting module set
- a default approval posture
- starting wallet rules

Templates should help users move quickly without making them understand advanced
wallet configuration on day one.

### Module

A module is a wallet behavior package.

Modules are the main way ReviveSafe describes behavior beyond the wallet core. A
module can add:

- actions
- approval overrides
- roles or permissions
- execution behavior
- notification behavior

### Policy

A policy is a rule that governs wallet behavior.

Policies should exist at two levels:

- wallet-level defaults
- module-level overrides

Policies should only be described as enforced when the underlying rail actually
enforces them.

## Wallet Decision Model

ReviveSafe uses a small set of terms that should stay consistent throughout the
product:

- `rail`: the underlying wallet engine; native is the simplest rail and
  programmable is the extensible rail
- `pattern`: the shared-control pattern used on that rail, such as multisig,
  proxy, or contract wallet
- `template`: the quick-start preset used when creating or upgrading a wallet
- `module`: the behavior package that defines what a wallet can do
- `policy`: the rule that governs how a wallet behaves
- `lifecycle`: whether a wallet is newly created, imported, current, legacy, or
  in migration

## Wallet Model

ReviveSafe should define a wallet as a combination of:

- a wallet core
- a rail
- a wallet pattern
- modules
- policies
- lifecycle state

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

### Rails

ReviveSafe should support two long-term rails inside one product.

The product rule should be simple:

- native is the simplest rail
- programmable is the extensible rail

Both should remain credible long-term options, but they do not need to be
described as identical.

#### Native rail

Purpose:

- best UX for native Polkadot shared account operations
- simpler onboarding
- direct use of native control patterns
- no programmable wallet deployment requirement

Native should not be treated as the lesser product. It should be a real,
credible long-term option for teams that want simple and reliable shared
control.

#### Programmable rail

Purpose:

- richer wallet behavior
- better extensibility
- stronger policy expression
- deeper Polkadot-native integration through programmable execution
- more powerful team operations without leaving the product

Programmable should not be treated as the only serious rail. It is the more
expressive rail, but it exists inside the same product model.

### Wallet patterns

The wallet pattern describes how shared control works on a given rail.

#### Native wallet patterns

- multisig
- proxy

Proxy is a real native Polkadot control pattern and should be treated as a
first-class native wallet pattern in the product model.

Product prioritization should still be clear:

- multisig should be the default native creation flow
- proxy should be a supported native pattern in the same product model
- proxy does not need equal creation prominence before the core multisig UX is
  solid

Where ReviveSafe supports proxy actions, they should use the same product model
as other wallet actions:

- they appear in the same proposal system
- they appear in the same inbox and notifications model
- they are managed through the same wallet settings structure

#### Programmable wallet pattern

- contract wallet

The programmable wallet pattern is a contract wallet deployed via Revive. It is
the team’s actual programmable wallet, not a global shared contract used by all
teams.

### What every wallet should show

Every wallet page should show:

- wallet identity
- rail and wallet pattern
- members and roles
- default approval rule
- balances and assets
- pending proposals
- activity
- enabled modules
- wallet rules
- lifecycle status

Users should feel like they are looking at a team control surface, not just an
address page.

## Native vs Programmable Wallets

ReviveSafe should present native and programmable wallets as two rails inside
one shared-wallet product.

The positioning rule should be easy to understand:

- choose native when you want the simplest path to shared control
- choose programmable when you need more expressive wallet behavior

### Native wallet value

Native wallets offer:

- the fastest path to shared control
- lower setup complexity
- direct alignment with native Polkadot account patterns
- simpler import and adoption for existing ecosystem teams

For many teams, native wallets may be enough for their current needs.

### Programmable wallet value

Programmable wallets should exist only because they provide user-visible value
that a native multisig UI does not offer cleanly.

Programmable wallets offer:

- richer wallet behavior beyond a single threshold model
- modules that package advanced wallet actions and controls
- stronger policies by action type or context
- multi-step and batched operations
- more flexible roles and delegation
- one proposal model across transfers, contract calls, and advanced actions
- extensibility without waiting for runtime changes
- Polkadot-native actions through programmable execution backends such as
  precompiles

Choose programmable when the team needs policies, batching, delegated roles,
automation, or Polkadot-native actions beyond standard shared approvals.

The honest constraint is important:

- if a team only needs standard N-of-M approvals, a strong native shared wallet
  may already be enough
- programmable wallets become compelling when teams need richer control,
  deeper extensibility, or more expressive wallet logic

### Precompiles in the programmable model

Precompiles should not be treated as a user-facing product category.

They matter because they allow programmable wallets to expose more
Polkadot-native behavior through modules.

In product terms:

- the user sees a wallet and a proposal
- the module defines the behavior
- the programmable wallet executes the action
- some modules use precompiles under the hood to reach native chain features

That is what makes “programmable but Polkadot-native” a credible product story.

### Activation and account mapping

Account activation and `map_account` are technical requirements of the
programmable rail. They are not product-defining features and should appear
only where necessary during setup or diagnostics.

## Templates, Modules, And Policies

This is the core configuration model for ReviveSafe.

### Templates

Templates are the quick-start entry point.

They answer:

- what kind of wallet is the team creating or upgrading to
- what starting behavior should the wallet have
- what starting approval posture should apply

Example templates:

- Team Wallet
- Treasury Wallet
- Operations Wallet
- Governance Wallet
- Cross-Chain Wallet

Templates should not be framed as “pick a contract.” Even when a programmable
template maps to a contract setup under the hood, the user-facing concept should
remain a starting preset.

Templates should be used in:

- wallet creation
- native-to-programmable upgrade

Templates should matter less after creation. Once a wallet exists, the ongoing
model should mostly be modules and policies.

### Modules

Modules are the main behavior packages attached to a wallet.

Example modules:

- Native Transfer
- Asset Hub Assets
- Contract Calls
- XCM
- Delegation
- Spending Controls
- Batch Actions
- Automation

Modules should:

- be understandable to end users
- support one or both rails where appropriate
- remain stable product concepts even when the implementation changes

Modules may be:

- internal first-party modules
- external ecosystem modules later, if the trust and security model is clear

### Policies

Policies are the rules that govern wallet behavior.

In most cases they should be understood as:

- wallet-level defaults
- module-level overrides

Examples:

- default approval is 2 of 3
- XCM requires stricter approval
- only certain members can use a specific module
- transfers above a threshold require stronger approval
- a delegate can draft but not approve

### How templates, modules, and policies relate

- templates define how a wallet starts
- modules define what the wallet can do
- policies define how the wallet behaves

In practice:

- a template selects a starting intent
- that template enables a starting module set
- the wallet core gets a default approval rule
- modules can add stricter or more specialized rules
- after creation, the wallet evolves through module and policy changes rather
  than by switching templates

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
- who can execute once ready
- which account is expected to pay execution fees
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
- make impact clear before showing raw calldata or raw extrinsics detail
- keep approvals and final status visible at all times
- use one proposal model across rails even when execution differs underneath

### Execution responsibility

ReviveSafe should make execution responsibility explicit.

Once a proposal reaches threshold, the product should clearly show:

- whether it is ready to execute or already executed
- who is allowed to execute
- which account is expected to pay execution fees
- whether execution is manual or automatic for that wallet behavior

The default product assumption should be that execution is explicit, not
invisible. In most cases, any eligible signer should be able to execute once a
proposal is ready, unless the wallet rule or module says otherwise.

## Notifications Model

Notifications are part of the product core, not optional polish.

ReviveSafe should have a dedicated inbox that spans all of a user’s wallets in a
workspace.

### Notification categories

#### Needs action

- pending approval
- proposal ready to execute
- member onboarding action needed
- migration step pending

#### Informational updates

- proposal executed
- proposal failed
- member or delegate changed
- policy changed
- module changed

#### Onboarding and lifecycle notices

- wallet created
- wallet imported
- wallet partially reconstructed
- wallet upgrade available

### Notification principles

- separate “needs action” from “for awareness”
- separate operational alerts from onboarding and lifecycle notices
- keep wallet and proposal context obvious
- deduplicate noisy updates
- make migration and onboarding state visible without forcing manual tracking

### Future channels

- browser notifications
- email
- Telegram
- Discord
- push or mobile notifications

These channels should extend one notification model rather than create separate
product logic.

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

### Inbox vs Activity

ReviveSafe should separate `Inbox` and `Activity` clearly.

Inbox is the actionable and notification-oriented feed.
It should contain:

- approvals waiting on the user
- proposals ready to execute
- onboarding or migration notices
- important informational notifications tied to recent changes

Activity is the historical ledger and audit trail.
It should contain:

- executed proposals
- failed proposals
- membership and rules changes
- module changes
- wallet lifecycle history

The user should go to Inbox to decide what needs attention now.
The user should go to Activity to understand what happened over time.

### Home dashboard

Recommended sections:

- pending approvals
- proposals ready to execute
- inbox preview
- recent activity summary
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
- Settings

The exact UI can change later, but the information model should stay consistent:
ReviveSafe is an approval and operations layer, not just an address list or
asset list. Inbox is the cross-wallet action and notification surface. Activity
is the historical record at both workspace and wallet level.

## Wallet Lifecycle And Evolution

This lifecycle model matters, but it is secondary to the everyday product loop:
open the app, see what needs action, approve or execute, and track activity.

ReviveSafe should support four core wallet journeys:

- create
- import
- extend
- upgrade

### Create a wallet

This is the entry point for new wallets created inside ReviveSafe.

Flow:

- choose native or programmable rail
- choose a wallet template
- define members
- define the default approval rule
- review the starting module set and rules
- create or deploy the wallet

The experience should feel unified even though the underlying setup differs by
rail.

### Import a wallet

Import should be a first-class product capability, not a secondary feature.

Current product definition:

- import applies to native wallets
- imports should be actionable for connected, verified signers inside ReviveSafe
- watch-only import should not be part of the core product model
- programmable wallets are created in ReviveSafe rather than imported from other
  systems
- ReviveSafe should reconstruct only the wallet state it can reliably detect
  from chain data and supported indexing
- if some history or proposal state cannot be fully recovered, the wallet should
  remain usable but be clearly labeled as partially reconstructed until the user
  confirms or completes the missing context

Import flow:

- connect an actionable signer
- detect the native wallet and verify signer authority against on-chain wallet
  membership or delegation
- reconstruct members, approval rules, balances, and supported proposal or
  activity history where available
- import it into the workspace
- show members, rules, assets, proposals, and activity with clear confidence
  about what was reconstructed versus confirmed
- enable actions for the importing signer once authority is verified
- begin onboarding the rest of the wallet members

### Member onboarding after import

One signer importing a wallet does not mean every member is already onboarded in
ReviveSafe.

The product should distinguish between:

- wallet imported
- team onboarded

Recommended member states:

- detected
- invited
- connected
- active in ReviveSafe

Recommended flow:

- one member imports the native wallet
- ReviveSafe detects the full on-chain member set
- the importing member becomes immediately active
- other members are shown as detected but not yet connected
- the importing member can invite the others
- other members connect and become active when they authenticate with their own
  signer accounts

Imported wallets should still feel first-class from the first step.

### Extend a wallet

Extending a wallet means changing it while keeping the same rail.

Examples:

- enable or disable modules
- update wallet rules
- add delegates or roles
- add stricter controls
- expand supported actions

Extending is most powerful on programmable wallets, but some native wallets may
also gain additional product-level behavior within native limits.

### Upgrade a wallet

Upgrading should be a guided evolution path, not a hidden advanced feature.

The key rule is:

- if the rail stays the same, extend in place
- if the rail changes, upgrade through a guided successor flow

ReviveSafe should not pretend a native wallet literally becomes a programmable
wallet in place. In practice, this is a guided migration to a programmable
successor wallet.

### Native-to-programmable upgrade flow

Recommended flow:

- user opens a native wallet
- ReviveSafe shows upgrade opportunities through visible but unavailable module
  prompts and richer controls
- user chooses to upgrade to a programmable wallet
- ReviveSafe pre-fills a programmable setup using the existing team context
- user chooses a programmable template
- ReviveSafe explains what changes:
  - new wallet address
  - same team context
  - richer modules and policies
  - migration steps still needed
- ReviveSafe deploys the programmable successor wallet
- ReviveSafe links old and new wallets in the workspace
- ReviveSafe guides migration proposals and tasks

Wallet relationships matter mostly here, during evolution flows. The product may
need to show states such as:

- current wallet
- legacy wallet
- successor wallet
- wallet in migration

### What the upgrade should preserve

- same workspace
- same team context
- copied members where possible
- a similar default approval posture where reasonable
- visible wallet history
- a clear relationship between legacy and successor wallets

### What changes during upgrade

- wallet address
- rail
- available modules
- policy power
- execution model

### Upgrade prompts on native wallets

Native wallets should visibly show some advanced controls as available with a
programmable upgrade rather than hiding them completely.

Examples:

- advanced spending controls
- richer delegation
- XCM behavior
- automation
- batch operations

This makes the product feel larger than the current wallet while preserving
native as a legitimate option rather than a broken one.

## Settings Model

ReviveSafe should keep a unified settings shape across rails while allowing
rail-specific depth where necessary.

### Shared settings structure

Every wallet should have settings areas for:

- overview
- members
- approvals and rules
- modules
- notifications
- activity and audit history
- advanced settings

This keeps the product feeling unified even when the rail differs.

### Native wallet settings

Native wallet settings should focus on:

- wallet pattern: multisig or proxy
- native approval configuration
- delegates and proxy relationships where relevant
- supported modules on native
- visible upgrade prompts for programmable-only behavior

Native settings should be clear about the difference between:

- what the native rail truly enforces
- what ReviveSafe only helps coordinate

### Programmable wallet settings

Programmable wallet settings should focus on:

- modules
- policy configuration
- role and delegate configuration
- module permissions
- advanced wallet behavior

Technical setup details should exist, but mostly in advanced areas. Things like
activation, mapping status, and lower-level contract details should not dominate
the main settings experience.

## Execution Backends And Future Precompile Expansion

ReviveSafe should keep the product model stable even as the underlying execution
surface expands.

### Stable user-facing model

The user-facing concepts should remain stable:

- wallet
- template
- module
- proposal
- policy

### Expandable execution backends

Under the hood, modules can execute through different backends:

- native extrinsic
- native proxy
- contract call
- precompile

### Future precompile growth

The spec should assume that more Polkadot-native precompiles may appear over
time.

ReviveSafe should not need a new product model every time that happens.
Instead:

- new precompiles should expand what existing modules can do
- some modules may gain programmable support later
- some modules may become stronger on programmable over time
- the product should continue to describe behavior in module terms rather than
  protocol-plumbing terms

Examples:

- Asset Hub Assets module uses ERC-20 asset precompiles where appropriate
- XCM module can use XCM precompiles
- future governance or treasury-related modules may use new precompiles if they
  become available

This keeps the product future-friendly without making precompiles the headline
story.

## Key User Journeys

### Create a new team wallet

- choose a rail
- choose a template
- define the members
- confirm the default approval rule
- create the wallet

### Import an existing native wallet

- connect actionable signer
- import the wallet into the workspace
- become immediately active as one of its members
- invite the remaining members
- continue using the wallet in ReviveSafe as a verified signer while the rest of
  the team onboards

### Extend a programmable wallet

- review modules and rules
- enable new wallet behavior
- approve the change
- use the wallet with expanded capabilities

### Upgrade a native wallet

- import or open an existing native wallet
- discover richer controls through visible upgrade prompts
- create a programmable successor wallet
- migrate team operations and assets through guided proposals
- keep old and new wallets linked until the team completes migration

## Future Opportunities

These ideas may materially improve the product later, but they should not be
treated as part of the core shared-wallet architecture today.

### Wallet context, identity, and trust enrichment

ReviveSafe may later support an optional enrichment layer that adds:

- on-chain identity context
- known social or contact signals where available
- wallet verification signals
- risk or reputation signals

Potential uses:

- making member invitations easier
- showing clearer member identity in approvals and activity
- flagging suspicious destinations or counterparties
- improving wallet import and migration confidence

This should remain optional enrichment rather than a dependency of the core
product flow.

Trust-layer principles:

- useful context should improve confidence, not overwhelm the wallet flow
- identity and risk signals should assist decisions, not replace them
- third-party scores should be treated as signals, not absolute truth
- the product should be careful about privacy, consent, and false positives

## Differentiation From Existing Products

### Compared with raw native Polkadot tooling

ReviveSafe should offer:

- one workspace across shared wallets
- one inbox for approvals and activity
- one proposal model
- clearer explanations of what actions do
- a visible path from native shared control to richer programmable control

### Compared with Safe

ReviveSafe should borrow:

- confidence in shared wallet positioning
- modular smart-account thinking
- strong trust-building structure

ReviveSafe should differ by:

- being one shared-wallet product with a simplest rail and an extensible rail
- supporting native Polkadot control patterns as part of the core product
- using programmable wallets to reach more Polkadot-native behavior where useful

### Compared with Squads

ReviveSafe should borrow:

- action-oriented workflow language
- clear team operations framing
- strong multi-wallet workspace thinking
- practical permission and spending-control language

ReviveSafe should differ by:

- unifying native and programmable wallet rails
- supporting import and evolution of existing native wallets
- using templates plus modules to bridge simple and advanced wallet control

### Compared with treasury dashboards

ReviveSafe should be broader than treasury:

- shared funds
- shared contract operations
- cross-chain actions
- approval workflows
- member and rules management
- wallet evolution and migration

It should be a shared wallet platform, not only a treasury surface.

## Product Risks And Honest Constraints

- If programmable wallets only reproduce standard multisig with a different
  deployment path, their value will be weak.
- If native support is treated as a second-class adapter, the product will lose
  one of its clearest differentiators.
- If imports feel partial or second-class, ReviveSafe will be less appealing to
  teams migrating from existing tools.
- If policies are described more strongly than the rail can enforce, trust will
  erode quickly.
- If modules become too technical, the product will feel like a builder tool
  instead of an end-user wallet product.
- If templates hide too much behavior, users may create wallets they do not
  fully understand.
- If trust and identity enrichment is handled poorly, it could create privacy
  concerns or false confidence.

## Open Questions And Unresolved Tradeoffs

1. How close should native and programmable module parity be in the core product
   story?
2. Which modules are truly first-class in the long-term product definition, and
   which should remain advanced?
3. How much policy detail should be visible by default versus revealed only when
   the user needs advanced control?
4. Should external modules be part of the core long-term story or remain a later
   extensibility layer?
5. Should XCM be a strong programmable-first module at first, or part of the
   default cross-rail story from the beginning?
6. When should proxy receive a dedicated creation flow beyond the default
   multisig-first native setup?
7. How far should ReviveSafe go in automatically guiding migration steps from a
   legacy native wallet to a programmable successor?
8. Which execution edge cases need special handling beyond the default execution
   model, such as executor restrictions, fee sponsorship, or auto-execution
   modules?
9. Should workspace roles exist separately from on-chain wallet members and
   delegates?
10. How much trust and identity enrichment should be built into the core product
    versus kept as an optional layer?

## Recommended Product Thesis

ReviveSafe should be the shared wallet product for Polkadot teams: one place to
manage shared wallets, proposals, approvals, and wallet behavior across both
native and programmable rails.

Its promise is not “we use PVM” or “we support precompiles.” Its promise is that
Polkadot teams can control shared assets and actions through one trusted,
understandable, and extensible approval experience.

Native is the simplest rail for shared control.
Programmable is the extensible rail for richer wallet behavior.
Templates make setup easy.
Modules make behavior understandable.
Policies make the wallet meaningful.
Lifecycle flows make the product durable over time.

If ReviveSafe gets this right, it becomes not just a better multisig interface,
but the long-term shared wallet and approvals layer for Polkadot teams.
