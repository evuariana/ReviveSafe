import { ArrowRight, Blocks, CheckCircle2, Layers, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { LandingCtaButtons } from "@/components/landing/cta-buttons";
import { FAQSection } from "@/components/landing/faq-section";

export function BottomSections() {
  return (
    <>
      <section id="flow" className="mx-auto mb-40 max-w-7xl scroll-mt-28 px-6">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-4xl dark:text-zinc-100">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-light text-zinc-500 dark:text-zinc-400">
            Shared wallet activity stays understandable from proposal to final
            execution.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            whileHover="hover"
            initial="initial"
            className="group flex flex-col items-center rounded-2xl border border-black/5 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="relative mb-6 flex h-32 w-full items-center justify-center">
              <div className="absolute inset-0 rounded-xl border border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02]" />
              <motion.div
                variants={{ initial: { y: 0 }, hover: { y: -5 } }}
                className="z-10 flex h-20 w-16 flex-col gap-2 rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]"
              >
                <div className="h-1.5 w-1/2 rounded-full bg-black/10 dark:bg-white/10" />
                <div className="h-1.5 w-3/4 rounded-full bg-black/10 dark:bg-white/10" />
                <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10" />
                <motion.div
                  variants={{ initial: { scale: 0.8, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
                  className="mt-auto self-end rounded-full bg-black p-1 dark:bg-white"
                >
                  <ArrowRight className="h-2.5 w-2.5 text-white dark:text-black" strokeWidth={2} />
                </motion.div>
              </motion.div>
            </div>
            <h4 className="mb-3 text-xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              1. Create or add
            </h4>
            <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Start with a new programmable contract wallet or add a compatible
              contract wallet your team already owns.
            </p>
          </motion.div>

          <motion.div
            whileHover="hover"
            initial="initial"
            className="group flex flex-col items-center rounded-2xl border border-black/5 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="relative mb-6 flex h-32 w-full items-center justify-center">
              <div className="absolute inset-0 rounded-xl border border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02]" />
              <div className="z-10 flex -space-x-3">
                <motion.div
                  variants={{ initial: { x: 0 }, hover: { x: -5 } }}
                  className="z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-100 shadow-sm dark:border-[#0a0a0a] dark:bg-zinc-800"
                >
                  <CheckCircle2 className="h-5 w-5 text-black dark:text-white" strokeWidth={2} />
                </motion.div>
                <motion.div
                  variants={{ initial: { x: 0 }, hover: { x: 5 } }}
                  className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-100 shadow-sm dark:border-[#0a0a0a] dark:bg-zinc-800"
                >
                  <CheckCircle2 className="h-5 w-5 text-black dark:text-white" strokeWidth={2} />
                </motion.div>
                <motion.div
                  variants={{ initial: { scale: 1 }, hover: { scale: 0.9, opacity: 0.5 } }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-white bg-zinc-50 dark:border-[#0a0a0a] dark:bg-zinc-900"
                >
                  <span className="text-xs font-mono text-zinc-400">?</span>
                </motion.div>
              </div>
            </div>
            <h4 className="mb-3 text-xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              2. Approve as a team
            </h4>
            <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Every action follows one clear proposal model, so approvers can
              see what will happen before they act.
            </p>
          </motion.div>

          <motion.div
            whileHover="hover"
            initial="initial"
            className="group flex flex-col items-center rounded-2xl border border-black/5 bg-white p-8 text-center dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <div className="relative mb-6 flex h-32 w-full items-center justify-center">
              <div className="absolute inset-0 rounded-xl border border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02]" />
              <motion.div
                variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }}
                className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg dark:bg-white"
              >
                <motion.div
                  variants={{ initial: { rotate: 0 }, hover: { rotate: 180 } }}
                  transition={{ duration: 0.4 }}
                >
                  <Layers className="h-5 w-5 text-white dark:text-black" strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            </div>
            <h4 className="mb-3 text-xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              3. Execute with confidence
            </h4>
            <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              When a proposal is ready, the team can see execution status and
              move forward without guesswork.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mb-40 max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
              Built for shared control, not tool sprawl.
            </h2>
            <p className="mb-8 mt-6 text-lg font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              ReviveSafe gives teams one approval and operations layer across
              programmable contract-wallet activity on Asset Hub. The current
              beta focuses on the flows that are already live: create, add,
              approve, and execute.
            </p>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-zinc-400" />
                Non-custodial contract wallet model
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-zinc-400" />
                Add compatible contract wallets to one workspace
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-zinc-400" />
                Explicit submit, approve, ready, execute lifecycle
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-zinc-50 p-8 shadow-inner dark:border-white/10 dark:bg-[#0a0a0a]">
            <div className="mb-6 flex items-center gap-4">
              <Shield className="h-8 w-8 text-zinc-900 dark:text-zinc-100" strokeWidth={1.5} />
              <div>
                <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  Honest control model
                </h4>
                <p className="text-sm text-zinc-500">Truthful scope before broad claims.</p>
              </div>
            </div>
            <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              ReviveSafe stays explicit about what this beta does today. The
              live flows are programmable contract wallets with owner approvals
              and execution on Asset Hub. Native wallet rails remain roadmap
              work, not shipped beta behavior.
            </p>
          </div>
        </div>
      </section>

      <FAQSection />

      <section className="relative mb-32 overflow-hidden border-y border-black/5 bg-black/[0.01] py-32 dark:border-white/5 dark:bg-white/[0.01]">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
              Trust and clarity, built in.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-zinc-500 dark:text-zinc-400">
              ReviveSafe should feel clear, serious, and understandable from the
              first screen to the final approval, especially while the beta
              scope stays narrow.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Blocks,
                title: "Compatible wallets only",
                body: "The add-wallet flow is limited to compatible ReviveSafe contract wallets and checks owner access before registration.",
              },
              {
                icon: Shield,
                title: "Open-source beta",
                body: "Use proof rooted in real product behavior and open code. No audit is linked in this repo today, so treat the contracts as unaudited.",
              },
              {
                icon: Layers,
                title: "Explicit lifecycle",
                body: "The live proposal flow is submit, approve, ready, and execute. That lifecycle should stay legible across the app and release docs.",
              },
            ].map(({ icon: Icon, title, body }, index) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-md dark:border-white/10 dark:bg-[#0a0a0a]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/[0.02]" />
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-black/5 bg-zinc-50 transition-transform duration-500 group-hover:scale-110 dark:border-white/10 dark:bg-zinc-900">
                  <Icon className="h-6 w-6 text-zinc-900 dark:text-zinc-100" strokeWidth={1.5} />
                </div>
                <h4 className="mb-3 text-xl font-display font-medium text-zinc-900 dark:text-zinc-100">
                  {title}
                </h4>
                <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mb-32 max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-display font-medium tracking-tight text-zinc-950 md:text-6xl dark:text-zinc-100">
          Ready to bring your team into one shared wallet workspace?
        </h2>
        <p className="mb-12 mt-8 text-xl font-light text-zinc-500 dark:text-zinc-400">
          Create a new programmable wallet or add a compatible contract wallet,
          then keep approvals, wallet operations, and visibility in one place.
        </p>
        <div className="flex justify-center">
          <LandingCtaButtons />
        </div>
      </section>
    </>
  );
}
