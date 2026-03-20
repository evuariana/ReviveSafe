# ReviveSafe UI Structure and Gemini Prompt Pack

This document translates the approved ReviveSafe product and messaging strategy
into UI structure, page architecture, and prompt-ready design guidance. It is
derived from:

- `docs/revivesafe-product-spec-v2.md` as the product source of truth
- `docs/revivesafe-messaging-and-copy-spec.md` as the terminology and content
  source of truth
- `docs/revivesafe-benchmark-and-reference-notes.md` as benchmark context

It does not replace or rewrite those documents. It turns them into a practical
design brief for homepage and connected app UI work, including Gemini-ready
prompting.

## 1. Approved Product and Messaging Model

- ReviveSafe is the shared wallet product for Polkadot teams, not a multisig
  dapp, treasury dashboard, or contract deployment tool.
- The core promise is one approval and operations layer for shared wallet
  activity across Polkadot.
- The product is approval-centric and team-first. Users should understand what
  needs action, what will happen, who is involved, and what changed.
- ReviveSafe is one product with two wallet types: `Native` is the simplest
  wallet type, and `Programmable` is the extensible wallet type.
- Native is a credible long-term option for teams that want straightforward,
  reliable shared control with lower setup complexity.
- Programmable matters when teams need richer rules, delegation, batching,
  automation, or more advanced Polkadot-native actions.
- `Proposal` is the universal interaction model across transfers, member
  changes, contract calls, rules changes, and advanced actions.
- `Inbox` is the action center for what needs attention now, while `Activity`
  is the historical record of what happened over time.
- Importing existing native wallets is a first-class product journey and should
  feel actionable and trustworthy from the first step.
- Upgrading from native to programmable is a guided move to a successor wallet,
  not an in-place mutation of the same wallet.
- Templates make setup easy, modules make behavior understandable, and policies
  make wallet control meaningful.
- Wallet pages should feel like team control surfaces with members, approvals,
  proposals, balances, modules, rules, lifecycle, and activity visible.
- The homepage and app UI should use stable product language such as shared
  wallet, wallet type, members, approvals, rules, modules, proposals, inbox,
  import, and upgrade.
- PVM, Revive, precompiles, account mapping, raw extrinsics, and contract
  plumbing support the story but must not define the lead story.

## 2. Full Sitemap / Information Architecture

### Core Information Hierarchy

ReviveSafe UI should answer these questions in this order:

1. What needs my action now?
2. Which wallet is affected?
3. What exactly will this action do?
4. Who has already approved and who still needs to act?
5. What changed recently?
6. How is this wallet configured?
7. How can this wallet evolve over time?

### Product-Level Sitemap

| Surface | Purpose | Notes |
| --- | --- | --- |
| Homepage | Define the category, show the dashboard visually, explain native vs programmable, and drive create/import actions | This is the main public marketing surface |
| App Home | Workspace overview and work queue | Default signed-in landing page |
| Inbox | Cross-wallet notifications and actions | Separate from Activity |
| Wallets Index | All wallets in the workspace | Includes create and import entry points |
| Wallet Detail | Team control surface for one wallet | Includes Overview, Proposals, Assets, Members, Modules, Rules, Activity, Settings |
| Proposals Index | Cross-wallet proposal queue | Supports filtering by state, wallet, type, and module |
| Proposal Detail | Deep review, approval, and execution surface | Universal proposal model across both wallet types |
| Activity | Historical record across wallets | Included in sitemap because it is top-level in the product model |
| Create Wallet Flow | Guided creation for new wallets | Choose wallet type, template, members, approval rule, review |
| Import Wallet Flow | Guided import for native wallets | Verified signer flow with reconstruction confidence states |
| Settings | Workspace and account settings | Wallet-specific settings live inside wallet detail |

### Recommended Route Architecture

```text
/
  Homepage

/app
  /home
  /inbox
  /wallets
  /wallets/create
  /wallets/import
  /wallets/:walletId
    /overview
    /proposals
    /assets
    /members
    /modules
    /rules
    /activity
    /settings
  /proposals
  /proposals/:proposalId
  /activity
  /settings
```

### Global App Structure

| Layer | What it should contain |
| --- | --- |
| Left navigation | Home, Inbox, Wallets, Proposals, Activity, Settings |
| Global top bar | Workspace name, connected account, search or quick jump, primary action menu |
| Primary action entry points | Create wallet, Import wallet, New proposal |
| Global badges | Inbox count, proposal count, upgrade or migration notices where relevant |
| Context carry-through | Wallet name, wallet type, proposal state, member status, lifecycle status should stay visible as the user moves deeper |

## 3. Homepage Structure Spec

The homepage should follow the messaging spec order exactly, with the product
screenshot doing a large share of the explanatory work.

| Order | Section | Purpose | What it must communicate | UI elements |
| --- | --- | --- | --- | --- |
| 1 | Hero | Define the category immediately and establish confidence | ReviveSafe is the shared wallet for Polkadot teams, one place for shared approvals and wallet operations | Headline, subheadline, primary CTA `Create wallet`, secondary CTA `Import existing wallet`, compact trust chips, large dashboard screenshot |
| 2 | Proof strip | Add trust without hype | Native and programmable in one product, import support, proposal clarity, open-source and honest control model | Small proof chips, short proof statements, optional repo or audit links when available |
| 3 | Workspace overview | Explain the product model at a glance | Wallets, inbox, proposals, and activity live in one workspace | Simple four-part layout or annotated mini-dashboard showing Wallets, Inbox, Proposals, Activity |
| 4 | Feature block: clear approvals | Show the universal proposal model | Every meaningful action becomes a proposal with visible state, approvers, and execution clarity | Proposal list mockup, detail drawer, approval progress, execution responsibility callout |
| 5 | Feature block: native for simplicity | Reassure users that native is a strong default, not a downgrade | Native is the simplest wallet type and a valid long-term choice | Native wallet card, multisig or proxy pattern label, approval rule summary, low-friction setup framing |
| 6 | Feature block: programmable for extensibility | Show why programmable exists | Programmable unlocks richer rules, modules, delegation, batching, automation, and advanced actions when needed | Programmable wallet card, modules panel, rules panel, controlled capability grid |
| 7 | Feature block: import and upgrade | Prove continuity | Teams can import native wallets now and upgrade to a programmable successor later without changing products | Import flow strip, reconstruction confidence labels, linked legacy and successor wallet cards, upgrade callout |
| 8 | How it works | Reduce adoption friction | Create or import, turn actions into proposals, approve, execute, and evolve over time | 4-step or 5-step visual flow with simple verbs and short copy |
| 9 | Objection-handling | Answer adoption questions directly | It fits real teams, native may be enough, import is supported, partial reconstruction is handled honestly | FAQ-style cards or side-by-side Q and A blocks |
| 10 | Trust and clarity | Reinforce operational confidence | Clear proposal summaries, visible history, honest enforcement language, team-first operations | Activity timeline, settings or rules snapshot, compact trust narrative, open-source and control explanation |
| 11 | Final CTA | Close with action and momentum | Start with a new wallet or bring an existing one in | Large closing statement with `Create a wallet` and `Import a wallet` actions |

### Hero Screenshot Requirements

The hero screenshot should do five jobs at once:

1. Show that ReviveSafe is a real product, not an abstract concept.
2. Show that the product centers on actionable approvals, not only balances.
3. Show multiple shared wallets inside one workspace.
4. Show both `Native` and `Programmable` as visible wallet types.
5. Show enough proposal detail to make the system understandable at a glance.

The hero should use a dashboard composition, not an illustration. The default
visual should be a connected workspace home screen, optionally with a proposal
detail overlay layered above it.

## 4. Connected App Structure Spec

Activity remains a top-level sibling to Inbox in the product model, but the
page-by-page guidance below focuses on the requested core surfaces.

### Home Dashboard

**Purpose**

The Home dashboard is the workspace control surface. It should answer what
needs action, what changed, which wallets matter, and what the user can do
next.

**Section order**

1. Workspace header with quick actions
2. Attention summary strip
3. Needs your approval
4. Ready to execute
5. Inbox preview
6. Your wallets
7. Recent activity
8. Lifecycle and onboarding callouts

**What it must prioritize**

- Action queues before balances
- Cross-wallet context before deep wallet configuration
- Clear separation between action now and history
- Real team workflows, not KPI theater

**Required UI elements**

- Page title and short supporting line
- Primary actions: `Create wallet`, `Import wallet`, `New proposal`
- Summary cards for `Needs your approval`, `Ready to execute`, `Active wallets`,
  and `Wallet notices`
- Proposal rows with wallet name, wallet type, status, approvals progress,
  action summary, and CTA
- Wallet cards or rows showing wallet type, pattern, approval rule, members,
  balance, pending proposals, lifecycle, and linked wallet state where relevant
- Inbox preview with notification category badges
- Recent activity feed with calm, literal labels

**UX guidance**

- The default dashboard should feel like an operations queue, not a treasury
  analytics page.
- Use compact but readable density. Safe and Squads both feel product-grade
  because they show meaningful work, not empty whitespace.
- If the user has no wallets, the page should pivot into a two-CTA empty state:
  `Create wallet` and `Import existing wallet`.

### Inbox

**Purpose**

Inbox is the cross-wallet action center. It is where the user decides what
needs attention now.

**Section order**

1. Header with filter controls
2. Default `Needs action` feed
3. `Updates` feed
4. `Wallet lifecycle` feed
5. Notification preferences entry point

**What each item should show**

- Category label
- Notification title
- Wallet name
- Proposal name or lifecycle event
- Short explanatory sentence
- Current state
- Timestamp
- One clear CTA

**Required filters**

- Category
- Wallet
- Wallet type
- Proposal state
- Unread or all

**UX guidance**

- `Needs action` should be the default tab or filter state.
- Distinguish informational updates from required user actions visually.
- Avoid chat-like presentation. This is an operations inbox, not a social feed.
- Notification items should deep-link into the relevant proposal or wallet
  surface.

### Wallets Index

**Purpose**

Wallets Index is the directory of all shared wallets in the workspace.

**Section order**

1. Page header with create and import actions
2. Search and filters
3. Wallet list
4. Empty, loading, and migration states

**Recommended columns or card metadata**

- Wallet name
- Wallet type
- Control pattern
- Approval rule
- Members
- Pending proposals
- Balance or key assets
- Lifecycle status
- Last activity

**Required filters**

- Native or Programmable
- Multisig, Proxy, or Contract wallet
- Current, Imported, Legacy, Successor, In migration
- Wallets with approvals waiting

**UX guidance**

- Use a table by default for larger workspaces, with optional card layout for
  smaller or empty states.
- Keep `Create wallet` and `Import wallet` permanently visible.
- Imported wallets should not look secondary. Their confidence and onboarding
  state should be visible, but the wallet still belongs in the main list.

### Wallet Detail

**Purpose**

Wallet Detail is the main control surface for one wallet. It should feel like
the operational home for that team wallet, not like a chain explorer page.

**Page frame**

1. Wallet header
2. Wallet summary strip
3. Primary tabs
4. Tab content area

**Wallet header**

The header should keep the most important context visible:

- Wallet name
- Wallet type
- Control pattern
- Approval rule
- Members count
- Lifecycle status
- Upgrade availability when relevant
- Primary actions such as `New proposal`, `Manage members`, or `Review rules`

**Primary tabs**

- Overview
- Proposals
- Assets
- Members
- Modules
- Rules
- Activity
- Settings

**Overview tab**

This is the default wallet landing view. It should include:

- Pending proposals
- Assets and balances
- Members and roles summary
- Enabled modules
- Wallet rules summary
- Wallet activity preview
- Linked wallets when upgrade relationships matter

**Proposals tab**

Use this tab for wallet-scoped proposal queue management. Show:

- Proposal table
- State filters
- Module or action type filters
- Quick sort for newest, ready to execute, and failed

**Assets tab**

Keep this practical, not exchange-like. Show:

- Total balance or key asset summary
- Asset list
- Recent asset-affecting proposals
- Asset-specific transfer entry point where supported

**Members tab**

Show:

- Members list
- Roles or participation labels
- Connection status for imported wallets
- Invite states: Detected, Invited, Connected, Active
- Add or update member actions where supported

**Modules tab**

Show:

- Enabled modules first
- Available modules second
- Plain-language module purpose
- Supported wallet type
- Rule impact or approval override summary
- Upgrade prompts for programmable-only modules on native wallets

**Rules tab**

Show:

- Default approval rule
- Module-level overrides
- Member or delegate restrictions
- Execution responsibility rules
- Enforcement depth where important

**Activity tab**

Show wallet-scoped history only:

- Executed proposals
- Failed proposals
- Member changes
- Rules changes
- Module changes
- Wallet lifecycle milestones

**Settings tab**

Keep settings consistent across wallet types but honest about differences:

- Overview
- Members
- Approvals and rules
- Modules
- Notifications
- Activity and audit history
- Advanced settings

**UX guidance**

- Native wallets should visibly show some advanced controls as available with a
  programmable upgrade instead of hiding them completely.
- Programmable wallets should feel more extensible, but not like a developer
  console.
- Keep proposal and wallet context pinned while the user navigates deeper.

### Proposals Index

**Purpose**

Proposals Index is the shared queue across all wallets.

**Section order**

1. Header with create proposal action
2. State tabs or filters
3. Main proposals table
4. Bulk review or saved views area if the workspace warrants it

**Recommended columns**

- Proposal title
- Wallet
- Wallet type
- Action summary
- Module
- State
- Approval progress
- Proposer
- Last updated

**Required states**

- Draft
- Submitted
- Pending approval
- Ready to execute
- Executed
- Failed
- Cancelled
- Expired

**UX guidance**

- Make `Pending approval` and `Ready to execute` the most visually prominent
  filters.
- Show the wallet next to every proposal. Cross-wallet clarity matters.
- Avoid exposing raw payload columns by default. Those belong behind a detail
  reveal.

### Proposal Detail

**Purpose**

Proposal Detail is the most important decision surface in the product. It
should explain intent before payload and state before mechanics.

**Section order**

1. Header with state and wallet context
2. Action summary
3. Approval status
4. Execution details
5. Underlying technical details
6. Activity timeline or result log

**Header**

The header should show:

- Proposal title
- Wallet name
- Wallet type
- State chip
- Module
- Proposer
- Timestamps

**Main content**

Show the action in plain English first:

- What this proposal will do
- Amounts, destinations, or member changes
- What changes on execution
- What rules apply

**Approval section**

Show:

- Approvals received
- Remaining approvals
- Approver list with status
- Who can approve
- Who can execute once ready

**Execution section**

Show:

- Execution readiness
- Execution account
- Fee payer expectation
- Manual or automatic execution behavior
- Result or failure reason

**Technical reveal**

Keep advanced details collapsible:

- Raw calldata or extrinsic details
- Contract or backend details
- Diagnostics where useful

**UX guidance**

- State changes should feel calm and precise.
- `Ready to execute` should look like the next clear step, not just another
  badge.
- Failed execution should preserve trust by showing what is still true and what
  the user can do next.

### Create Wallet Flow

**Purpose**

Create Wallet is a guided, confidence-building setup flow that keeps wallet
type choice understandable.

**Recommended steps**

1. Choose wallet type
2. Choose template
3. Add wallet identity and members
4. Set the default approval rule
5. Review setup
6. Create wallet

**Step guidance**

**Step 1: Choose wallet type**

- Present `Native` and `Programmable` as two clear cards
- Native card should read as the simplest path to shared control
- Programmable card should read as the extensible path for richer behavior
- Use short value-based comparison, not backend architecture language

**Step 2: Choose template**

- Show Team Wallet, Treasury Wallet, Operations Wallet, Governance Wallet, and
  Cross-Chain Wallet as starting presets
- Emphasize that templates are a starting point, not a permanent identity

**Step 3: Add wallet identity and members**

- Capture wallet name clearly
- Add members, roles, and addresses
- Explain that members propose, approve, and manage activity for the wallet

**Step 4: Set the default approval rule**

- Show the default approval threshold first
- Keep advanced rules secondary
- Explain that more advanced rule logic can be reviewed later

**Step 5: Review setup**

- Summarize wallet type, template, members, approval rule, starting modules,
  and starting rules
- Keep the CTA unified as `Create wallet`

**UX guidance**

- Keep the flow narrow and guided rather than turning it into a giant settings
  form.
- For programmable creation, show the value of richer control without making it
  feel mandatory for every team.
- For native creation, reassure users that this is a strong default, not a
  temporary starter mode.

### Import Wallet Flow

**Purpose**

Import Wallet brings an existing native wallet into ReviveSafe through an
actionable, verified signer flow.

**Recommended steps**

1. Connect a member account
2. Select the wallet to import
3. Verify access
4. Review imported details
5. Import wallet
6. Invite wallet members

**Step guidance**

**Step 1: Connect a member account**

- Lead with connected authority, not watch-only viewing
- Make it clear that ReviveSafe is verifying actionable access

**Step 2: Select the wallet to import**

- Show detectable native wallets
- Display enough metadata to avoid confusion before import

**Step 3: Verify access**

- Confirm membership or delegation authority
- Explain what is being checked in plain language

**Step 4: Review imported details**

- Separate `Confirmed from chain data`, `Reconstructed from available history`,
  and `Still needs review`
- Show members, approval rule, balances, and recoverable history
- Keep a persistent partial reconstruction banner if needed

**Step 5: Import wallet**

- Confirm the wallet enters the workspace as a first-class wallet
- Make the importing signer active immediately once verified

**Step 6: Invite wallet members**

- Show detected members and their states
- Use member state labels: Detected, Invited, Connected, Active

**UX guidance**

- This flow should feel trustworthy and operational, not forensic.
- Imported wallets should remain usable even when some history needs review.
- After completion, route the user into the wallet detail page with a clear
  import status banner and team onboarding callout.

### Settings

**Purpose**

Top-level Settings handles workspace and account preferences. It should not
duplicate wallet-specific rule and module settings.

**Recommended sections**

1. Connected accounts
2. Notification preferences
3. Workspace preferences
4. Support and advanced diagnostics

**Connected accounts**

Show:

- Linked signer accounts
- Primary account state
- Connection health or re-auth entry point

**Notification preferences**

Show:

- Inbox preferences
- Future channel preferences such as email, browser, Telegram, Discord, or
  push when available
- Calm explanation that channels extend one shared notification model

**Workspace preferences**

Show:

- Workspace display preferences
- Default landing page choice if useful
- Team-level presentation preferences only if they truly exist in product scope

**Support and advanced diagnostics**

Use this area for:

- Import diagnostics
- Mapping or activation diagnostics if needed for programmable setup
- Advanced details that should stay out of core workflow screens

**UX guidance**

- Keep Settings quiet, literal, and low-drama.
- Do not move wallet behavior controls out of wallet detail just to fill this
  page.
- If workspace roles are not yet part of the real product model, do not invent
  them here.

## 5. Component-Level Guidance

| Component | Guidance |
| --- | --- |
| Cards | Use cards for high-signal summaries such as wallet overviews, queue summaries, module summaries, and lifecycle notices. Each card should have one clear job, one primary action, and 2 to 5 meaningful data points. Avoid decorative cards that only restate numbers without context. |
| Tables and lists | Use tables or dense lists for Wallets, Proposals, Inbox, and Activity. Default columns should answer wallet, action, state, approvals, and timing quickly. Prioritize scanability, row actions, and filters over wide technical metadata. |
| Navigation | Use a durable left rail for workspace navigation and a second level of wallet tabs inside wallet detail. Keep labels exactly aligned with the messaging spec: Home, Inbox, Wallets, Proposals, Activity, Settings. Avoid clever renaming. |
| Wallet status chips | Separate chip roles clearly: wallet type chips for `Native` or `Programmable`, pattern chips for `Multisig`, `Proxy`, or `Contract wallet`, lifecycle chips for `Current`, `Imported`, `Legacy`, `Successor`, or `In migration`, and confidence chips for `Confirmed`, `Reconstructed`, or `Needs review`. Do not compress all meaning into one overloaded badge. |
| Proposal state UI | Proposal state should combine a strong literal label with lightweight progress context. `Pending approval` should show remaining approvals. `Ready to execute` should show who can execute. `Executed`, `Failed`, `Cancelled`, and `Expired` should read as final states. Use calm color coding and avoid celebratory or alarming effects. |
| Notification patterns | Every notification should carry wallet context, proposal or lifecycle context, status, timestamp, and one clear CTA. Separate `Needs action` from `Updates` and `Wallet lifecycle` visually and structurally. Toasts can confirm actions, but Inbox is the durable source of truth. |
| Module and rules surfaces | Modules should be presented as capability packages in plain English, not as plugin internals. Rules should explain default approval behavior, action-specific overrides, member restrictions, and execution responsibility. On native wallets, programmable-only modules should appear as visible upgrade opportunities rather than disappearing. |

## 6. Visual Direction

### How ReviveSafe Should Borrow from Safe

- Define the category immediately and with confidence.
- Use the product screenshot as a major explanatory device, not a supporting
  decoration.
- Present modularity and extensibility as product capability, not developer
  plumbing.
- Use a trustworthy visual hierarchy with disciplined spacing, clear density,
  and strong status treatment.

### How ReviveSafe Should Borrow from Squads

- Lead with workflows and operational clarity rather than architecture.
- Make the dashboard feel like a shared team workspace, not a single-wallet
  utility.
- Use practical permissions and spending-control language.
- Show multiple accounts or wallets under one workspace identity.

### What It Should Avoid

- Generic admin dashboard aesthetics
- Hackathon-app polish or crypto toy styling
- Raw extrinsics or developer-console presentation
- Treasury-only storytelling
- Ethereum-first or Solana-first visual assumptions
- Neon cyberpunk, glass-heavy Web3 cliches, or purple-led branding as the
  default
- Giant charts as the lead visual when the real product strength is approvals,
  queues, and shared control

### Typography Direction

- Use a sharp, product-grade grotesk or neo-grotesk sans with a serious,
  operational tone.
- Headlines should feel confident and slightly compressed, not playful or
  futuristic.
- Body copy should be crisp, highly legible, and comfortable at dense UI sizes.
- A useful reference direction is the feel of Soehne, General Sans, or a similar
  neutral grotesk rather than default system UI stacks.

### Icon Direction

- Use clean, geometric, mostly outlined icons with consistent stroke weight.
- Icons should support navigation and status, not become illustrations.
- Favor wallet, member, shield, check, rules, module, activity, and arrow
  metaphors over token-logo clutter.
- Avoid novelty crypto iconography as the main storytelling device.

### Screenshot and Storytelling Direction

- The homepage screenshot should show a real work queue, not an empty shell.
- Use visible proposal states, member avatars, wallet type chips, and activity
  items to explain the product in one glance.
- Show more than one wallet in the workspace so the unified-product story is
  obvious.
- Consider one layered overlay panel, such as proposal detail on top of the
  dashboard, to reinforce the approval model.
- Keep technical detail hidden unless it helps explain execution or trust.

## 7. Homepage Screenshot Brief for Gemini

### Exact Composition

Create a polished desktop product screenshot based on the ReviveSafe Home
dashboard. The composition should include:

1. A visible left sidebar with Home, Inbox, Wallets, Proposals, Activity, and
   Settings
2. A top bar with the workspace name, connected user, and a `Create wallet`
   action
3. A main content area dominated by approval and execution queues
4. A `Your wallets` section showing at least one Native wallet and one
   Programmable wallet
5. A small proposal detail overlay or side panel showing the plain-English
   action summary and approval status

### Example Data to Show

Use concrete, believable sample data such as:

- Workspace: `Acala Ops`
- Summary strip:
  - `Needs your approval: 4`
  - `Ready to execute: 2`
  - `Active wallets: 3`
  - `Wallet notices: 2`
- Wallets:
  - `Treasury Wallet` | `Native` | `Multisig` | `2 of 3 approvals` | `3 members` | `328,000 DOT`
  - `Ops Wallet` | `Programmable` | `Contract wallet` | `3 of 5 approvals` | `5 members` | `48,000 USDC + 9,400 DOT`
  - `Grants Wallet` | `Native` | `Proxy` | `2 delegates` | `Upgrade available`
- Needs your approval:
  - `Treasury payout to validator ops`
  - `Add release delegate`
  - `XCM transfer to Asset Hub`
- Ready to execute:
  - `USDC vendor settlement`
  - `Enable spending controls`
- Inbox preview:
  - `Approval requested`
  - `Proposal executed`
  - `Wallet imported`
  - `Upgrade available`

### What the Proposal Overlay Should Show

Use one clear proposal detail panel such as:

- Title: `Treasury payout to validator ops`
- Wallet: `Treasury Wallet`
- State: `Pending approval`
- Action summary: `Send 12,500 DOT to Validator Ops Reserve`
- Approval status: `2 of 3 approvals`
- Remaining approver: `Lina`
- Who can execute: `Any active member`
- Fees paid by: `Executor`

### What Should Be Visible at a Glance

- This is a shared wallet workspace for a team, not a personal wallet
- Approvals are the center of the product
- Multiple shared wallets live in one place
- Native and Programmable both exist inside the same product
- Proposal status and execution readiness are easy to understand
- The UI feels product-grade, calm, and operational

### What Should Not Appear

- Raw calldata or extrinsic payloads as the main visible layer
- PVM, Revive, precompiles, or account mapping as hero labels
- Token-price charts or trading-style widgets
- Generic crypto illustration tropes

## 8. Gemini Prompt Pack

### Prompt 1: Homepage Redesign

```text
Design a high-fidelity homepage for ReviveSafe, a unified shared wallet product for Polkadot teams. Produce both desktop and mobile-responsive concepts, and make sure the system supports both light mode and dark mode without losing clarity or hierarchy.

Core product truth:
- ReviveSafe is the shared wallet for Polkadot teams
- It gives teams one place to create, approve, execute, and track shared wallet activity
- It is one product with two wallet types: Native is the simplest wallet type, Programmable is the extensible wallet type
- Proposal is the universal model across transfers, member changes, rules changes, contract calls, and advanced wallet actions
- Importing existing native wallets is first-class
- Upgrading from native to programmable is a guided successor flow, not an in-place mutation

Use this homepage section order exactly:
1. Hero
2. Proof strip
3. Workspace overview
4. Feature block: clear approvals
5. Feature block: native for simplicity
6. Feature block: programmable for extensibility
7. Feature block: import and upgrade
8. How it works
9. Objection-handling
10. Trust and clarity
11. Final CTA

Homepage messaging direction:
- Lead headline: "The shared wallet for Polkadot teams"
- Supporting message: one place for shared approvals, wallet operations, and clear proposal history across native and programmable wallets
- Primary CTA: "Create wallet"
- Secondary CTA: "Import existing wallet"

Visual direction:
- Borrow the confidence and screenshot-led storytelling of Safe
- Borrow the operational clarity and team workspace feel of Squads
- Make it feel product-grade, trustworthy, and operational
- Avoid hackathon app styling, treasury-only storytelling, Ethereum-first framing, and raw developer-console UI
- Do not make PVM, Revive, precompiles, account mapping, or raw extrinsics the lead story
- Use a sharp, product-grade grotesk or neo-grotesk sans with a serious, operational tone rather than generic SaaS defaults like Inter, Roboto, Arial, or a plain system stack
- Make headlines feel confident and slightly compressed, with crisp body copy that still reads well in dense UI contexts
- Use clean, geometric, mostly outlined icons with consistent stroke weight across navigation, status, and actions
- Avoid inconsistent icon packs, novelty crypto iconography, or illustration-style icons

Hero visual requirements:
- Use a strong dashboard screenshot composition as the centerpiece
- Show a real shared-wallet workspace with action queues, wallet cards, and proposal status
- Show both Native and Programmable wallet types in the same product
- Show enough proposal detail to understand approvals and execution at a glance

Content emphasis:
- Define the category immediately
- Explain the outcome before the mechanism
- Make native feel like a strong default, not a lesser option
- Make programmable feel valuable when teams need richer rules, delegation, batching, automation, or advanced actions
- Show import continuity and upgrade path clearly
- Ensure the homepage works as a responsive system, not just a desktop hero composition
- Preserve equivalent hierarchy and readability in both light and dark mode

Deliver a polished homepage concept that feels like a serious SaaS product for team operations on Polkadot.
```

### Prompt 2: Connected Dashboard Redesign

```text
Design a high-fidelity connected dashboard for ReviveSafe, the shared wallet product for Polkadot teams. Produce both desktop and mobile-responsive concepts, and make sure the UI works in both light mode and dark mode.

This screen is the signed-in workspace Home dashboard. It should feel like a real work queue and shared-wallet control surface, not a treasury analytics board.

Design goals:
- Answer what needs my action now
- Show what is ready to execute
- Show which wallets I control
- Show what changed recently
- Keep proposals and approvals more important than balances

Use this structure:
1. Workspace header with quick actions
2. Summary strip for Needs your approval, Ready to execute, Active wallets, Wallet notices
3. Needs your approval queue
4. Ready to execute queue
5. Inbox preview
6. Your wallets
7. Recent activity
8. Lifecycle or onboarding notices

Required product constraints:
- Use the exact top navigation labels: Home, Inbox, Wallets, Proposals, Activity, Settings
- Show multiple shared wallets in one workspace
- Show at least one Native wallet and one Programmable wallet
- Show proposal rows with wallet name, state, approval progress, and action summary
- Keep Inbox separate from Activity
- Use product language like shared wallet, members, approvals, execute, modules, rules, import, and upgrade
- Do not expose raw payloads by default

Use realistic sample content such as:
- Workspace: Acala Ops
- Native wallet: Treasury Wallet, Multisig, 2 of 3 approvals
- Programmable wallet: Ops Wallet, Contract wallet, 3 of 5 approvals
- Proposal examples: Treasury payout to validator ops, Add release delegate, XCM transfer to Asset Hub
- Notification examples: Approval requested, Proposal executed, Wallet imported, Upgrade available

Visual direction:
- Safe-like confidence and polish
- Squads-like workflow clarity
- Calm, serious, operational
- No hackathon visuals, no blockchain explorer feel, no giant charts as the main story
- Use a sharp, product-grade grotesk or neo-grotesk sans with a serious, operational tone rather than generic SaaS defaults
- Make headings compact and confident, with body text that stays legible in dense data views
- Use clean, geometric, mostly outlined icons with one consistent stroke weight for navigation, status, and proposal actions
- Avoid mixed icon styles, novelty crypto symbols, or overly decorative iconography
- Keep the layout responsive so the work queue still feels structured on mobile
- Preserve hierarchy, state clarity, and contrast in both light and dark mode

Create a dashboard that instantly communicates team coordination, proposal clarity, and multi-wallet control.
```

### Prompt 3: Wallet Detail Redesign

```text
Design a high-fidelity wallet detail page for ReviveSafe. Produce both desktop and mobile-responsive concepts, and make sure the design system supports both light mode and dark mode.

The page should feel like the operational home for one shared wallet, not a chain explorer or extrinsics panel.

Use a Native wallet example as the primary concept so the design can show both strong native support and visible upgrade paths to programmable capabilities.

Wallet example:
- Wallet name: Treasury Wallet
- Wallet type: Native
- Control pattern: Multisig
- Approval rule: 2 of 3 approvals
- Members: 3
- Lifecycle: Current
- Upgrade state: Upgrade available

Required page structure:
1. Wallet header
2. Summary strip with wallet type, control pattern, approval rule, members, lifecycle, and upgrade availability
3. Wallet tabs: Overview, Proposals, Assets, Members, Modules, Rules, Activity, Settings
4. Overview tab content with pending proposals, assets and balances, members and roles summary, enabled modules, wallet rules summary, activity preview, and linked wallets if upgrade context matters

Critical product behavior to show:
- Native is a credible long-term option
- Some advanced controls should appear as visible upgrade opportunities instead of being hidden
- Modules should be explained in plain language
- Rules should explain default approval behavior and any stricter controls
- Proposal context should remain easy to reach from the wallet

Include examples of programmable-only upgrade prompts such as:
- Advanced spending controls
- Richer delegation
- Batch actions
- Automation

Visual direction:
- Product-grade and serious
- Calm status treatment
- Operational density similar to Safe and Squads
- No raw calldata as a default visible section
- No dev-tool framing, no contract deployment language in the main UI
- Use a sharp, product-grade grotesk or neo-grotesk sans with a serious, operational tone rather than default SaaS fonts
- Keep headings confident and slightly compressed, with highly legible body copy for dense wallet data
- Use clean, geometric, mostly outlined icons with consistent stroke weight across tabs, status chips, and actions
- Avoid mixed icon sets, decorative crypto iconography, or illustration-style UI chrome
- Ensure the layout remains readable and actionable on mobile
- Preserve the same clarity and hierarchy in both light and dark mode

Create a design that makes wallet structure, member coordination, and future extensibility feel clear and trustworthy.
```

### Prompt 4: Polished Product Screenshot / Hero Visual

```text
Create a polished product screenshot or hero visual for ReviveSafe that can anchor a homepage hero section.

This is not an illustration. It should look like a real, high-end SaaS product screenshot for a shared wallet platform used by Polkadot teams.

Composition requirements:
- Main layer: ReviveSafe Home dashboard
- Optional secondary layer: proposal detail panel overlay
- Visible left navigation with Home, Inbox, Wallets, Proposals, Activity, Settings
- Visible top bar with workspace name and primary action
- Main content focused on approvals, execution readiness, inbox items, and wallet cards

Must visibly show:
- At least one Native wallet and one Programmable wallet
- A proposal queue with clear states
- Approval progress
- A ready-to-execute surface
- Member or approver context
- An Inbox preview with actionable notifications

Use sample content such as:
- Workspace: Acala Ops
- Treasury Wallet, Native, Multisig, 2 of 3 approvals
- Ops Wallet, Programmable, Contract wallet, 3 of 5 approvals
- Proposal: Treasury payout to validator ops
- Proposal detail: Send 12,500 DOT to Validator Ops Reserve, 2 of 3 approvals, Any active member can execute

Visual direction:
- Trustworthy, crisp, slightly editorial, product-grade
- Borrow Safe's screenshot confidence and Squads' workflow clarity
- Use a neutral, serious palette with one restrained accent
- Show real density and information hierarchy
- Use a sharp, product-grade grotesk or neo-grotesk sans with a serious operational tone, not a default SaaS system font
- Use clean, geometric, mostly outlined icons with consistent stroke weight and avoid mixed icon styles
- Favor a hero composition rendered in light mode unless a darker treatment materially improves clarity

Avoid:
- Empty placeholder widgets
- Token trading charts
- Blockchain explorer tables
- Generic crypto art
- PVM, Revive, precompiles, account mapping, raw extrinsics, or technical setup labels in the visible hero

The final image should instantly communicate: shared wallets, team approvals, multiple wallet types, and operational clarity.
```

## 9. Design Guardrails

### What Must Stay Consistent with the Spec

- ReviveSafe is a unified shared wallet product for Polkadot teams.
- `Native` is the simplest wallet type.
- `Programmable` is the extensible wallet type.
- Proposal is the universal interaction model.
- Inbox and notifications are core to the product, not secondary polish.
- Inbox is for what needs attention now. Activity is for what happened over
  time.
- Native wallet import is first-class and based on verified, actionable signer
  access.
- Native-to-programmable upgrade is a guided successor flow, not an in-place
  mutation.
- Templates, modules, and policies should remain legible as the core
  configuration model.
- Wallet pages must feel like team control surfaces, not just address records
  or balance views.

### What Gemini Should Not Invent

- Additional wallet categories beyond Native and Programmable
- A headline product story about PVM, Revive, precompiles, or account mapping
- Watch-only import as the main import flow
- An in-place native-to-programmable conversion
- Unsupported claims about automation, audits, or enforcement strength
- Treasury-only or trading-style dashboard patterns
- A generic multichain story before Polkadot-native clarity is established
- Developer-console screens masquerading as primary product UI
- Workspace role systems or banking features that are not in the approved model

### What Technical Details Should Stay Out of the Headline UI

- Raw extrinsics
- Raw calldata
- Contract deployment mechanics
- `map_account` and account mapping
- Activation steps except where needed during setup or diagnostics
- Precompile names or backend execution labels
- Low-level fee plumbing except where execution responsibility must be explicit

These details can appear in advanced drawers, diagnostics, or technical reveal
sections where they improve understanding, but they should never become the
main headline story on the homepage or primary dashboard surfaces.
