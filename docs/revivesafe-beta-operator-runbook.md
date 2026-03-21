# ReviveSafe Beta Operator Runbook

Updated: March 22, 2026

## Purpose

This runbook is for operating the live ReviveSafe beta as it exists today:
programmable contract wallets on Paseo Asset Hub and, if explicitly verified,
Polkadot Asset Hub.

Complete every `TBD` item before inviting external users. Public beta should
not start until this file is fully filled in for the target environment.

## Environment Inventory

- Release channel: `private beta` by default
- Primary chain: `TBD`
- Approved fallback chain: `TBD`
- Active factory address: `TBD`
- Factory explorer link: `TBD`
- Frontend URL: `TBD`
- Support URL or inbox: `TBD`
- Observability endpoint: `TBD`
- WS RPC endpoint: `TBD`
- ETH RPC endpoint: `TBD`
- Seeded wallet for smoke tests: `TBD`
- Seeded owner accounts for approval tests: `TBD`

## Roles

- Beta operator: `TBD`
- Incident lead: `TBD`
- Support owner: `TBD`
- Deployment owner: `TBD`

## Supported User Journey

The live beta supports:

- connect with Talisman, SubWallet, or Polkadot.js through LunoKit
- activate the account with `revive.map_account()`
- create a programmable contract wallet from the factory
- add an existing compatible contract wallet when the connected mapped account
  is already an owner
- open wallet detail, inspect owners and balances, and review pending or recent
  executed proposals
- submit native token transfers, calldata proposals, and supported Asset Hub
  asset transfers
- approve pending proposals as an owner
- execute ready proposals as an eligible owner

Do not promise native multisig import, proxy support, Inbox, Activity,
Proposals, upgrade flows, or richer rules/modules/settings in the live beta.

## Pre-Launch Go/No-Go

- Confirm the exact chain users will see first.
- Confirm the active factory address is deployed and verified for that chain.
- Confirm the explorer links open the correct chain and account pages.
- Confirm seeded wallets and owner accounts are funded for mapping, create,
  approve, and execute flows.
- Confirm `frontend/.env` or deployment envs match the target chain.
- Confirm the support URL and incident owner are live.
- Confirm `VITE_OBSERVABILITY_ENDPOINT` is set for any external beta.
- Confirm the runtime and ETH RPC endpoints pass uptime checks.

## Smoke Test Before Each Release Window

1. Connect with a supported wallet.
2. Verify the mapping gate shows the expected mapped H160.
3. Run `Activate wallet` if the account is unmapped.
4. Confirm the dashboard shows the correct chain and factory status.
5. Create a wallet from the active factory.
6. Add a known compatible contract wallet.
7. Submit a native transfer or calldata proposal.
8. Approve from a second owner account.
9. Execute from an eligible owner account.
10. Verify recent activity updates and explorer links resolve.

## Incident Playbooks

### Runtime or RPC outage

- Confirm whether the failure is WS, ETH RPC, or both.
- Switch the operator session to the approved fallback endpoint if available.
- Pause new beta invites until the dashboard and wallet detail can read again.
- Post a user-facing support update with the affected chain and time window.

### Factory missing or misconfigured

- Confirm `VITE_FACTORY_ADDRESS` or stored factory selection.
- Re-verify the factory address on the active chain explorer.
- If the address is wrong, update deployment config before reopening create or
  add-wallet flows to users.

### Mapping failures

- Confirm the connected wallet is on the intended chain.
- Confirm the account has enough native balance to submit
  `revive.map_account()`.
- Capture the mapped H160 and the support incident link before asking the user
  to retry.

### Proposal submit, approve, or execute failures

- Capture the wallet address, proposal id, acting owner, chain, and current
  factory.
- Check whether the runtime connection banner is active.
- Check the explorer for the failed extrinsic if a hash is available.
- If the failure is reproducible, pause rollout until the operator can complete
  the same flow on a seeded wallet.

## Daily Beta Checks

- Confirm the frontend loads on the intended chain.
- Confirm the runtime connection banner is not active.
- Confirm the support inbox has triage coverage.
- Confirm at least one seeded wallet still loads and can surface proposals.
- Confirm observability events are arriving for deliberate test failures.

## Post-Incident Capture

After every user-facing incident, record:

- time window
- impacted chain
- impacted flow
- root cause
- mitigation
- whether rollout should remain `private beta` only
