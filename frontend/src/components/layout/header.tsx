import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Moon, Shield, Sun, X } from "lucide-react";

import { ChainSelector } from "@/components/wallet/chain-selector";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useTheme } from "@/hooks/useTheme";

const navigation = [
  { name: "Overview", href: "#overview" },
  { name: "Features", href: "#features" },
  { name: "Contracts", href: "#contracts" },
  { name: "How It Works", href: "#flow" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/82 backdrop-blur-xl transition-colors duration-500 dark:border-white/8 dark:bg-[#050505]/82">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-black shadow-sm transition-colors duration-500 dark:border-white/10 dark:bg-white dark:shadow-[0_0_24px_rgba(255,255,255,0.08)]">
            <Shield className="h-5 w-5" />
          </div>
          <div className="text-lg font-bold tracking-tight text-zinc-950 transition-colors duration-500 dark:text-white">
            ReviveSafe
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ChainSelector />
          </div>
          <button
            type="button"
            className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <ConnectButton />
          <button
            type="button"
            className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 lg:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-5 dark:border-white/8 dark:bg-[#050505] lg:hidden">
          <div className="mb-4">
            <ChainSelector />
          </div>
          <div className="space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Link
              to="/deploy"
              className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Open contract tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
