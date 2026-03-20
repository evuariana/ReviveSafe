import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowRightLeft, Settings, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    id: "transfers",
    title: "Asset transfers",
    description:
      "Send DOT, stablecoins, or other supported assets through one proposal flow with clear summaries and visible status.",
  },
  {
    id: "members",
    title: "Member changes",
    description:
      "Add or remove members through the same proposal model your team already uses for shared approvals.",
  },
  {
    id: "rules",
    title: "Rule updates",
    description:
      "Update approval rules and wallet behavior without switching into a separate configuration tool.",
  },
];

function FeatureTitle({
  feature,
  setActiveFeature,
  activeFeature,
}: {
  feature: (typeof features)[0];
  setActiveFeature: (id: string) => void;
  activeFeature: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setActiveFeature(feature.id);
    }
  }, [feature.id, isInView, setActiveFeature]);

  const isActive = activeFeature === feature.id;

  return (
    <div
      ref={ref}
      className={`flex flex-col justify-center space-y-4 py-32 transition-all duration-500 ${
        isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-30"
      }`}
    >
      <h4 className="text-2xl font-display font-medium text-zinc-900 md:text-4xl dark:text-zinc-100">
        {feature.title}
      </h4>
      <p className="max-w-md text-lg font-light leading-relaxed text-zinc-500 md:text-xl dark:text-zinc-400">
        {feature.description}
      </p>
    </div>
  );
}

function FeatureCard({
  id,
  activeFeature,
  children,
}: {
  id: string;
  activeFeature: string | null;
  children: ReactNode;
}) {
  const isActive = activeFeature === id;

  return (
    <div
      className={`absolute inset-0 flex h-full w-full items-center justify-center p-8 transition-opacity duration-500 ${
        isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
      }`}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: isActive ? 1 : 0.8, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ProposalsSection() {
  const [activeFeature, setActiveFeature] = useState<string | null>("transfers");

  return (
    <section id="proposal-model" className="relative mb-40 scroll-mt-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-16 pt-24">
          <h2 className="text-3xl font-display font-medium tracking-tight text-zinc-950 md:text-5xl dark:text-zinc-100">
            Proposals made simple.
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-light text-zinc-500 dark:text-zinc-400">
            A proposal is the universal interaction model in ReviveSafe. Whether
            the team is transferring funds, changing members, or updating rules,
            the flow stays clear: propose, approve, execute.
          </p>
        </div>

        <div className="flex flex-col items-start gap-20 md:flex-row">
          <div className="w-full py-[50vh] md:w-1/2">
            <ul>
              {features.map((feature) => (
                <li key={feature.id}>
                  <FeatureTitle
                    activeFeature={activeFeature}
                    feature={feature}
                    setActiveFeature={setActiveFeature}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="sticky top-0 hidden h-screen w-full items-center justify-center md:flex md:w-1/2">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-[#0a0a0a]">
              <FeatureCard id="transfers" activeFeature={activeFeature}>
                <div className="w-full max-w-sm rounded-xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-500">Transfer</span>
                    <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100">
                      5,000 DOT
                    </span>
                  </div>
                  <div className="mb-6 h-px w-full bg-black/5 dark:bg-white/5" />
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                      <ArrowRightLeft className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-black/5 dark:bg-white/5" />
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard id="members" activeFeature={activeFeature}>
                <div className="w-full max-w-sm rounded-xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-500">Add member</span>
                    <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100">
                      14Gz...9xQw
                    </span>
                  </div>
                  <div className="mb-6 h-px w-full bg-black/5 dark:bg-white/5" />
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                      <Users className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-black/5 dark:bg-white/5" />
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard id="rules" activeFeature={activeFeature}>
                <div className="w-full max-w-sm rounded-xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-500">
                      Update approval rule
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-zinc-400 line-through">
                        2 / 3
                      </span>
                      <ArrowRight className="h-3 w-3 text-zinc-400" />
                      <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100">
                        3 / 5
                      </span>
                    </div>
                  </div>
                  <div className="mb-6 h-px w-full bg-black/5 dark:bg-white/5" />
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                      <Settings className="h-4 w-4 text-blue-500" strokeWidth={1.5} />
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-black/5 dark:bg-white/5" />
                  </div>
                </div>
              </FeatureCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
