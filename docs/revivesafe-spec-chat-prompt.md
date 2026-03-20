# ReviveSafe Product Spec Chat Prompt

Use this prompt in a fresh chat session dedicated only to product definition.

## Prompt

```text
You are helping define the long-term product specification for ReviveSafe.

This is not a UI redesign task yet.
This is not a hackathon-only scope exercise yet.
Do not jump into implementation or visual design until the product definition is clear.

## Goal

Write a clear product specification for ReviveSafe as a unified shared wallet
platform for Polkadot teams.

The goal is to define what ReviveSafe fundamentally is before any homepage,
dashboard, or Gemini redesign prompts are created.

## Important Context

ReviveSafe should not be reduced to:
- a prettier multisig UI
- a treasury-only product
- a PVM demo
- a deploy console with wallet features

ReviveSafe should become one place where teams can:
- view all shared wallets and shared accounts they participate in
- receive notifications when approvals are needed
- create proposals
- approve and execute proposals
- manage wallet members, rules, and capabilities
- work across native and programmable wallet rails inside one product

## Product Direction

There are at least two wallet rails in the long-term model:

1. Native shared wallet rail
- better UX for native Polkadot-style shared account operations
- simpler onboarding
- no contract activation required

2. Programmable wallet rail
- contract wallet via Revive / PVM
- supports modules, policies, richer wallet logic, and deeper Polkadot-native integrations

The product should feel unified even if multiple rails exist underneath it.

## Important Constraint

Activation / `map_account` is not a product feature.
It is only a technical requirement when using the programmable wallet rail.
Do not treat it as the defining concept of the whole product.

## Key Product Question

Answer this clearly:

"What does ReviveSafe offer that a native Polkadot multisig UI does not?"

If the answer for programmable wallets is weak, say so honestly.

## Things To Define

Please write a clean product spec covering:

1. Product definition
2. Problem statement
3. Users and personas
4. Core product promise
5. Why ReviveSafe should exist now
6. Wallet model
7. Proposal model
8. Notification model
9. Native vs programmable wallet model
10. Modules, templates, and policies
11. Dashboard and navigation model at the product level
12. Key user journeys
13. Differentiation from existing products
14. Open questions and unresolved tradeoffs

## Important Competitive Context

Use Safe and Squads as product-quality benchmarks for:
- clarity
- trust
- dashboard storytelling
- explaining a shared wallet simply

Use Polkadot ecosystem context to understand the gap:
- Mimir sunset
- Multix shutdown
- poor native extrinsics UX for many users
- opportunity for a better shared wallet and approvals layer

## Writing Style

Keep the spec:
- clear
- product-first
- simple to understand
- honest about tradeoffs
- not overloaded with technical implementation detail

Use plain English wherever possible.
Explain technical concepts in product terms.

## Output Format

Write the result as a product spec with:
- short sections
- flat bullets where useful
- explicit open questions at the end
- a final “recommended product thesis” summary

Do not write homepage copy yet.
Do not write Gemini prompts yet.
Do not scope phases or v1 until the product model is coherent.

Use the following reference document as baseline context:
/Users/evisha/Projects/ReviveSafe/docs/revivesafe-product-spec-outline.md
```

## Intended Output

The fresh chat should produce:
- a full product spec, not just an outline
- clear differentiation for programmable wallets
- a unified wallet model
- open questions to resolve before copy and UI work

## Reference Inputs

Give the new chat these local docs:
- `/Users/evisha/Projects/ReviveSafe/docs/revivesafe-product-spec-outline.md`
- `/Users/evisha/Projects/ReviveSafe/docs/revivesafe-benchmark-and-reference-notes.md`

## Notes

Do not use this prompt for Gemini or UI generation.
This prompt is only for a dedicated product-spec session.
