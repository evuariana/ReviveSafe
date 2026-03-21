# ReviveSafe Frontend Review Requests

Updated: March 22, 2026

## Purpose

This file is the review queue for frontend-facing changes that should be
approved by the team before implementation on user-facing surfaces, especially
the homepage and public product copy.

## Review Rule

- Homepage, landing-page, and public marketing/copy changes should be reviewed
  before implementation.
- App-surface hardening for real testnet functionality may still be necessary
  for QA/demo readiness, but should also be documented here when it affects
  frontend behavior.

## Reverted Homepage Proposals

These were reverted and are not currently applied in the codebase.

### 1. Add a truthful scope callout to the homepage hero

Why:

- The current product docs describe a broader native + programmable product
  than the app actually implements today.
- A scope disclosure would reduce demo risk and avoid overselling native import
  or proxy support.

Proposed areas:

- `frontend/src/components/landing/hero-section.tsx`

### 2. Change homepage CTA copy from `Import existing wallet` to a narrower contract-wallet label

Why:

- The current live import path is for existing contract wallets, not the full
  native wallet import story promised in product docs.

Proposed areas:

- `frontend/src/components/landing/cta-buttons.tsx`

### 3. Update homepage FAQ and import messaging to reflect current implementation truthfully

Why:

- The homepage currently describes native multisig/proxy import more strongly
  than the app currently supports end to end.

Proposed areas:

- `frontend/src/components/landing/faq-section.tsx`
- `frontend/src/components/landing/feature-blocks.tsx`
- `frontend/src/components/landing/wallet-types-section.tsx`
- `frontend/src/components/landing/workspace-section.tsx`
- `frontend/src/components/landing/bottom-sections.tsx`
- `frontend/src/components/layout/footer.tsx`

### 4. Update app-shell title and favicon

Why:

- The browser tab still uses the default scaffold title/favicon.
- This is worth fixing for demos, but it still touches public-facing polish and
  should be approved first if the team wants that rule applied consistently.

Proposed areas:

- `frontend/index.html`

## Frontend Changes Already Implemented In This Pass

These are already applied because they directly improve real testnet behavior
and demo reliability.

### 1. Proposal approval/execution behavior now matches contract rules

Why:

- The contract requires execution by an owner who has already confirmed.
- The old UI could show a misleading `Execute` action to owners who had not yet
  approved.

Implemented areas:

- `frontend/src/components/wallets/tx-item.tsx`
- `frontend/src/pages/wallet-detail.tsx`

### 2. Dashboard now shows real cross-wallet action queues and recent activity

Why:

- The product model is approval-centric.
- A demo needs visible `Needs your approval`, `Ready to execute`, and recent
  activity states without relying only on wallet counts.

Implemented areas:

- `frontend/src/pages/dashboard.tsx`
- `frontend/src/hooks/useWorkspaceQueues.ts`

### 3. Wallet detail now shows better loading/error/empty states and recent executed proposals

Why:

- Real demos fail when reads silently collapse into empty screens.
- Wallet activity consistency was one of the requested audit priorities.

Implemented areas:

- `frontend/src/hooks/useReviveWallet.ts`
- `frontend/src/pages/wallet-detail.tsx`

### 4. Proposal form now blocks empty zero-value submissions

Why:

- Prevents proposals that look valid in the UI but fail or create confusion on
  chain.

Implemented areas:

- `frontend/src/components/wallets/tx-form.tsx`

### 5. Wallet list now handles factory read failures more explicitly

Why:

- Missing/bad factory state should not look like an empty workspace.

Implemented areas:

- `frontend/src/pages/wallets.tsx`

## Proposed Frontend Changes Still Pending Review

These are not implemented yet and should be reviewed first.

### High Priority

1. Add dedicated `Inbox`, `Activity`, and `Proposals` app surfaces
   Why:
   The approved IA expects them, and today the dashboard is carrying too much
   of that responsibility.

2. Add a clearer wallet scope/status model inside the app
   Why:
   Users still cannot easily tell which parts of the product are truly live vs
   future/native/product-model direction.

3. Improve create/import information architecture
   Why:
   The approved docs want create vs import to be first-class flows, but the
   current app still feels closer to a factory console plus wallet detail page.

### Medium Priority

1. Add wallet-level sections or tabs closer to the approved model
   Candidate areas:
   Assets, Members, Activity, Rules, Modules, Settings

2. Add richer proposal summaries and type labels
   Why:
   Asset transfers decode well now, but broader proposal categories are still
   shallow.

3. Replace scaffold-level leftover branding/polish issues after approval
   Candidate areas:
   Title/favicon, public copy mismatches, and any remaining demo-inconsistent
   labels

## Suggested Review Workflow

1. Review homepage/public copy changes separately from app-behavior changes.
2. Approve any truthful-scope adjustments before the next demo build.
3. Approve IA changes for Inbox/Activity/Proposals before implementation.
4. Keep this file as the queue of requested frontend changes going forward.
