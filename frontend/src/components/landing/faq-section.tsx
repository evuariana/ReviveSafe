import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "Will this work for my team?",
    answer:
      "ReviveSafe is built for teams that need shared control over funds, operations, and on-chain actions on Polkadot.",
  },
  {
    question: "Do I need a Programmable Wallet?",
    answer:
      "No. You can import a direct native multisig today. Use a programmable wallet when you need a new contract wallet or contract-backed proposal flows. Native wallet creation and proxy support are still out of scope in this beta.",
  },
  {
    question: "Can I import the wallets my team already uses?",
    answer:
      "Yes for direct native multisigs if you know the exact members and threshold. ReviveSafe derives the deterministic wallet address and checks the connected signer is a direct member. Compatible ReviveSafe contract wallets can also still be added. Proxy import is not live yet.",
  },
  {
    question: "What happens if some wallet history cannot be recovered?",
    answer:
      "The wallet is still usable. ReviveSafe clearly shows what is confirmed from chain data, what was reconstructed from available history, and what still needs review.",
  },
  {
    question: "Is this a new chain or a separate wallet system?",
    answer:
      "No. ReviveSafe uses Asset Hub networks and connected Polkadot wallets. The current beta adds a programmable contract-wallet layer for approvals and execution; it is not a separate chain.",
  },
  {
    question: "Is this production-ready custody software?",
    answer:
      "No. ReviveSafe is still a beta. No contract audit is linked in this repo today, so treat the contracts as unaudited, verify the selected network and factory, and use beta-appropriate funds only.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto mb-40 max-w-3xl scroll-mt-28 px-6">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
          Common questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={faq.question}
              initial={false}
              animate={{
                backgroundColor: isOpen ? "rgba(0,0,0,0.02)" : "transparent",
              }}
              className={`rounded-2xl border transition-colors duration-300 ${
                isOpen
                  ? "border-black/10 dark:border-white/10 dark:bg-white/[0.02]"
                  : "border-transparent hover:border-black/5 dark:hover:border-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between px-6 py-6 text-left focus:outline-none"
              >
                <span
                  className={`text-lg font-medium transition-colors ${
                    isOpen
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]"
                      : "border-black/5 bg-zinc-50 group-hover:bg-white dark:border-white/5 dark:bg-[#0a0a0a] dark:group-hover:bg-[#111]"
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                    ) : (
                      <Plus className="h-4 w-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                    )}
                  </motion.div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pr-12 font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
