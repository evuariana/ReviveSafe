import { Activity, ArrowRight, CheckCircle2, Shield, Wallet } from "lucide-react";
import { motion } from "framer-motion";

import { LandingCtaButtons } from "@/components/landing/cta-buttons";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const proofItems = [
  "Programmable contract wallets",
  "Verified native multisig import",
  "One proposal model across actions",
];

export function HeroSection() {
  return (
    <>
      <section
        id="overview"
        className="scroll-mt-28 px-6 pb-32 pt-24 text-center lg:pt-28"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-500 opacity-20 dark:bg-zinc-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-600 dark:bg-zinc-300" />
            </span>
            Built for the new Polkadot Hub
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 text-5xl font-display font-medium tracking-tight text-zinc-950 md:text-7xl lg:text-[80px] lg:leading-[1.03] dark:text-white"
          >
            The shared wallet for
            <br className="hidden md:block" />{" "}
            <span className="text-zinc-400 dark:text-zinc-500">Polkadot teams.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-xl"
          >
            One place for shared approvals, imported native multisigs, contract
            wallet operations, and clear proposal history on Asset Hub.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 flex justify-center"
          >
            <LandingCtaButtons />
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
        className="relative mx-auto mb-40 max-w-5xl px-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0a0a0a] dark:ring-white/5">
          <div className="absolute left-4 top-4 z-20 flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          <div className="md:flex">
            <div className="hidden w-64 flex-col border-r border-black/5 bg-black/[0.02] px-4 pb-4 pt-14 dark:border-white/5 dark:bg-white/[0.02] md:flex">
              <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-black/5 bg-black/[0.05] dark:border-white/5 dark:bg-white/[0.1]">
                  <Shield className="h-4 w-4 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Acala Ops
                </span>
              </div>

              <div className="space-y-1">
                <div className="mb-1 px-2 py-2 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                  Workspace
                </div>
                <div className="flex items-center justify-between rounded-md border border-black/5 bg-black/5 px-2 py-2 text-sm text-zinc-800 dark:border-white/5 dark:bg-white/5 dark:text-zinc-100">
                  <span>Home</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-mono text-amber-600 dark:text-amber-400">
                    4
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>Inbox</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    2
                  </span>
                </div>
                <div className="px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Wallets
                </div>
                <div className="px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Proposals
                </div>
              </div>

              <div className="mt-8 space-y-1">
                <div className="mb-1 px-2 py-2 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                  Wallets
                </div>
                <div className="flex items-center justify-between px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>Active wallets</span>
                  <span className="text-xs font-mono">3</span>
                </div>
                <div className="flex items-center justify-between px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>Wallet notices</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] font-mono text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    2
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-black/[0.01] to-transparent p-6 pt-14 dark:from-white/[0.01] md:p-12 md:pt-12">
              <div className="mb-10 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-medium text-zinc-900 dark:text-zinc-100">
                    Treasury payout to validator ops
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Proposal #4092 needs your approval.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-mono text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                  <Activity className="h-3 w-3" strokeWidth={1.8} />
                  Asset Hub
                </div>
              </div>

              <div className="rounded-xl border border-black/10 bg-zinc-50 p-8 shadow-inner dark:border-white/10 dark:bg-[#0f0f0f]">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                      <ArrowRight className="h-5 w-5 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                        Transfer
                      </div>
                      <div className="text-2xl font-mono text-zinc-900 dark:text-zinc-100">
                        50,000 USDC
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                      Destination
                    </div>
                    <div className="rounded border border-black/5 bg-black/5 px-2 py-1 text-sm font-mono text-zinc-600 dark:border-white/5 dark:bg-white/5 dark:text-zinc-300">
                      14Gz...9xQw
                    </div>
                  </div>
                </div>

                <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-50 bg-zinc-100 dark:border-[#0f0f0f] dark:bg-[#1a1a1a]">
                        <CheckCircle2 className="h-4 w-4 text-zinc-600 dark:text-zinc-300" strokeWidth={2} />
                      </div>
                      <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-50 bg-zinc-100 dark:border-[#0f0f0f] dark:bg-[#1a1a1a]">
                        <CheckCircle2 className="h-4 w-4 text-zinc-600 dark:text-zinc-300" strokeWidth={2} />
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-zinc-50 bg-white dark:border-[#0f0f0f] dark:bg-[#0a0a0a]">
                        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
                          ?
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      2 of 3 approvals
                    </span>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(0,0,0,0.05)] transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:w-auto"
                  >
                    <Wallet className="h-4 w-4" strokeWidth={1.5} />
                    Approve proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto mb-40 max-w-7xl px-6 text-center">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
          Built around the workflows teams actually need
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {proofItems.map((item) => (
            <div
              key={item}
              className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
