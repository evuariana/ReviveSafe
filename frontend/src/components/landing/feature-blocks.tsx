import { type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Layers,
  Shield,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import { useLandingActions } from "@/components/landing/use-landing-actions";

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function InlineAnchorLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export function FeatureBlocks() {
  const { handleImport } = useLandingActions();

  return (
    <section id="features" className="mx-auto mb-40 max-w-7xl px-6">
      <div className="mb-16">
        <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
          Engineered for Asset Hub.
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light text-zinc-500 dark:text-zinc-400">
          Manage shared assets, approvals, and advanced wallet actions in one
          place, starting simple and growing into richer control when your team
          needs it.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <motion.div
          variants={fadeUp}
          whileHover="hover"
          initial="initial"
          className="group relative flex h-[420px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20"
        >
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-black/[0.02] blur-[80px] transition-colors duration-700 group-hover:bg-black/[0.04] dark:bg-white/[0.02] dark:group-hover:bg-white/[0.04]" />
          <div className="relative z-10">
            <CheckCircle2 className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              Clear approvals
            </h3>
            <p className="mb-10 mt-3 max-w-md font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Clear proposal summaries and human-readable action detail help the
              team understand what will happen before anyone approves.
            </p>

            <div className="mt-auto flex max-w-sm flex-col gap-3">
              {[
                ["DOT transfer", "12,450.00", "bg-emerald-500"],
                ["USDC transfer", "84,000.00", "bg-blue-500"],
              ].map(([label, amount, color], index) => (
                <motion.div
                  key={label}
                  variants={{ hover: { x: 5 } }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between border-b border-black/5 py-3 dark:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${color}`} />
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
                    {amount}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileHover="hover"
          initial="initial"
          className="group relative flex h-[520px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20"
        >
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-black/[0.02] blur-[80px] transition-colors duration-700 group-hover:bg-black/[0.04] dark:bg-white/[0.02] dark:group-hover:bg-white/[0.04]" />
          <div className="relative z-10">
            <Layers className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              Polkadot-native actions
            </h3>
            <p className="mb-6 mt-3 max-w-md font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Manage Asset Hub assets and other Polkadot-native actions through
              one clear proposal flow, with wallet context, approvals, and
              execution status visible at every step.
            </p>
            <InlineAnchorLink href="#proposal-model">See supported actions</InlineAnchorLink>
          </div>

          <div className="relative z-10 mt-auto flex h-full items-center justify-center pt-8">
            <div className="relative w-full max-w-[280px] -translate-x-12">
              <div className="relative z-10 space-y-2 rounded-xl border border-black/5 bg-zinc-50 p-3 dark:border-white/10 dark:bg-[#111]">
                {["DOT", "USDC", "GOV"].map((label, index) => (
                  <motion.div
                    key={label}
                    variants={{ hover: { x: index === 1 ? -8 : 0 } }}
                    className="relative flex h-8 items-center rounded border border-black/5 bg-white px-3 dark:border-white/5 dark:bg-[#1a1a1a]"
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/20">
                      <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    </div>
                    <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: index === 0 ? "4rem" : index === 1 ? "5rem" : "3rem" }} />
                    {index === 1 && (
                      <motion.div
                        variants={{ hover: { opacity: 1, x: 16 } }}
                        initial={{ opacity: 0, x: 0 }}
                        className="absolute left-full top-1/2 ml-2 flex w-32 -translate-y-1/2 flex-col gap-2 rounded-lg border border-indigo-500/20 bg-white p-2 shadow-lg dark:bg-[#1a1a1a]"
                      >
                        <div className="h-1.5 w-12 rounded bg-indigo-500/20" />
                        <div className="flex gap-1">
                          {[1, 2, 3].map((dot) => (
                            <div key={dot} className="h-2 w-2 rounded-full bg-indigo-500/50" />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-1/2 -translate-y-1/2 text-indigo-500/50"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileHover="hover"
          initial="initial"
          className="group relative flex h-[520px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20 md:-mt-[100px]"
        >
          <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-black/[0.02] blur-[80px] transition-colors duration-700 group-hover:bg-black/[0.04] dark:bg-white/[0.02] dark:group-hover:bg-white/[0.04]" />
          <div className="relative z-10">
            <Download className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              Existing contract wallets
            </h3>
            <p className="mb-6 mt-3 max-w-md font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Add an already deployed compatible contract wallet to your
              workspace and keep proposal review, approvals, and execution in
              one place. Native multisig and proxy import are not live in this
              beta.
            </p>
            <button
              type="button"
              onClick={handleImport}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              See add-wallet flow
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative z-10 mt-auto flex h-full items-end justify-center pt-8">
            <div className="relative h-32 w-full max-w-[300px]">
              <motion.div
                variants={{ hover: { borderColor: "rgba(16, 185, 129, 0.4)" } }}
                className="absolute inset-0 flex items-end justify-center rounded-xl border-2 border-dashed border-black/10 bg-zinc-50/50 pb-2 dark:border-white/10 dark:bg-[#111]/50"
              >
                <span className="text-xs font-medium text-zinc-400">Workspace</span>
              </motion.div>

              <motion.div
                variants={{ hover: { y: 20, scale: 0.95 } }}
                initial={{ y: -40, scale: 1 }}
                className="absolute left-1/2 top-0 z-10 w-48 -translate-x-1/2 rounded-lg border border-black/10 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#1a1a1a]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-zinc-400" />
                  <div className="h-2 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>

                <div className="mb-3 flex flex-wrap gap-1">
                  <div className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Confirmed
                  </div>
                  <div className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                    Reconstructed
                  </div>
                </div>

                <div className="flex gap-1">
                  <motion.div
                    variants={{ hover: { backgroundColor: "#10b981", borderColor: "#10b981" } }}
                    className="h-4 w-4 rounded-full border border-zinc-300 bg-transparent dark:border-zinc-700"
                  />
                  <div className="h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileHover="hover"
          initial="initial"
          className="group relative flex h-[420px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20"
        >
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-black/[0.02] blur-[80px] transition-colors duration-700 group-hover:bg-black/[0.04] dark:bg-white/[0.02] dark:group-hover:bg-white/[0.04]" />
          <div className="relative z-10">
            <ArrowUpRight className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              What comes after the beta
            </h3>
            <p className="mb-6 mt-3 max-w-md font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Native shared-wallet support, richer rules, delegation, batching,
              and guided upgrade flows are part of the ReviveSafe roadmap. The
              live beta today is focused on programmable contract wallets.
            </p>
            <InlineAnchorLink href="#wallet-types">See beta scope</InlineAnchorLink>
          </div>

          <div className="relative z-10 mt-auto flex h-full items-center justify-center pt-8">
            <div className="relative flex w-full max-w-[320px] items-center justify-between">
              <div className="relative z-10 flex w-24 flex-col items-center rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
                <Shield className="mb-2 h-6 w-6 text-zinc-400" strokeWidth={1.5} />
                <div className="mb-1 h-1.5 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
                <span className="absolute -bottom-5 text-[9px] font-medium text-zinc-400">
                  Native
                </span>
              </div>

              <div className="absolute left-24 right-24 top-1/2 z-0 h-px -translate-y-1/2 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <motion.div
                  variants={{ hover: { x: "100%" } }}
                  initial={{ x: "-100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="h-full w-full bg-orange-500"
                />
              </div>

              <motion.div
                variants={{ hover: { scale: 1.08 } }}
                className="relative z-10 flex w-28 flex-col items-center rounded-lg border border-black/10 bg-white p-3 shadow-md dark:border-white/10 dark:bg-[#1a1a1a]"
              >
                <Zap className="mb-2 h-6 w-6 text-orange-500" strokeWidth={1.5} />
                <div className="mb-1 h-1.5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                <span className="absolute -bottom-5 text-[9px] font-medium text-orange-500">
                  Programmable
                </span>

                {["bg-blue-500", "bg-emerald-500", "bg-violet-500"].map((color, index) => (
                  <motion.div
                    key={color}
                    variants={{ hover: { opacity: 1, scale: 1 } }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`absolute flex h-5 w-5 items-center justify-center rounded border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#222] ${
                      index === 0
                        ? "-right-2 -top-2"
                        : index === 1
                          ? "-right-3 top-4"
                          : "-bottom-2 -right-1"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${color}`} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
