import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";

import { ReviveSafeBrand } from "@/components/brand/revivesafe-brand";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useTheme } from "@/hooks/useTheme";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "FAQ", href: "#faq" },
  { name: "Docs", href: null, disabled: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="hidden h-[54px] items-center rounded-full border border-black/6 bg-white/72 px-1.5 shadow-[0_16px_42px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-500 lg:flex dark:border-white/10 dark:bg-[#080808]/76 dark:shadow-[0_18px_48px_rgba(0,0,0,0.42)]">
          <Link
            to="/"
            className="group inline-flex h-10 items-center rounded-full px-4 transition-all duration-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          >
            <ReviveSafeBrand
              animateStarOnHover
              className="gap-3"
              logoClassName="h-7 w-auto"
              labelClassName="text-[1.4rem] leading-none"
            />
          </Link>

          <div className="mx-2 h-6 w-px bg-black/7 dark:bg-white/8" />

          <div className="flex items-center gap-1 pr-1">
            {navigation.map((item) =>
              item.disabled ? (
                <span
                  key={item.name}
                  className="inline-flex h-10 cursor-not-allowed items-center rounded-full px-4 text-sm font-medium text-zinc-400 dark:text-zinc-500"
                >
                  {item.name}
                </span>
              ) : (
                <a
                  key={item.name}
                  href={item.href ?? undefined}
                  className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-zinc-500 transition-colors hover:bg-black/[0.04] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  {item.name}
                </a>
              ),
            )}
          </div>
        </div>

        <Link
          to="/"
          className="group inline-flex w-fit items-center rounded-full border border-black/6 bg-white/74 px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 hover:bg-white/86 lg:hidden dark:border-white/10 dark:bg-[#080808]/78 dark:shadow-[0_18px_48px_rgba(0,0,0,0.45)] dark:hover:bg-[#101010]/84"
        >
          <ReviveSafeBrand
            animateStarOnHover
            className="gap-3"
            logoClassName="h-8 w-auto"
            labelClassName="text-lg font-medium tracking-tight"
          />
        </Link>

        <div className="flex items-center justify-end gap-3">
          <ConnectButton
            className="h-12"
            iconSectionClassName="h-12 px-3.5"
          />
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/6 bg-white/74 text-zinc-600 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 hover:bg-white/86 hover:text-zinc-900 dark:border-white/10 dark:bg-[#080808]/78 dark:text-zinc-300 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] dark:hover:bg-[#101010]/84 dark:hover:text-white"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white/74 text-zinc-600 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 hover:bg-white/86 hover:text-zinc-900 dark:border-white/10 dark:bg-[#080808]/78 dark:text-zinc-300 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] dark:hover:bg-[#101010]/84 dark:hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl lg:hidden">
          <div className="rounded-[28px] border border-black/6 bg-white/80 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-[#080808]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.45)]">
            <div className="space-y-2">
              {navigation.map((item) =>
                item.disabled ? (
                  <span
                    key={item.name}
                    className="block rounded-2xl px-3 py-2 text-sm font-medium text-zinc-400 dark:text-zinc-500"
                  >
                    {item.name}
                  </span>
                ) : (
                  <a
                    key={item.name}
                    href={item.href ?? undefined}
                    className="block rounded-2xl px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[0.04] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
