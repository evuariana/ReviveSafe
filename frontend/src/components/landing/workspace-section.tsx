import { LayoutDashboard, ListTodo, ShieldAlert, Users } from "lucide-react";
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function WorkspaceSection() {
  return (
    <section className="mx-auto mb-40 max-w-7xl px-6">
      <div className="mb-16">
        <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
          One workspace for the shared wallets your team already runs.
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light text-zinc-500 dark:text-zinc-400">
          See what needs action, which native or programmable wallets matter,
          and what changed recently without switching between disconnected
          tools.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <motion.div
          variants={fadeUp}
          className="group md:col-span-2 flex flex-col rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20"
        >
          <LayoutDashboard className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
          <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
            Unified dashboard
          </h3>
          <p className="mb-10 mt-3 max-w-md font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
            View imported native multisigs and programmable contract wallets in
            one place, with queues, proposals, and wallet context kept
            together.
          </p>
          <div className="mt-auto flex h-40 gap-4 rounded-xl border border-black/5 bg-zinc-50 p-4 dark:border-white/5 dark:bg-[#111]">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-full w-1/3 flex-col gap-2 rounded-lg border border-black/5 bg-white p-3 dark:border-white/5 dark:bg-[#1a1a1a]"
              >
                <div className="mb-2 h-8 w-8 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/5" />
                <div className="h-2 w-2/3 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="mt-auto h-2 w-1/2 rounded-full bg-black/5 dark:bg-white/5" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="group flex flex-col rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20"
        >
          <ListTodo className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
          <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
            Action queues
          </h3>
          <p className="mb-8 mt-3 font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
            Keep approvals, ready-to-execute proposals, and wallet notices in a
            single action surface.
          </p>
          <div className="mt-auto flex flex-col gap-2">
            {[
              ["Pending approval", "bg-amber-500"],
              ["Ready to execute", "bg-emerald-500"],
            ].map(([label, color]) => (
              <div
                key={label}
                className="flex h-10 items-center gap-3 rounded-lg border border-black/5 bg-zinc-50 px-3 dark:border-white/5 dark:bg-[#111]"
              >
                <div className={`h-3 w-3 rounded-full ${color}`} />
                <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="group flex flex-col rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20"
        >
          <Users className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
          <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
            Team context
          </h3>
          <p className="mb-8 mt-3 font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
            Keep members, approval thresholds, and connected participants
            visible across the wallets your team operates together.
          </p>
          <div className="mt-auto flex -space-x-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-100 shadow-sm dark:border-[#0a0a0a] dark:bg-[#1a1a1a]"
              >
                <Users className="h-4 w-4 text-zinc-400" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="group md:col-span-2 flex flex-col gap-8 rounded-2xl border border-black/5 bg-white p-8 transition-colors duration-500 hover:border-black/10 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20 md:flex-row md:items-center"
        >
          <div className="flex-1">
            <ShieldAlert className="mb-6 h-6 w-6 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
            <h3 className="text-2xl font-display font-medium text-zinc-900 dark:text-zinc-100">
              Execution clarity
            </h3>
            <p className="mt-3 font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Keep approval thresholds and ready-to-execute state easy to
              understand instead of buried in raw transaction details.
            </p>
          </div>

          <div className="h-32 w-full rounded-xl border border-black/5 bg-zinc-50 p-4 dark:border-white/5 dark:bg-[#111] md:w-64">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Current threshold</span>
              <span className="rounded border border-black/5 bg-white px-2 py-1 text-sm font-mono dark:border-white/5 dark:bg-[#1a1a1a]">
                2 / 3
              </span>
            </div>
            <div className="my-4 h-px bg-black/5 dark:bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Execution status</span>
              <span className="rounded border border-black/5 bg-white px-2 py-1 text-sm font-mono dark:border-white/5 dark:bg-[#1a1a1a]">
                Ready
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
