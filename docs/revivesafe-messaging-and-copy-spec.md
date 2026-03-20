# ReviveSafe Messaging And Copy Spec

Last updated: March 20, 2026

## Purpose

This document turns the ReviveSafe product definition into a messaging and copy
system that can guide:

- homepage copy
- dashboard and wallet labels
- create-wallet and import-wallet flows
- future design prompts and product writing

`revivesafe-product-spec-v2.md` is the source of truth.
`revivesafe-benchmark-and-reference-notes.md` informs positioning and benchmark
context.

## Source-Of-Truth Summary

- ReviveSafe is a unified shared wallet product for Polkadot teams.
- Its core promise is one approval and operations layer for shared wallet
  activity.
- The product should feel team-first and approval-centric, not tool-first or
  contract-first.
- ReviveSafe is one product with two rails: native is the simplest rail and
  programmable is the extensible rail.
- Native is a real long-term option for teams that want straightforward shared
  control with lower setup complexity.
- Programmable wallets matter only when they unlock visible value such as
  richer rules, delegation, batching, automation, or more flexible
  Polkadot-native actions.
- Proposal is the universal interaction model across transfers, contract calls,
  member changes, rules changes, and advanced actions.
- Inbox and notifications are part of the product core, not secondary polish.
- Importing existing native wallets is a first-class journey and should feel
  actionable from the first step.
- Moving from native to programmable is a guided upgrade to a successor wallet,
  not an in-place mutation.
- Templates make setup easy, modules make behavior understandable, and policies
  make wallet control meaningful.
- ReviveSafe should be broader than a treasury dashboard and more approachable
  than raw native tooling or contract-first products.

## 1. Product Positioning

### Positioning statement

ReviveSafe is the unified shared wallet product for Polkadot teams. It gives
teams one place to manage shared wallets, proposals, approvals, and wallet
behavior across both native and programmable wallets. The product should feel
clear and trustworthy like the best shared wallet platforms, while staying
Polkadot-native and understandable even for teams that do not want to think
about underlying chain mechanics.

### One-line product definition

ReviveSafe is the shared wallet for Polkadot teams: one place to create,
approve, execute, and track shared wallet activity across native and
programmable wallets.

### Messaging foundations

- The category is `shared wallet`, not `multisig UI`, `dashboard`, or `contract
  tool`.
- The primary job is `shared approvals and operations`, not `deploying wallet
  contracts`.
- The product story is `one product, two wallet types`, not `two separate
  systems`.
- `Native` should mean the simplest path to shared control.
- `Programmable` should mean more extensible wallet behavior when teams need it.
- Technical details such as Revive, PVM, precompiles, and account mapping
  should support the story, not define it.

## 2. Homepage Messaging Framework

### Hero headline options

Recommended lead:

- The shared wallet for Polkadot teams

Alternatives:

- One place to manage shared wallets on Polkadot
- Shared approvals and wallet operations for Polkadot teams
- Shared wallets built for Polkadot teams
- Manage team wallets with confidence on Polkadot
- One workspace for Polkadot shared wallets

### Subheadline options

- Create, approve, execute, and track shared wallet activity across native and
  programmable wallets in one product.
- Give your team one place for shared approvals, wallet operations, and clear
  proposal history across Polkadot.
- Start with the simplest native wallet flow, then move into more extensible
  wallet behavior when your team needs it.
- Import existing native wallets, coordinate approvals in one inbox, and grow
  into richer wallet controls without changing products.
- Built for teams managing shared funds, on-chain actions, and day-to-day
  wallet operations on Polkadot.

### Primary CTA options

- Create a wallet
- Create shared wallet
- Start with a shared wallet

### Secondary CTA options

- Import existing wallet
- See shared wallets in action
- Compare wallet types

### Proof and trust section ideas

Use proof rooted in product truth, not unsupported metrics or generic Web3
claims.

Claim themes:

- Native and programmable wallets in one product
- Import existing native wallets
- One proposal model across wallet actions
- Clear inbox for approvals and execution
- Activity history across every shared wallet
- Built for shared funds, shared operations, and on-chain actions
- Honest control model: simple when native is enough, extensible when more is
  needed

Allowed proof assets:

- Open-source product and contract repositories
- Audit status and audit links when available
- Clear explanation of what native and programmable each enforce
- Supported wallet patterns, such as multisig and proxy on native
- Import support for existing native wallets
- Proposal detail views that show approval status, execution responsibility, and
  outcome clearly
- Product screenshots that make inbox, proposals, and wallet visibility easy to
  understand

Proof placement guidance:

- Near the hero, use compact trust signals that support the main category claim.
- In the middle of the page, pair feature claims with product screenshots or
  concrete product behaviors.
- Lower on the page, include a short objection-handling section that answers the
  most likely adoption questions directly.

Objections the homepage should answer:

- Will this work for my team?
  ReviveSafe is built for teams that need shared control over funds, operations,
  and on-chain actions on Polkadot.
- Do I need programmable?
  No. Native is the simplest wallet type and a credible long-term option when
  standard shared approvals are enough.
- Can I import what I already use?
  Yes. Existing native wallets should be importable through a verified member
  flow.
- What happens if some wallet history cannot be recovered?
  The wallet should still be usable, with clear labels showing what is
  confirmed, what was reconstructed, and what still needs review.

### Feature section headlines

- One workspace for every shared wallet
- Approvals your team can actually follow
- Start simple with native wallets
- Add richer wallet controls when you need them
- Import the wallets your team already uses
- Clear visibility into proposals, members, and activity
- Shared wallet operations beyond a basic treasury flow

### How-it-works section copy

Option A:

1. Create or import a wallet
   Start with a new wallet or bring in an existing native wallet your team
   already uses.
2. Turn actions into proposals
   Transfers, contract calls, member changes, and advanced wallet actions all
   follow one clear proposal flow.
3. Approve and execute with confidence
   See who has approved, what happens next, and when a proposal is ready to
   execute.
4. Grow into richer control when needed
   Stay native when simple shared control is enough, or upgrade to a more
   extensible programmable wallet later.

Option B:

- Create or import your team wallet
- Review and approve every action in one place
- Execute with clear status and activity history
- Upgrade to richer controls when your team is ready

### Homepage messaging notes

- The first screen should define the category immediately: shared wallet for
  Polkadot teams.
- The second message should explain the product outcome: one place for
  approvals, operations, and wallet visibility.
- The third message should explain the product model: native for simplicity,
  programmable for extensibility.
- Technical supporting language can appear lower on the page, but it should
  never replace the shared wallet story.

## 3. Product Terminology Guide

### Preferred terms

| Term | Preferred use | Guidance |
| --- | --- | --- |
| Shared wallet | Primary category term | Use in homepage, navigation, onboarding, and product definition. |
| Workspace | The user’s shared-wallet environment | Use for the top-level environment that contains wallets, inbox, and activity. |
| Wallet | The main shared control object | Use as the primary object name everywhere. |
| Wallet type | Public-facing way to describe native vs programmable | Prefer this in onboarding copy; use `rail` only where comparison is needed. |
| Native | The simplest wallet type | Use when describing the fastest path to shared control. |
| Programmable | The extensible wallet type | Use when describing richer rules, modules, and advanced actions. |
| Proposal | The universal unit of work | Use for transfers, contract calls, member changes, rules changes, and advanced actions. |
| Approval | User-facing action term | Prefer `approve` over `sign` unless signature mechanics matter. |
| Execute | Final action after approvals are complete | Prefer over technical chain-specific submission language. |
| Members | The people or accounts involved in wallet control | Prefer over `signers` as the default group label. |
| Rules | Main UI term for wallet behavior | Prefer in navigation and most settings surfaces. |
| Policies | Advanced term for rule logic | Use in advanced settings, docs, and product strategy where precision matters. |
| Modules | Named wallet behavior packages | Keep user-facing, but always explain the behavior before the implementation. |
| Activity | Historical record | Use for the audit and history surface. |
| Inbox | Actionable updates and notifications | Use for the cross-wallet action center. |
| Import | Bringing an existing native wallet into ReviveSafe | Keep this as a first-class product verb. |
| Upgrade | Guided move from native to programmable | Use instead of technical migration language in primary UX copy. |

### Banned or avoid terms

- `hackathon`
- `demo`
- `prototype`
- `multisig dapp`
- `treasury dashboard` as the primary category
- `PVM wallet`
- `precompile wallet`
- `account abstraction` as a headline term
- `map_account` or `account mapping` in primary marketing or onboarding copy
- `raw extrinsics`, `call data`, or similar plumbing language before the user
  understands the action
- `deploy contract` as the top-level creation message
- `watch-only import` as a core product story

### Say this, not that

| Say this | Not that | Why |
| --- | --- | --- |
| Shared wallet | Multisig dapp | Defines a stronger product category. |
| One place for approvals | Extrinsic coordination layer | Leads with the job, not the mechanism. |
| Native wallet | Pallet multisig account | Keeps chain internals out of primary copy. |
| Programmable wallet | Revive contract wallet | Explains the user-facing value first. |
| Wallet type | Rail | More understandable in most UI contexts. |
| Members | Signers | Broader and more team-oriented. |
| Rules | Policy engine | Clearer in everyday product copy. |
| Approve | Sign | Better matches the user’s task in most flows. |
| Ready to execute | Threshold reached | Explains the next action directly. |
| Import your wallet | Reconstruct account state | Product-first and easier to understand. |
| Upgrade to a programmable wallet | Redeploy as a successor contract | Keeps technical implementation in the background. |
| Clear proposal summary | Human-readable transaction decoder | Focuses on the outcome the user cares about. |

### Term usage notes

- Use `native` and `programmable` as the visible choice labels.
- Use `wallet type` in create-wallet copy and comparison copy.
- Use `rail` in internal docs, advanced help, or side-by-side explanations where
  precision matters.
- Use `rules` by default in product UI.
- Use `policies` when the product is describing advanced rule behavior,
  enforcement depth, or wallet configuration logic.
- Use `members` as the default noun, `approvers` when the current proposal is
  the focus, and `signers` only when cryptographic signatures are the actual
  topic.

## 4. Core App UX Copy

### Top-level navigation

| Label | Purpose |
| --- | --- |
| Home | Overview of what needs attention across the workspace |
| Inbox | Actionable notifications and updates across wallets |
| Wallets | All shared wallets in the workspace |
| Proposals | Proposal queue across wallets |
| Activity | Historical record of wallet actions and changes |
| Settings | Workspace and account settings |

### Dashboard section labels

| Section label | Supporting meaning |
| --- | --- |
| Needs your approval | Proposals waiting on the current user |
| Ready to execute | Approved proposals that can be executed now |
| Inbox | Recent actionable updates across wallets |
| Your wallets | Wallets the user can view or act on |
| Recent activity | Latest executed actions and wallet changes |
| Quick actions | Create wallet, import wallet, start proposal |

Recommended quick action labels:

- Create wallet
- Import wallet
- New proposal

### Wallet page labels

#### Wallet-level navigation

- Overview
- Proposals
- Assets
- Members
- Modules
- Rules
- Activity
- Settings

#### Wallet header and summary labels

| Label | Example value or use |
| --- | --- |
| Wallet type | Native / Programmable |
| Control pattern | Multisig / Proxy / Contract wallet |
| Approval rule | 2 of 3 approvals |
| Members | 3 members |
| Status | Current / Legacy / Successor / In migration |
| Upgrade | Upgrade available |

#### Wallet section labels

- Pending proposals
- Assets and balances
- Members and roles
- Enabled modules
- Wallet rules
- Wallet activity
- Linked wallets

`Linked wallets` should be used only when upgrade relationships matter.

### Proposal states

| State | User-facing meaning |
| --- | --- |
| Draft | Not yet submitted for team approval |
| Submitted | Created and added to the proposal queue |
| Pending approval | Waiting for more approvals |
| Ready to execute | All required approvals are in place |
| Executed | Completed successfully |
| Failed | Execution did not succeed |
| Cancelled | Closed before execution |
| Expired | No longer executable |

Recommended proposal support labels:

- Proposed by
- Action summary
- Approval status
- Remaining approvals
- Ready for execution
- Execution account
- Execution result

### Notification categories

| Category | Purpose | Example notifications |
| --- | --- | --- |
| Needs action | What the user should do now | Approval requested, Ready to execute, Member onboarding needed, Migration step pending |
| Updates | What changed recently | Proposal executed, Proposal failed, Member changed, Rules updated, Module changed |
| Wallet lifecycle | Wallet setup and evolution | Wallet created, Wallet imported, Wallet partially reconstructed, Upgrade available |

Recommended individual notification labels:

- Approval requested
- Ready to execute
- Proposal executed
- Proposal failed
- Member changed
- Rules updated
- Modules updated
- Wallet imported
- Upgrade available

### Create wallet flow copy

#### Step 1: Choose wallet type

Screen title:

- Choose your wallet type

Helper copy:

- Start with the setup that fits your team today. You can expand later if your
  wallet needs more control.

Option labels:

- Native
  The simplest way to create a shared wallet on Polkadot.
- Programmable
  A more extensible wallet for teams that need richer rules and advanced
  actions.

#### Step 2: Choose a template

Screen title:

- Choose a starting template

Helper copy:

- Templates give your wallet a clear starting point. You can adjust modules and
  rules later.

Recommended template labels and descriptions:

- Team Wallet
  Shared approvals for everyday team operations.
- Treasury Wallet
  Shared control for reserves, treasury activity, and spending oversight.
- Operations Wallet
  Shared control for contract calls, recurring operations, and team workflows.
- Governance Wallet
  Shared control for governance and delegated actions.
- Cross-Chain Wallet
  Shared control for teams operating across chains.

#### Step 3: Add members

Screen title:

- Add wallet members

Helper copy:

- Add the people who will propose, approve, and manage activity for this
  wallet.

Field labels:

- Member address
- Role
- Add another member

#### Step 4: Set the approval rule

Screen title:

- Set the default approval rule

Helper copy:

- Choose how many approvals this wallet needs before an action can be executed.

Field labels:

- Required approvals
- Review advanced rules later

#### Step 5: Review setup

Screen title:

- Review your wallet setup

Helper copy:

- Confirm the wallet type, members, approval rule, and starting capabilities
  before you create the wallet.

Summary labels:

- Wallet type
- Template
- Members
- Approval rule
- Starting modules
- Starting rules

#### Final action labels

- Create wallet
- Create native wallet
- Create programmable wallet

Preferred rule:

- Use `Create wallet` as the default unified CTA.
- Use the type-specific variant only when the context needs extra clarity.

### Import wallet flow copy

#### Step 1: Connect a member account

Screen title:

- Connect a member account

Helper copy:

- Use an account that can act for this native wallet. ReviveSafe does not treat
  watch-only import as the core flow.

Primary action:

- Connect account

#### Step 2: Find the wallet

Screen title:

- Select the wallet to import

Helper copy:

- Choose the native wallet you want to bring into your workspace.

Primary action:

- Continue

#### Step 3: Verify access

Screen title:

- Verify your access

Helper copy:

- We verify that your connected account can act for this wallet before we
  import it.

Primary action:

- Verify access

#### Step 4: Review recovered details

Screen title:

- Review imported details

Helper copy:

- Review the members, approval rule, assets, and activity we could recover for
  this wallet.

Confidence messaging:

- Confirmed from chain data
- Reconstructed from available history
- Still needs review

Partial reconstruction banner:

- Some wallet details are still being reconstructed. You can keep using this
  wallet while we show what is confirmed and what still needs review.

#### Step 5: Import the wallet

Screen title:

- Import wallet

Helper copy:

- Bring this wallet into your workspace and continue with verified access.

Primary action:

- Import wallet

#### Step 6: Invite the rest of the team

Screen title:

- Invite wallet members

Helper copy:

- Other members will appear as detected until they connect their own accounts
  in ReviveSafe.

Primary action:

- Invite members

Recommended member state labels:

- Detected
- Invited
- Connected
- Active

### Native rail explanation

Short version:

- Native is the simplest wallet type for shared control on Polkadot.

Expanded version:

- Choose Native when your team wants the fastest path to a reliable shared
  wallet. Native wallets align with Polkadot’s built-in shared account patterns
  and keep setup simpler for teams that do not need advanced wallet behavior
  yet.

When to use this copy:

- wallet type selection
- homepage comparison section
- wallet details pages
- upgrade prompts from native wallets

### Programmable rail explanation

Short version:

- Programmable is the extensible wallet type for richer team control.

Expanded version:

- Choose Programmable when your team needs more flexible wallet behavior. It
  adds richer rules, modules, delegation, batching, automation, and more
  advanced wallet actions inside the same ReviveSafe product.

When to use this copy:

- wallet type selection
- upgrade messaging
- advanced feature explanations
- modules and rules onboarding

## 5. Voice And Tone Guide

### Core voice

- Clear
  Use short sentences, plain nouns, and direct verbs.
- Confident
  Define the category and the value without hedging or overexplaining.
- Calm
  Especially in approvals, execution, and failure states, the writing should
  feel steady and trustworthy.
- Honest
  Do not imply stronger enforcement, recovery, or automation than the wallet
  type actually provides.
- Team-first
  Focus on the people, approvals, and shared work rather than the underlying
  protocol plumbing.
- Product-first
  Explain what the wallet helps the user do before explaining how it works.

### Tone by context

| Context | Tone guidance |
| --- | --- |
| Homepage | Category-defining, simple, product-confident |
| Onboarding | Reassuring, guided, low-friction |
| Proposal review | Precise, explicit, calm |
| Settings | Clear, deliberate, not overloaded with jargon |
| Errors and failures | Specific, low-drama, next-step oriented |
| Advanced controls | Value first, mechanism second |

### Writing patterns to prefer

- Lead with the action, then the explanation.
- Use `you` and `your team` when the user is deciding or reviewing.
- Use `this wallet` when the current context matters more than the user.
- Keep state labels literal and scannable.
- Explain intent before technical payload.

### Writing patterns to avoid

- Do not open with chain internals.
- Do not describe the product like a hackathon build or infrastructure demo.
- Do not use hype-heavy Web3 language.
- Do not hide important constraints behind vague reassurance.
- Do not make advanced wallet behavior sound mandatory for every team.

### Example contrast

Prefer:

- Ready to execute
- Import your wallet
- Choose the wallet type that fits your team
- Review what this proposal will do

Avoid:

- Threshold reached
- Reconstruct multisig state
- Select execution rail
- Review raw transaction payload

## 6. Copy Principles

- Define the category immediately. ReviveSafe should sound like a real shared
  wallet product from the first line.
- Lead with the user’s task, not the protocol mechanism.
- Prefer fewer, stronger words over long explanatory copy.
- Keep labels stable across homepage, app UI, and future prompts.
- Use `native` to mean simplest and `programmable` to mean extensible every
  time.
- Treat technical language as supporting context, not primary messaging.
- Separate what needs action now from what happened over time.
- Make upgrade language feel like a guided next step, not a risky replacement.
- Be explicit about what is enforced, what is coordinated, and what still needs
  user review.

## 7. Empty And Failure State Microcopy

These examples should be treated as tone anchors for future UI writing. They
should stay short, specific, and next-step oriented.

### No wallets yet

Title:

- No wallets yet

Body:

- Create a shared wallet or import an existing one to get started.

Primary action:

- Create wallet

Secondary action:

- Import existing wallet

### No pending approvals

Title:

- No approvals waiting on you

Body:

- You are up to date. New approval requests will appear here.

### Import verification failed

Title:

- We could not verify your access

Body:

- This account cannot act for the selected wallet, or we could not confirm its
  authority yet.

Next-step actions:

- Try another account
- Select a different wallet

### Proposal execution failed

Title:

- Proposal execution failed

Body:

- The proposal was approved, but execution did not complete successfully. Review
  the result and try again when ready.

Next-step actions:

- View execution details
- Try again

### Partial reconstruction needs review

Title:

- Some wallet details still need review

Body:

- This wallet is usable now, but some history or configuration could not be
  fully recovered yet.

Supporting labels:

- Confirmed from chain data
- Reconstructed from available history
- Still needs review

### Upgrade not available yet

Title:

- Upgrade not available yet

Body:

- This wallet can continue using native shared control today. More extensible
  wallet options are not available for this wallet yet.

### Additional empty-state pattern

- When the user has completed a task, prefer calm confirmation over promotional
  copy.
- When the user is blocked, say what happened, what is still true, and what they
  can do next.

## 8. Homepage Content Blocks

The homepage should contain these content blocks in this order.

1. Hero
   Category statement, core headline, one-line product definition, and two
   clear CTAs.
2. Proof strip
   Short trust signals grounded in product truth, supported by concrete proof
   such as open source, supported wallet patterns, import support, and clear
   control explanations.
3. Workspace overview
   A simple product explanation showing that ReviveSafe brings wallets,
   proposals, inbox, and activity into one shared workspace.
4. Feature block: clear approvals
   Explain that every meaningful action becomes a proposal with visible status,
   approvers, and execution clarity.
5. Feature block: native for simplicity
   Explain the simplest path to shared control and why native is a credible
   long-term option.
6. Feature block: programmable for extensibility
   Explain when teams need richer rules, delegation, modules, batching, or
   advanced wallet behavior.
7. Feature block: import and upgrade
   Explain that teams can import existing native wallets now and upgrade to a
   programmable successor later when needed.
8. How it works
   Show the create or import, propose, approve, execute, and evolve loop in
   plain language.
9. Objection-handling section
   Answer the core adoption questions directly: whether it fits the team,
   whether native is enough, whether existing wallets can be imported, and what
   happens when some history needs review.
10. Trust and clarity section
   Reinforce honest controls, clear proposal summaries, visible wallet history,
   and team-first operations language.
11. Final CTA
   Close with a simple action pair such as `Create a wallet` and `Import a
   wallet`.

## 9. Final Guidance

ReviveSafe should sound like the product layer Polkadot teams have been missing:
clear, serious, and easy to understand. The headline story is shared wallets,
approvals, and team operations. Native and programmable are important, but they
should be explained as two wallet types inside one trusted product, not as two
separate narratives.
