import { Link } from "react-router-dom";

import { ReviveSafeBrand } from "@/components/brand/revivesafe-brand";
import { releaseDocs, supportLabel, supportUrl } from "@/config/release";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 transition-colors duration-500 dark:border-white/8 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex items-center space-x-3">
          <div>
            <ReviveSafeBrand
              className="gap-3"
              logoClassName="h-8 w-auto"
              labelClassName="text-lg font-semibold"
            />
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Contract wallet beta for approvals, transfers, and execution on
              Asset Hub.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 md:mt-0 md:items-end">
          <div className="flex flex-wrap justify-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              Features
            </a>
            <a href="#faq" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              FAQ
            </a>
            <a
              href={releaseDocs.readinessUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            >
              Docs
            </a>
            <a
              href={supportUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            >
              {supportLabel}
            </a>
            <Link to="/dashboard" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              Open app
            </Link>
          </div>
          <p className="text-center text-xs leading-5 text-zinc-500 md:text-right">
            &copy; 2026 ReviveSafe. Current beta scope: contract wallets on
            Asset Hub with submit, approve, ready, and execute flow.
          </p>
        </div>
      </div>
    </footer>
  );
}
