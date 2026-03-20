# How ReviveSafe Used RelayCode Components To Build A PVM-Ready Multisig

ReviveSafe started as an older app with the usual EVM-era assumptions: wallet
connect lived in a wagmi and RainbowKit stack, contract interactions were
treated like standard Ethereum app flows, and the Polkadot-specific parts were
more of a thin integration layer than a product foundation.

That was not good enough for a serious PolkaVM submission.

For the rewrite, we moved ReviveSafe to a Dedot and LunoKit-first architecture
so the app actually behaves like an Asset Hub and `pallet_revive` product. The
RelayCode codebase was the best reference point for doing that well. It already
had the most up to date patterns for Dedot, LunoKit, and ergonomic Polkadot UI
components, so instead of inventing a new design system or rebuilding common
inputs from scratch, we used RelayCode as the baseline.

The result is not a RelayCode clone. ReviveSafe still has its own product
surface, its own multisig logic, and its own deploy workflow. But the wallet
controls and input primitives now come from a toolkit that already understands
how Polkadot builders work.

## Why RelayCode Was The Right Fit

ReviveSafe sits in an interesting middle ground:

- it is a Solidity app
- it deploys to PolkaVM
- it signs writes through `pallet_revive`
- it still benefits from ETH RPC on the read side for ABI-compatible contract state

That mix means generic EVM UI libraries are not a natural fit anymore. The app
needs Substrate-aware chain selection, account mapping awareness, balance-aware
inputs, byte-oriented payload inputs, and a clean way to express optional
runtime parameters.

RelayCode already solves many of those problems with a component model that is
closer to real Polkadot builder workflows than standard wallet dapp templates.
That let us spend our time on ReviveSafe-specific problems, such as mapped H160
ownership, multisig proposal flows, and asset precompile transfers, instead of
spending days rebuilding form controls.

## What We Reused Directly

The first thing we copied from the RelayCode approach was the wallet shell.
ReviveSafe now uses a RelayCode-style login button and chain selector via
LunoKit, which made the app feel native to the Dedot stack instead of bolted
onto it.

- The connect flow now lives in
  [`frontend/src/components/wallet/connect-button.tsx`](../frontend/src/components/wallet/connect-button.tsx)
- Chain switching now lives in
  [`frontend/src/components/wallet/chain-selector.tsx`](../frontend/src/components/wallet/chain-selector.tsx)
- The wallet and runtime provider wiring now lives in
  [`frontend/src/providers/wallet-provider.tsx`](../frontend/src/providers/wallet-provider.tsx)

That immediately changed the feel of the app. Instead of treating Polkadot as
just another RPC endpoint, ReviveSafe now starts from the actual chain context.
Paseo Asset Hub and Polkadot Asset Hub are first-class networks, and the wallet
UX reflects that from the first click.

We also reused RelayCode-style form primitives for the places where the data
model matched cleanly:

- [Balance Input](https://relaycode.org/docs/components/balance-input) for
  runtime-denominated balances such as deploy value and storage deposit
- [Bytes Input](https://relaycode.org/docs/components/bytes-input) for bytecode,
  calldata, and optional salt values
- [Option Input](https://relaycode.org/docs/components/option-input) for
  optional revive parameters
- [Amount Input](https://relaycode.org/docs/components/amount-input) for
  thresholds and integer-like advanced fields such as weight values

You can see those inputs working together most clearly in the deploy console at
[`frontend/src/pages/deploy.tsx`](../frontend/src/pages/deploy.tsx). That page
lets a user compile Solidity to PolkaVM bytecode, upload or paste artifacts,
set constructor arguments, provide deploy value, toggle optional storage deposit
limits, attach an optional salt, and then instantiate or call contracts through
`pallet_revive`.

Using RelayCode-style inputs mattered here because deploy tooling on Polkadot is
not only about pretty forms. The inputs need to understand decimals, byte
payloads, optional runtime parameters, and large numeric values in a way that is
safe and legible for the user.

## What We Adapted For ReviveSafe

Not every RelayCode component could be dropped in unchanged, and this is
probably the most useful lesson for other builders.

RelayCode's account patterns assume a Substrate-native account entry flow. That
works well when the destination or owner model is SS58-first, but ReviveSafe's
contract-facing model is different. Once the app moved to `pallet_revive`, the
canonical identity for contract ownership and calls became the mapped H160, not
just the connected SS58 address.

So instead of forcing the stock account component into the wrong job, we built
[`frontend/src/components/inputs/mapped-account-input.tsx`](../frontend/src/components/inputs/mapped-account-input.tsx)
as a thin adaptation of the RelayCode account-combobox idea:

- it shows connected accounts from the wallet layer
- it resolves those accounts to mapped H160 values
- it allows direct pasted H160 addresses
- it stores recent H160 selections locally for faster multisig setup

That small wrapper made the multisig create flow much more honest. Users are no
longer pretending that an SS58 address is the same thing as a contract owner
address. The UI makes the mapping explicit, which is exactly what you want in a
PVM-focused app.

We did something similar for asset transfers. RelayCode's balance input pattern
is excellent, but pallet-assets introduces a different decimal and symbol model
per asset. ReviveSafe needed a component that could read asset metadata, display
the correct symbol and decimals, and still emit an ABI-ready integer string for
the multisig contract call.

That is why
[`frontend/src/components/inputs/asset-amount-input.tsx`](../frontend/src/components/inputs/asset-amount-input.tsx)
wraps the general balance input instead of replacing it. It keeps the proven
input behavior while adding ReviveSafe-specific asset metadata and precompile
context.

## What This Unlocked In The Product

The RelayCode component model was not just a visual refresh. It unlocked a
cleaner architecture.

ReviveSafe now has:

- a Dedot and LunoKit-first wallet shell
- a blocking mapping gate before any write action
- revive writes routed through a dedicated action layer instead of wallet-EVM hooks
- a deploy console that feels native to PVM workflows
- multisig proposal flows that can target both native transfers and asset
  precompile transfers

The mapping requirement is surfaced through
[`frontend/src/components/wallet/mapping-gate.tsx`](../frontend/src/components/wallet/mapping-gate.tsx),
which is another important example of component-driven product design. Once we
accepted that mapped H160 was the real contract identity, the app could stop
hiding that requirement and instead turn it into a clear onboarding step.

That made the rest of the experience simpler. Factory creation, multisig owner
entry, contract deployment, and asset transfer proposals now all operate around
the same identity model.

## A Practical Pattern For Other Builders

If you are building on Asset Hub, RelayCode is useful not because you should
copy the entire application, but because it gives you a strong set of defaults
for the pieces that are hardest to get right repeatedly.

The pattern that worked for ReviveSafe was:

1. Start with the wallet shell.
2. Move chain and account context to Dedot and LunoKit early.
3. Reuse generic components directly when the underlying data model matches.
4. Build thin wrappers when your product needs H160, asset metadata, or other
   chain-specific semantics.
5. Keep your product logic separate from the component layer.

That last point is important. RelayCode components helped us move faster, but
ReviveSafe still needed its own hooks and action layer for `map_account`,
`instantiateWithCode`, `pallet_revive.call`, multisig registration, and
precompile transfer proposals. Reusing the UI primitives made those product
features easier to ship because we were not fighting the form layer at the same
time.

## Why This Matters For PVM Teams

One of the easiest mistakes in a hackathon build is to ship something that is
technically on Polkadot but still feels architecturally Ethereum-first.

ReviveSafe is stronger after this rewrite because the product now expresses the
parts that are unique to Polkadot Asset Hub:

- mapped accounts
- revive extrinsics
- runtime-aware balances
- asset metadata
- deterministic asset precompiles
- multi-network Asset Hub support

RelayCode components helped us expose those ideas in the UI instead of hiding
them behind generic web3 affordances.

For teams considering RelayCode, that is the real pitch: it is a practical way
to get from "our app technically connects to Polkadot" to "our app actually
feels built for this environment."

## Closing

ReviveSafe used RelayCode components as a force multiplier. We reused the parts
that already worked well for Polkadot UX, adapted the pieces that needed H160
and asset-aware behavior, and kept the business logic focused on the actual
product: a PVM-ready multisig with deploy tooling and asset-precompile support.

If you are building on Asset Hub or experimenting with `pallet_revive`, this is
a strong path to consider. Start with the RelayCode patterns that match your
app, wrap the ones that need product-specific semantics, and let Dedot become
the core instead of a side integration.
