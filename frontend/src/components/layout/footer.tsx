import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 transition-colors duration-500 dark:border-white/8 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-black transition-colors duration-500 dark:border-white/10 dark:bg-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-zinc-950 transition-colors duration-500 dark:text-white">
              ReviveSafe
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 md:mt-0 md:items-end">
          <div className="flex flex-wrap justify-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              Features
            </a>
            <a href="#contracts" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              Contract tools
            </a>
            <a href="#flow" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              How it works
            </a>
            <Link to="/deploy" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              Open app
            </Link>
          </div>
          <p className="text-center text-xs leading-5 text-zinc-500 md:text-right">
            &copy; 2026 ReviveSafe. Shared wallets, asset-precompile transfers,
            and contract tools for Polkadot Asset Hub and PVM.
          </p>
        </div>
      </div>
    </footer>
  );
}
