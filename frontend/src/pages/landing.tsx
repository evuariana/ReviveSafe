import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  FileText,
  Globe,
  Key,
  Layers,
  Lock,
  ShieldCheck,
  Terminal,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "@luno-kit/react";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/wallet/connect-button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ecosystem = [
  { label: "Polkadot", icon: Globe },
  { label: "Asset Hub", icon: Layers },
  { label: "PVM", icon: Cpu },
];

const capabilityCards = [
  {
    title: "Unified asset operations",
    body:
      "Manage native balances and asset-precompile transfers from the same shared wallet flow.",
    icon: Wallet,
    featured: true,
  },
  {
    title: "PVM contract tools",
    body:
      "Deploy contracts, call write functions, and keep contract operations close to wallet approvals.",
    icon: Terminal,
    featured: false,
  },
  {
    title: "Approval thresholds",
    body:
      "Set clear owner rules, collect approvals, and execute only when the required signers are in place.",
    icon: Key,
    featured: false,
  },
  {
    title: "Shared control without custody risk",
    body:
      "Keep the wallet non-custodial while still giving teams a clean operating layer for shared action on Asset Hub.",
    icon: Lock,
    featured: true,
  },
];

const workflowSteps = [
  {
    title: "Connect and activate",
    body:
      "Connect a Polkadot account and run the one-time setup ReviveSafe needs for contract ownership.",
  },
  {
    title: "Create or add a wallet",
    body:
      "Create a shared wallet with owners and a threshold, or bring in one your team already uses.",
  },
  {
    title: "Approve and execute",
    body:
      "Queue transfers and contract actions, collect approvals, and execute from one proposal flow.",
  },
];

export default function Landing() {
  const { account } = useAccount();

  return (
    <div className="relative overflow-hidden bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)] dark:opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-[100px] dark:bg-white/[0.03]" />

      <section
        id="overview"
        className="relative mx-auto max-w-7xl px-6 pb-28 pt-24 lg:px-8 lg:pt-28"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-500 opacity-20 dark:bg-zinc-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-700 dark:bg-zinc-300" />
            </span>
            Live on Polkadot Asset Hub
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 max-w-5xl text-5xl font-medium tracking-tight text-zinc-950 md:text-7xl lg:text-[5rem] lg:leading-[1.02] dark:text-white"
          >
            Shared control for
            <br className="hidden md:block" />{" "}
            <span className="text-zinc-500 dark:text-zinc-500">Polkadot teams.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-zinc-600 md:text-xl dark:text-zinc-400"
          >
            ReviveSafe is the shared wallet and multisig workspace for protocol
            teams, operators, and signers. Manage native balances,
            asset-precompile transfers, and PVM contract actions in one place.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
          >
            {account ? (
              <Link to="/dashboard">
                <Button className="h-12 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <ConnectButton />
            )}
            <Link to="/deploy">
              <Button
                variant="outline"
                className="h-12 rounded-full border-zinc-200 bg-white px-8 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.03] dark:hover:text-white"
              >
                Open contract tools
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative mx-auto max-w-6xl px-6 pb-36 lg:px-8"
      >
        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_18px_80px_rgba(15,23,42,0.08)] ring-1 ring-zinc-200/60 transition-colors duration-500 md:flex dark:border-white/10 dark:bg-[#0b0b0b] dark:shadow-[0_0_60px_rgba(255,255,255,0.04)] dark:ring-white/5">
          <div className="hidden w-64 flex-col border-r border-zinc-200 bg-zinc-50 px-4 pb-4 pt-10 md:flex dark:border-white/6 dark:bg-white/[0.02]">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-black shadow-sm dark:border-white/10 dark:bg-white">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <span className="text-base font-semibold text-zinc-950 dark:text-white">
                ReviveSafe
              </span>
            </div>

            <div className="space-y-2">
              {["Dashboard", "Wallets", "Create", "Add Wallet", "Contracts"].map(
                (label, index) => (
                  <div
                    key={label}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                      index === 0
                        ? "border border-zinc-200 bg-zinc-950 text-white dark:border-white/10 dark:bg-white dark:text-black"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {label}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-zinc-100/80 to-transparent p-6 md:p-10 dark:from-white/[0.02]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Workspace
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                  Wallet workspace overview
                </h3>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-mono text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 sm:flex">
                <Activity className="h-3 w-3" strokeWidth={1.8} />
                Asset Hub
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Account", "Active", "0xBc19...173b6"],
                ["Factory", "Configured", "0x8c2a...32f4"],
                ["Wallets", "3", "Connected to this owner"],
                ["Balance", "128.4 PAS", "Runtime balance"],
              ].map(([label, value, detail]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    {label}
                  </div>
                  <div className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
                    {value}
                  </div>
                  <div className="mt-2 text-xs font-mono text-zinc-500">
                    {detail}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Team wallets
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Open
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    "0x0A7c...38c9",
                    "0x4cF2...19b2",
                    "0x91AA...40f7",
                  ].map((wallet) => (
                    <div
                      key={wallet}
                      className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-white/8 dark:bg-[#111111]"
                    >
                      <div>
                        <div className="font-mono text-sm text-zinc-950 dark:text-white">
                          {wallet}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          Shared wallet
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Loaded assets
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ["PAS", "#1984"],
                    ["USDC", "#1337"],
                    ["vDOT", "#2048"],
                  ].map(([asset, id]) => (
                    <div
                      key={asset}
                      className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-white/8 dark:bg-[#111111]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                          {asset}
                        </div>
                        <div className="text-xs font-mono text-zinc-500">{id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-7xl px-6 pb-36 text-center lg:px-8">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          Built for teams operating on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 text-zinc-500">
          {ecosystem.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-lg font-medium grayscale"
            >
              <item.icon className="h-6 w-6" strokeWidth={1.6} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-36 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-white">
            Engineered for Asset Hub.
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
            ReviveSafe keeps shared wallets, asset movement, and contract work in
            the same operating layer so teams can move faster without giving up
            control.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 md:col-span-2 dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-black/[0.04] blur-[90px] dark:bg-white/[0.03]" />
            <div className="relative z-10">
              <Wallet className="mb-6 h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              <h3 className="text-2xl font-medium text-zinc-950 dark:text-white">
                {capabilityCards[0].title}
              </h3>
              <p className="mt-3 max-w-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
                {capabilityCards[0].body}
              </p>

              <div className="mt-10 max-w-sm space-y-3">
                {[
                  ["PAS", "12,450.00"],
                  ["USDC", "84,000.00"],
                  ["vDOT", "3,920.12"],
                ].map(([label, amount]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-zinc-200 py-3 dark:border-white/6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-zinc-700 dark:bg-zinc-300" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-zinc-500">
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="absolute inset-0 bg-dot-pattern opacity-15" />
            <div className="relative z-10 flex h-full flex-col">
              <Terminal className="mb-6 h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              <h3 className="text-2xl font-medium text-zinc-950 dark:text-white">
                {capabilityCards[1].title}
              </h3>
              <p className="mt-3 font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
                {capabilityCards[1].body}
              </p>
              <div className="mt-auto border-t border-zinc-200 pt-6 dark:border-white/6">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                  <ChevronRight className="h-3 w-3" />
                  revive.call(contract, data)
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <Key className="mb-6 h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-2xl font-medium text-zinc-950 dark:text-white">
              {capabilityCards[2].title}
            </h3>
            <p className="mt-3 font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              {capabilityCards[2].body}
            </p>

            <div className="mt-10">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className={`h-1.5 flex-1 rounded-full ${
                      value <= 3 ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 text-xs font-mono text-zinc-500">
                Threshold: 3/5
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 md:col-span-2 dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.04] to-transparent dark:from-white/[0.04]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <Lock className="mb-6 h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
                <h3 className="text-2xl font-medium text-zinc-950 dark:text-white">
                  {capabilityCards[3].title}
                </h3>
                <p className="mt-3 max-w-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {capabilityCards[3].body}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {["Non-custodial", "On-chain approvals", "Asset-precompile ready"].map(
                  (label) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 dark:border-white/8 dark:bg-white/[0.04] dark:text-zinc-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                      {label}
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section
        id="contracts"
        className="border-y border-zinc-200 bg-zinc-100/70 py-28 transition-colors duration-500 dark:border-white/6 dark:bg-white/[0.015]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
              <Code2 className="h-3 w-3" />
              Contract tools built in
            </div>
            <h2 className="mt-6 text-3xl font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-white">
              Keep wallet actions and contract actions in the same workspace.
            </h2>
            <p className="mt-6 text-lg font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              Deploy the factory, instantiate contracts through Revive, and send
              follow-up write calls without leaving the shared wallet flow.
            </p>
            <Link
              to="/deploy"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
            >
              Open contract tools
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_60px_rgba(255,255,255,0.04)]">
            <div className="mb-6 flex gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/20" />
            </div>
            <pre className="overflow-x-auto text-sm leading-loose text-zinc-600 dark:text-zinc-400">
              <code>
                <span className="text-zinc-500">deploy.prepare</span>({"{"}
                <br />
                {"  "}contract: <span className="text-zinc-900 dark:text-zinc-200">"MultiSigFactory"</span>,
                <br />
                {"  "}constructorArgs: [],
                <br />
                {"  "}value: <span className="text-zinc-900 dark:text-zinc-200">0n</span>,
                <br />
                {"  "}storageDepositLimit: <span className="text-zinc-900 dark:text-zinc-200">null</span>
                <br />
                {"}"});
                <br />
                <br />
                <span className="text-zinc-500">factory.createMultiSig</span>({"{"}
                <br />
                {"  "}owners: [mappedOwnerA, mappedOwnerB, mappedOwnerC],
                <br />
                {"  "}required: <span className="text-zinc-900 dark:text-zinc-200">2</span>
                <br />
                {"}"});
                <br />
                <br />
                <span className="text-zinc-500">wallet.submitAssetTransfer</span>({"{"}
                <br />
                {"  "}assetId: <span className="text-zinc-900 dark:text-zinc-200">1984</span>,
                <br />
                {"  "}destination: <span className="text-zinc-900 dark:text-zinc-200">0xA91c...4F72</span>,
                <br />
                {"  "}amount: <span className="text-zinc-900 dark:text-zinc-200">50000n</span>
                <br />
                {"}"});
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section id="flow" className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-medium tracking-tight text-zinc-950 md:text-4xl dark:text-white">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-light text-zinc-600 dark:text-zinc-400">
            From setup to execution, the flow stays clear: connect, choose who
            can act, then approve and execute from one queue.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="mb-6 flex h-32 items-center justify-center rounded-[20px] border border-zinc-200 bg-zinc-50 dark:border-white/6 dark:bg-white/[0.02]">
              <motion.div
                initial={{ y: 0 }}
                whileHover={{ y: -6 }}
                className="flex w-20 flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#111111]"
              >
                <FileText className="h-4 w-4 text-zinc-700 dark:text-zinc-300" strokeWidth={1.7} />
                <div className="h-1.5 w-1/2 rounded-full bg-zinc-200 dark:bg-white/10" />
                <div className="h-1.5 w-3/4 rounded-full bg-zinc-200 dark:bg-white/10" />
                <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-white/10" />
                <div className="mt-2 self-end rounded-full bg-zinc-950 p-1 text-white dark:bg-white dark:text-black">
                  <ArrowRight className="h-3 w-3" strokeWidth={2} />
                </div>
              </motion.div>
            </div>
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              1. Propose
            </div>
            <h3 className="text-xl font-medium text-zinc-950 dark:text-white">
              {workflowSteps[0].title}
            </h3>
            <p className="mt-3 font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              {workflowSteps[0].body}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="mb-6 flex h-32 items-center justify-center rounded-[20px] border border-zinc-200 bg-zinc-50 dark:border-white/6 dark:bg-white/[0.02]">
              <div className="flex -space-x-3">
                <motion.div
                  whileHover={{ x: -4 }}
                  className="z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-zinc-50 bg-zinc-900 text-white dark:border-[#0a0a0a] dark:bg-zinc-200 dark:text-black"
                >
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-zinc-50 bg-zinc-900 text-white dark:border-[#0a0a0a] dark:bg-zinc-200 dark:text-black"
                >
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.35, 0.9, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-zinc-200 bg-white text-xs font-mono text-zinc-500 dark:border-white/12 dark:bg-[#111111]"
                >
                  ?
                </motion.div>
              </div>
            </div>
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              2. Approve
            </div>
            <h3 className="text-xl font-medium text-zinc-950 dark:text-white">
              {workflowSteps[1].title}
            </h3>
            <p className="mt-3 font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              {workflowSteps[1].body}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="mb-6 flex h-32 items-center justify-center rounded-[20px] border border-zinc-200 bg-zinc-50 dark:border-white/6 dark:bg-white/[0.02]">
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg dark:bg-white dark:text-black"
              >
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
                  <Layers className="h-5 w-5" strokeWidth={1.7} />
                </motion.div>
              </motion.div>
            </div>
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              3. Execute
            </div>
            <h3 className="text-xl font-medium text-zinc-950 dark:text-white">
              {workflowSteps[2].title}
            </h3>
            <p className="mt-3 font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              {workflowSteps[2].body}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
