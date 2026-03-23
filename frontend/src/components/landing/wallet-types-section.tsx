import { Blocks, Globe, Layers, Lock, Repeat, ShieldCheck, Wallet } from "lucide-react";
import { motion } from "framer-motion";

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

export function WalletTypesSection() {
  return (
    <section id="wallet-types" className="scroll-mt-28 mx-auto mb-40 max-w-7xl px-6">
      <div className="mb-16">
        <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
          What the current beta supports.
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light text-zinc-500 dark:text-zinc-400">
          ReviveSafe now supports a limited native import path alongside
          programmable contract wallets. Native creation and proxy flows are
          still out of scope for this beta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="group flex flex-col rounded-3xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20 md:p-12"
        >
          <div className="mb-10 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-zinc-50 dark:border-white/5 dark:bg-[#111]">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-48 w-48 rounded-full border border-black/10 dark:border-white/10"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute h-32 w-32 rounded-full border border-black/10 dark:border-white/20"
              />
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black shadow-xl dark:bg-white">
                <ShieldCheck className="h-8 w-8 text-white dark:text-black" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              Native wallets.
            </h3>
            <p className="mb-6 mt-2 text-xl font-light text-zinc-500 dark:text-zinc-400">
              Live with current limits.
            </p>
            <p className="font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              This beta can import direct `pallet_multisig` wallets by verified
              member set and threshold. Native wallet creation, proxy import,
              and upgrade flows are not live here yet.
            </p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Lock className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Verified direct import
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Import derives the deterministic native wallet address and
                  checks that the connected signer is a direct member.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Wallet className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Partial native action support
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  ReviveSafe can show pending native multisig operations,
                  approve them by hash, and execute supported calls when full
                  call details are recoverable.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Globe className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Explicit scope limits
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Proxy wallets, automatic discovery, and native wallet creation
                  remain out of scope in the current pass.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="group flex flex-col rounded-3xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20 md:p-12"
        >
          <div className="mb-10 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-zinc-50 dark:border-white/5 dark:bg-[#111]">
            <div className="relative flex items-center justify-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-xl bg-black shadow-xl dark:bg-white">
                <Blocks className="h-8 w-8 text-white dark:text-black" strokeWidth={1.5} />
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute h-48 w-48"
              >
                <div className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/20 dark:bg-[#1a1a1a]">
                  <Blocks className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-4 left-0 flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/20 dark:bg-[#1a1a1a]">
                  <Repeat className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-4 right-0 flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/20 dark:bg-[#1a1a1a]">
                  <Layers className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              Programmable wallets.
            </h3>
            <p className="mb-6 mt-2 text-xl font-light text-zinc-500 dark:text-zinc-400">
              Live in the current beta.
            </p>
            <p className="font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              The beta supports programmable contract wallets for shared
              approvals, native transfers, Asset Hub asset transfers, and clear
              execution status on Asset Hub.
            </p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Blocks className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Proposal lifecycle you can follow
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Submit, approve, reach ready-to-execute, and execute through
                  one contract-backed proposal flow.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Layers className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Asset Hub token support
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Move native balances and supported Asset Hub assets through the
                  current programmable wallet flow.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Repeat className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Operator-managed setup
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Factory deployment and advanced contract tooling exist today,
                  but they should be treated as setup workflows rather than the
                  core end-user story.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
