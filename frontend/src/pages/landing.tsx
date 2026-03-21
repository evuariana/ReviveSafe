import { BottomSections } from "@/components/landing/bottom-sections";
import { FeatureBlocks } from "@/components/landing/feature-blocks";
import { HeroSection } from "@/components/landing/hero-section";
import { ProposalsSection } from "@/components/landing/proposals-section";
import { WalletTypesSection } from "@/components/landing/wallet-types-section";
import { WorkspaceSection } from "@/components/landing/workspace-section";
import { PublicBetaNotice } from "@/components/layout/public-beta-notice";

export default function Landing() {
  return (
    <div className="relative bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)] dark:opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-[100px] dark:bg-white/[0.03]" />
      <div className="pointer-events-none absolute inset-x-0 top-[32rem] h-[40rem] bg-gradient-to-b from-transparent via-black/[0.02] to-transparent dark:via-white/[0.02]" />

      <div className="relative">
        <HeroSection />
        <div className="mx-auto mb-24 max-w-5xl px-6">
          <PublicBetaNotice compact />
        </div>
        <WorkspaceSection />
        <WalletTypesSection />
        <FeatureBlocks />
        <ProposalsSection />
        <BottomSections />
      </div>
    </div>
  );
}
