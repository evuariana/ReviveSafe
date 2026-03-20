# ReviveSafe Gemini UI Prompt Template

Use this only after the product spec is written and approved.

## Purpose

This is a scaffold for a future Gemini 3.1 design prompt.

It should not be used until:
- the product spec is complete
- the core product messaging is approved
- the homepage and dashboard information architecture are defined

## Inputs Required Before Use

Before turning this into a final Gemini prompt, gather these inputs:

- `/Users/evisha/Projects/ReviveSafe/docs/revivesafe-product-spec-outline.md`
- the completed long-form product spec from the dedicated spec chat
- `/Users/evisha/Projects/ReviveSafe/docs/revivesafe-benchmark-and-reference-notes.md`
- a messaging and terminology guide
- a homepage content brief
- a dashboard IA / screen flow brief

## Prompt Skeleton

```text
You are a top-tier product designer and React/Tailwind engineer.

Redesign the ReviveSafe homepage and, if requested, the connected dashboard
using the attached product spec and content brief.

## Product

ReviveSafe is:
[insert approved one-sentence product definition]

Core promise:
[insert approved promise]

Audience:
[insert primary users]

## Important Constraints

- Follow the approved product spec exactly
- Do not invent features that are not in the spec
- Do not turn ReviveSafe into a generic treasury dashboard
- Do not make PVM, Revive, or precompiles the headline story unless the content
  brief explicitly says to do so
- The product should feel like a unified shared wallet platform for Polkadot
  teams

## Reference Direction

Use these references for quality and interaction patterns:
- Safe for clarity, trust, and dashboard storytelling
- Squads for workflow framing and operations language
- Polkadot-native identity and execution should remain distinct from Ethereum-
  first assumptions

## Design Direction

- Premium, minimal, confident
- Strong hierarchy
- Clean product screenshot or dashboard mock that explains the system visually
- Intentional typography
- Excellent spacing
- Clear information density
- Calm color system
- No hackathon/demo language
- No control-room language
- No generic crypto landing page tropes

## Page Goals

Homepage should explain:
- what ReviveSafe is
- why teams use it
- why it is different from raw shared wallet tooling
- how native and programmable wallets fit into one product
- why notifications, approvals, and wallet operations belong together

Dashboard should explain:
- what needs my approval
- what changed
- which wallets I control
- what I can do next

## Content Inputs

Homepage copy:
[insert approved homepage brief]

Dashboard sections:
[insert approved dashboard IA]

Terminology rules:
[insert approved terminology guide]

## Output Requirements

Return:
1. a short design concept summary
2. production-ready React + Tailwind code
3. any supporting component files
4. any CSS or token additions
5. short notes on typography, iconography, and screenshot treatment

## Technical Constraints

- React
- TypeScript
- Tailwind CSS
- realistic for an existing Vite app
- preserve real navigation and wallet controls where possible
- no fake product claims or fake metrics
```

## What To Finalize Before Using This

Fill these before sending to Gemini:
- approved product definition
- approved homepage narrative
- approved dashboard structure
- visual references or screenshots
- terminology guardrails

## References

- Safe homepage: https://safe.global/
- Safe modules docs: https://docs.safe.global/advanced/smart-account-modules
- Squads multisig: https://squads.xyz/multisig
- ReviveSafe benchmark notes: `/Users/evisha/Projects/ReviveSafe/docs/revivesafe-benchmark-and-reference-notes.md`
- ReviveSafe spec outline: `/Users/evisha/Projects/ReviveSafe/docs/revivesafe-product-spec-outline.md`
