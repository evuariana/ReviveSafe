## ReviveSafe
A mordern Multisig wallet for Polkadot powered by Polkadot
ReviveSafe is a full-stack multisignature wallet solution designed for the Polkadot ecosystem. It leverages Polkadot’s new EVM‐compatible environment (PolkaVM) and the custom pallet‐revive runtime module to run Solidity contracts natively on RISC-V. On the frontend, a React dashboard (written in TypeScript and styled with Tailwind and shadcn/ui) provides a seamless user experience: connect a PolkaVM-compatible wallet, create or register multisig wallets, view and manage owned wallets, and submit or confirm transactions—all with sub-second finality and low fees.

### Key Components
#### 1. Solidity Contracts
##### MultiSigWallet.sol

Implements a standard multisig pattern: an array of owners, a required threshold, and a dynamic list of transaction proposals.

Owners can call submitTransaction(destination, value, data) to propose a transfer. Each proposal is assigned a numeric ID.

Other owners call confirmTransaction(txId) to register their approval. Once confirmations ≥ threshold, executeTransaction(txId) automatically sends funds via a low-level call{value:…}.

Owners can revoke prior confirmations (via revokeConfirmation(txId)) before execution.

Read-only methods include getOwners(), required(), getTransactionCount(), getTransactionIds(), and getConfirmations().

##### MultiSigFactory.sol

Anyone can call createMultiSig(address[] owners, uint256 required) to deploy a new MultiSigWallet instance on-chain; the factory stores its address in an on-chain array allMultiSigs[].

registerExistingMultisig(address multisig) allows registering any pre-deployed multisig by verifying it supports isOwner(this).

getAllMultiSigs() returns every multisig ever created or registered, while getMyMultiSigs(address owner) filters that list to only those wallets where owner is among the wallet’s owners.

All contracts compile through the Revive toolchain: solc → YUL → resolc (Revive) → RISC-V. At runtime, PolkaVM’s RISC-V interpreter (pallet-revive) executes the bytecode under Polkadot’s weight/gas model, benefitting from sub-second finality and Polkadot’s shared security.

#### 2. Frontend Dashboard
##### Structure

The React frontend (in frontend/) is organized into:

Constants & ABIs (src/constants/)

factoryAddress.ts contains the deployed MultiSigFactory address on PolkaVM.

MultiSigFactory.json and MultiSigWallet.json store ABIs for the factory and wallet contracts, respectively.

Hooks (src/hooks/)

useWalletAddress.ts detects and listens for the user’s connected PolkaVM wallet (e.g., MetaMask configured for a PolkaVM parachain).

useFactory.ts returns a signer-connected ethers.Contract instance pointing at MultiSigFactory.

Components (src/components/)

Pages (src/pages/)


##### PolkaVM & pallet-revive

ReviveSafe’s smooth user experience relies on PolkaVM and the pallet-revive module:

pallet-revive

A custom Substrate pallet that accepts Ethereum-style JSON-RPC calls (e.g., eth_sendRawTransaction) via a proxy.
Stores RISC-V code blobs under a code_hash and instantiates contract accounts on-chain.
Charges gas in weight units (picoseconds) for RISC-V EVM execution. Unused weight is refunded, and weight exhaustion reverts the current call.
Provides host-function tracing (runtime::revive::strace) for developers.
PolkaVM (RISC-V Interpreter)
Executes RISC-V instructions compiled from Solidity’s YUL output by the Revive tool (resolc).
Offers sub-second finality, low fees, and native cross-chain messaging capabilities.
Integrates tightly with Polkadot’s shared security model, meaning multisig funds are protected by the entire relay chain.
By compiling the multisig contracts through solc → resolc → pallet-revive, ReviveSafe achieves full Solidity compatibility with minimal code changes. Ethers.js calls (e.g., factory.createMultiSig(...), msContract.confirmTransaction(...)) are seamlessly translated into Substrate extrinsics and executed in PolkaVM


Why ReviveSafe Matters
Lowering the Barrier to Polkadot: Solidity developers can reuse existing tooling (Ethers.js, MetaMask, Hardhat) without rewriting in ink!/Rust.
Enterprise-grade Security: Each multisig wallet benefits from Polkadot’s shared security, RISC-V execution, and rapid finality.
Composability: The on-chain factory registry (getMyMultiSigs()) allows other dApps to discover and integrate with user-owned multisigs dynamically.
Performance & UX: Sub-second confirmations and low fees improve the user’s multisig workflow—no more long waits for confirmations as on Ethereum.
Future-proof: As pallet-revive’s JIT evolves and PolkaVM matures, ReviveSafe will only get faster and more economical.

