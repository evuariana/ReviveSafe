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
          Choose the wallet type that fits your team.
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light text-zinc-500 dark:text-zinc-400">
          Start with the wallet type that fits your team today. Stay native when
          simple shared control is enough, or choose programmable when you need
          richer wallet behavior.
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
              The simplest wallet type.
            </p>
            <p className="font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              Choose Native when your team wants the fastest path to reliable
              shared control. It is a strong long-term option for teams that
              need clear shared approvals without added setup complexity.
            </p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Lock className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Lower setup complexity
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  A straightforward way to create or import shared wallets on
                  Polkadot.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Wallet className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  First-class import
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Bring existing multisig and proxy wallets into one workspace
                  instead of starting over.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Globe className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Native shared control
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Use familiar Polkadot account-control patterns without making
                  the wallet feel like a developer tool.
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
              The extensible wallet type.
            </p>
            <p className="font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              Choose Programmable when your team needs richer rules, delegation,
              batching, automation, or more advanced wallet actions inside the
              same product.
            </p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Blocks className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Richer rules and modules
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Add behavior through modules and use more expressive approval
                  rules when simple thresholds are no longer enough.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Layers className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Batch and advanced actions
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Handle more complex wallet behavior without breaking the shared
                  proposal model.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <Repeat className="h-5 w-5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                  Delegation and automation
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Unlock richer team workflows when the wallet needs more than
                  standard shared approvals.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
