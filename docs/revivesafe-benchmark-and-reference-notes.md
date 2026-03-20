# ReviveSafe Benchmark And Reference Notes

Last updated: March 20, 2026

## Why This Document Exists

This note captures the external product and ecosystem references we should use
when writing:
- the full product spec
- homepage messaging
- dashboard information architecture
- Gemini prompts for redesign later

It is not itself the product spec. It is the input material for the spec.

## Product Benchmarks

### Safe

What Safe does well:
- explains the category immediately
- sells outcomes before technical details
- uses product screenshots to explain the system visually
- communicates modularity and smart-account power clearly
- presents notifications, transaction service, and mobile signing as part of the
  product, not side features

What ReviveSafe should borrow:
- confidence and clarity in positioning
- dashboard screenshot as product explanation
- “modular programmable wallet” framing
- trust-building structure and hierarchy

What not to copy blindly:
- Ethereum-first assumptions
- overly broad multi-chain messaging before Polkadot-native differentiation is
  clear

References:
- Safe homepage: https://safe.global/
- Safe modules docs: https://docs.safe.global/advanced/smart-account-modules
- Safe smart account concepts: https://docs.safe.global/advanced/smart-account-concepts
- Safe module ecosystem / interoperability context: https://safe.global/blog/launching-erc-7579-adapter-for-safe
- Safe module guards update: https://safe.global/blog/introducing-safe-v1-5-0-module-guards-enhanced-smart-account-features

### Squads

What Squads does well:
- explains workflows instead of architecture
- frames the product as a team operations platform
- highlights spending limits, access controls, multiple accounts, and custom
  transaction building
- communicates product maturity through a clean information hierarchy

What ReviveSafe should borrow:
- action-oriented feature language
- treasury and operations framing without becoming only a treasury product
- permissions and spending-control language
- “multiple accounts, one login” style thinking for workspace design

What not to copy blindly:
- Solana-specific assumptions
- banking and off-ramp features that are outside current ReviveSafe scope

References:
- Squads multisig page: https://squads.xyz/multisig
- Squads v4 product update: https://squads.xyz/blog/v4-and-new-squads-app

### Fireblocks

Why it matters:
- strong reference for governance, policy, and operational control language
- useful benchmark for product positioning around team operations and control

What ReviveSafe should borrow:
- policy/governance framing
- platform-level language around control, automation, and operations

Reference:
- Fireblocks homepage: https://www.fireblocks.com/

## Polkadot Ecosystem Context

### Why the gap matters

There is a meaningful product gap in the Polkadot ecosystem after recent
multisig tool shutdowns and sunsets.

References:
- Mimir sunset: https://forum.polkadot.network/t/mimir-sunset-announcement/16749
- Multix shutdown: https://forum.polkadot.network/t/multix-sunset-announcement-jan-1-2026/16454
- Community discussion about tool shutdowns: https://forum.polkadot.network/t/community-discussion-stewarding-important-polkadot-tools-dapps-after-recent-shutdowns/16824

### Mimir as a useful strategic precedent

Why it matters:
- Mimir was already moving toward a “smart account layer” framing for Polkadot
- it explicitly discussed Safe-compatible PolkaVM multisig
- it recognized the need for better UX over native account abstractions

References:
- Mimir 2025 plan: https://forum.polkadot.network/t/mimir-2025-plan/13732
- Mimir PolkaVM vision: https://forum.polkadot.network/t/mimir-polkavm-vision-safe-based-multisig-for-the-polkadot-ecosystem/13595
- Mimir 2.0 intro: https://forum.polkadot.network/t/introducing-mimir-2-0-more-powerful-proxy-and-multisig-tool/10810
- Broader account abstraction framing from Mimir: https://forum.polkadot.network/t/decentralized-futures-establishing-efficient-zkauth-support-for-the-polkadot-ecosystem/5650

## Polkadot Technical References

### Revive / PVM

What these docs establish:
- Polkadot Hub supports modern smart contracts through `pallet-revive`
- Solidity can target PVM via `resolc`
- the stack is designed to be friendly to Ethereum-style tooling while exposing
  Polkadot-native features

References:
- Smart contract functionality / Revive: https://docs.polkadot.com/parachains/customize-runtime/add-smart-contract-functionality/
- Polkadot Hub smart contracts: https://docs.polkadot.com/reference/polkadot-hub/smart-contracts/

### Accounts and activation

Why this matters:
- native Polkadot accounts and Ethereum-compatible contract accounts use
  different identity models
- `map_account` is a technical bridge, not a product feature

Reference:
- Accounts for Ethereum developers / account mapping: https://docs.polkadot.com/smart-contracts/for-eth-devs/accounts/

### Precompiles

Why they matter:
- precompiles are how contracts talk to native chain features
- they are central to the “programmable but Polkadot-native” product story

References:
- Precompiles overview: https://docs.polkadot.com/smart-contracts/precompiles/
- ERC-20 asset precompile: https://docs.polkadot.com/smart-contracts/precompiles/erc20/
- XCM precompile: https://docs.polkadot.com/smart-contracts/precompiles/xcm/
- Ethereum-native precompiles: https://docs.polkadot.com/smart-contracts/precompiles/eth-native

## Strategic Product Insights

### What the market leaders prove

Safe and Squads prove that users adopt shared-wallet products when they provide:
- clean approval workflows
- rich notifications and transaction visibility
- clear permissions and policy systems
- operational control, not just signature collection
- strong screenshots and dashboards that explain the product visually

### What Polkadot specifically needs

ReviveSafe should not try to win by saying only:
- “we support PVM”
- “we use precompiles”
- “we are a multisig contract”

It should win by saying:
- one place for shared approvals on Polkadot
- better UX than raw native account tooling
- programmable wallet capabilities where they add real value
- Polkadot-native capabilities through one workflow

## Recommended Product Framing Direction

ReviveSafe should feel like:
- Safe for shared-wallet confidence and modularity
- Squads for operational clarity and team workflow
- Polkadot-native in execution rails and ecosystem integration

It should not feel like:
- a generic admin dashboard
- a Solidity playground
- a treasury-only niche tool

## Suggested Follow-On Docs

After the product spec is written, use these references to create:
- a messaging and terminology guide
- a homepage content brief
- a Gemini homepage redesign prompt
- a dashboard redesign prompt
