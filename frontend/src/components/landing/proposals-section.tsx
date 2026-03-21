import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowRightLeft, Settings, Users } from "lucide-react";

const features = [
  {
    id: "transfers",
    eyebrow: "Proposal type 01",
    title: "Asset transfers",
    description:
      "Send DOT, stablecoins, or other supported assets through one proposal flow with clear summaries and visible status.",
  },
  {
    id: "members",
    eyebrow: "Proposal type 02",
    title: "Member changes",
    description:
      "Add or remove members through the same proposal model your team already uses for shared approvals.",
  },
  {
    id: "rules",
    eyebrow: "Proposal type 03",
    title: "Rule updates",
    description:
      "Update approval rules and wallet behavior without switching into a separate configuration tool.",
  },
] as const;

type Feature = (typeof features)[number];

const DESKTOP_STAGE_HEIGHT = "min(520px, calc(100vh - 180px))";
const DESKTOP_CARD_SHELL_HEIGHT = "calc(100vh - 4rem)";
const CARD_STACK_OFFSET = 26;
const CARD_SCALE_STEP = 0.04;

function ProposalTextStage({ feature }: { feature: Feature }) {
  return (
    <div className="max-w-xl space-y-5">
      <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
        {feature.eyebrow}
      </div>
      <h3 className="text-4xl font-display font-medium tracking-tight text-zinc-950 dark:text-zinc-100 xl:text-5xl">
        {feature.title}
      </h3>
      <p className="max-w-lg text-lg font-light leading-relaxed text-zinc-500 dark:text-zinc-400 xl:text-xl">
        {feature.description}
      </p>
    </div>
  );
}

function TransferCard() {
  return (
    <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111] dark:shadow-[0_0_40px_rgba(255,255,255,0.04)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Transfer
          </div>
          <div className="mt-2 text-2xl font-mono text-zinc-950 dark:text-zinc-100">
            5,000 DOT
          </div>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Ready for approval
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-zinc-50 p-5 dark:border-white/5 dark:bg-[#0b0b0b]">
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>From shared wallet</span>
          <span className="font-mono">0x91AA...40f7</span>
        </div>

        <div className="my-5 h-px w-full bg-black/5 dark:bg-white/5" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
            <ArrowRightLeft className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
          </div>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
            <motion.div
              animate={{ x: ["-110%", "110%"] }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-y-0 left-0 w-24 rounded-full bg-zinc-900 dark:bg-white"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Destination</span>
          <span className="font-mono">14Gz...9xQw</span>
        </div>
      </div>
    </div>
  );
}

function MembersCard() {
  return (
    <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111] dark:shadow-[0_0_40px_rgba(255,255,255,0.04)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Add member
          </div>
          <div className="mt-2 text-lg font-mono text-zinc-950 dark:text-zinc-100">
            14Gz...9xQw
          </div>
        </div>
        <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
          Draft proposal
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-zinc-50 p-5 dark:border-white/5 dark:bg-[#0b0b0b]">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Current members</div>
        <div className="mt-4 flex flex-wrap gap-3">
          {["0xBc19...173b6", "0x4cF2...19b2", "0x91AA...40f7"].map((member) => (
            <div
              key={member}
              className="rounded-full border border-black/5 bg-white px-3 py-2 text-sm font-mono text-zinc-600 dark:border-white/8 dark:bg-[#121212] dark:text-zinc-300"
            >
              {member}
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-mono text-emerald-600 dark:text-emerald-400"
          >
            + 14Gz...9xQw
          </motion.div>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/8 dark:bg-[#121212]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
            <Users className="h-4 w-4 text-emerald-500" strokeWidth={1.6} />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Member updates follow the same approval queue as transfers and other wallet actions.
          </div>
        </div>
      </div>
    </div>
  );
}

function RulesCard() {
  return (
    <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111] dark:shadow-[0_0_40px_rgba(255,255,255,0.04)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Update approval rule
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-mono text-zinc-400 line-through">2 / 3</span>
            <ArrowRight className="h-4 w-4 text-zinc-400" />
            <span className="text-lg font-mono text-zinc-950 dark:text-zinc-100">3 / 5</span>
          </div>
        </div>
        <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          Needs review
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-zinc-50 p-5 dark:border-white/5 dark:bg-[#0b0b0b]">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
            <Settings className="h-4 w-4 text-blue-500" strokeWidth={1.6} />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Adjust wallet rules without switching into a separate admin surface.
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/8 dark:bg-[#121212]">
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>Default approvals</span>
              <span className="font-mono text-zinc-950 dark:text-zinc-100">3 / 5</span>
            </div>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.div
                  key={value}
                  initial={{ scaleX: value <= 2 ? 1 : 0.3, opacity: value <= 2 ? 0.4 : 0.2 }}
                  animate={{
                    scaleX: 1,
                    opacity: value <= 3 ? 1 : 0.25,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: value * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`h-2 flex-1 rounded-full ${
                    value <= 3 ? "bg-zinc-950 dark:bg-white" : "bg-black/8 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/8 dark:bg-[#121212]">
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>High-value transfers</span>
              <span className="font-mono text-zinc-950 dark:text-zinc-100">4 / 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalPreviewCard({ featureId }: { featureId: Feature["id"] }) {
  return (
    <div className="flex w-full justify-center">
      {featureId === "transfers" && <TransferCard />}
      {featureId === "members" && <MembersCard />}
      {featureId === "rules" && <RulesCard />}
    </div>
  );
}

function ProposalStageCard({
  feature,
}: {
  feature: Feature;
}) {
  return (
    <div
      className="overflow-hidden rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_18px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_60px_rgba(255,255,255,0.04)] lg:p-8 xl:p-10"
      style={{ height: DESKTOP_STAGE_HEIGHT }}
    >
      <div className="grid h-full grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-8 xl:gap-10">
        <div className="flex h-full items-center pr-4">
          <ProposalTextStage feature={feature} />
        </div>

        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[28px] border border-black/5 bg-zinc-50 p-6 dark:border-white/10 dark:bg-[#050505] lg:p-8">
          <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/[0.04] blur-[100px] dark:bg-white/[0.04]" />
          <div className="relative z-10 flex w-full items-center justify-center">
            <ProposalPreviewCard featureId={feature.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopProposalCard({
  feature,
  index,
  total,
  progress,
  prefersReducedMotion,
}: {
  feature: Feature;
  index: number;
  total: number;
  progress: MotionValue<number>;
  prefersReducedMotion: boolean;
}) {
  const targetScale = 1 - (total - index - 1) * CARD_SCALE_STEP;
  const rangeStart = index * 0.25;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-28 flex items-start justify-center"
      style={{ height: DESKTOP_CARD_SHELL_HEIGHT }}
    >
      <motion.div
        className="relative origin-top will-change-transform"
        style={{
          top: `${index * CARD_STACK_OFFSET}px`,
          scale: prefersReducedMotion ? 1 : scale,
        }}
      >
        <ProposalStageCard feature={feature} />
      </motion.div>
    </div>
  );
}

function DesktopProposalStack() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative">
      {features.map((feature, index) => (
        <DesktopProposalCard
          key={feature.id}
          feature={feature}
          index={index}
          total={features.length}
          progress={scrollYProgress}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}

export function ProposalsSection() {
  return (
    <section id="proposal-model" className="relative mb-24 scroll-mt-28 md:mb-28">
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

        <div className="md:hidden">
          <div className="space-y-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="space-y-5 rounded-[28px] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-[#0a0a0a]"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
                  {feature.eyebrow}
                </div>
                <h3 className="text-2xl font-display font-medium tracking-tight text-zinc-950 dark:text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-base font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {feature.description}
                </p>
                <ProposalPreviewCard featureId={feature.id} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <DesktopProposalStack />
        </div>
      </div>
    </section>
  );
}
