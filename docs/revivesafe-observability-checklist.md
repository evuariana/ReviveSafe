# ReviveSafe Observability Checklist

Updated: March 22, 2026

## Repo Support Added

The frontend now ships with a lightweight observability stub.

If `VITE_OBSERVABILITY_ENDPOINT` is set, the app can report JSON payloads for:

- runtime connection failures
- query failures
- mutation failures
- React error boundary crashes
- uncaught runtime errors and promise rejections

If the env var is not set, the stub only warns in local development. That is
acceptable for development, but it is not enough for any external beta.

## Minimum Launch Requirement

Before any external beta:

1. Set `VITE_OBSERVABILITY_ENDPOINT`.
2. Confirm the endpoint accepts JSON POST or beacon payloads.
3. Confirm the support URL shown in the app is live.
4. Add uptime checks for the selected WS and ETH RPC endpoints.
5. Run a seeded smoke test against the deployed factory and one seeded wallet.

## Event Types Emitted

Current frontend events include:

- `runtime.connection.error`
- `runtime.chain-token.error`
- `query.error`
- `mutation.error`
- `window.error`
- `window.unhandledrejection`
- `react.error-boundary`

## Expected Payload Fields

The stub sends:

- `app`
- `releaseChannel`
- `type`
- `level`
- `message`
- `details`
- `timestamp`
- `path`
- `userAgent`

## Uptime Checklist

- Monitor the selected WS RPC endpoint.
- Monitor the selected ETH RPC endpoint.
- Alert when either endpoint is unavailable for more than a short burst window.
- Confirm the dashboard still loads when only the ETH RPC path is degraded.
- Confirm the runtime banner appears when the WS runtime is unavailable.

## Smoke Checklist

Run this against the real target environment:

1. Connect a supported wallet.
2. Verify mapping status.
3. Create a wallet through the active factory.
4. Add a known compatible contract wallet.
5. Submit a proposal.
6. Approve from a second owner.
7. Execute from an eligible owner.
8. Confirm the event stream or logs show both successful and failed test cases.

## Public Beta Blocker Rule

Treat any of the following as a blocker for public beta:

- no observability endpoint configured
- no uptime checks on the chosen RPCs
- no seeded wallet smoke test on the target factory
- no support owner for incoming incidents
