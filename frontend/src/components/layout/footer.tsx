import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-10 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-950">ReviveSafe</div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Hackathon build path
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-500">
            &copy; 2026 ReviveSafe. Built around Dedot, LunoKit, `pallet_revive`
            writes, and asset-precompile flows.
          </p>
        </div>
      </div>
    </footer>
  );
}
