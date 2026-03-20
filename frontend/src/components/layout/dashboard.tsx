import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "@luno-kit/react";
import {
  LayoutDashboard,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Upload,
  UserPlus,
  Wallet,
} from "lucide-react";

import { MappingGate } from "@/components/wallet/mapping-gate";
import { Button } from "@/components/ui/button";
import { ChainSelector } from "@/components/wallet/chain-selector";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useTheme } from "@/hooks/useTheme";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Create", href: "/create", icon: Shield },
  { name: "Add Wallet", href: "/register", icon: UserPlus },
  { name: "Contracts", href: "/deploy", icon: Upload },
];

export default function DashboardLayout() {
  const { account } = useAccount();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const currentItem =
    navigation.find((item) => location.pathname === item.href) ?? navigation[0];

  if (!account) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_78%)] dark:opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[960px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-[110px] dark:bg-white/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[30px] border border-zinc-200 bg-white/88 p-5 shadow-[0_18px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] dark:border-white/10 dark:bg-[#0b0b0b]/88 dark:shadow-[0_0_60px_rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-5 dark:border-white/8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-black shadow-sm dark:border-white/10 dark:bg-white dark:shadow-[0_0_24px_rgba(255,255,255,0.08)]">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-lg font-semibold text-zinc-950 dark:text-white">
                ReviveSafe
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "border border-zinc-200 bg-zinc-950 text-white dark:border-white/10 dark:bg-white dark:text-black"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
              <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
                <Sparkles className="h-4 w-4" />
                Workspace actions
              </div>
              <p className="mt-2 leading-7">
                Create wallets, add existing ones, review proposals, and open
                contract tools without switching products.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <Link to="/create">
                <Button className="h-11 w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  Create wallet
                </Button>
              </Link>
              <Link to="/deploy">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  Open contracts
                </Button>
              </Link>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white/88 p-4 shadow-[0_18px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#0b0b0b]/88 dark:shadow-[0_0_60px_rgba(255,255,255,0.04)]">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Workspace
                </div>
                <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                  {currentItem.name}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <ChainSelector />
                <button
                  type="button"
                  className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <ConnectButton />
              </div>
            </div>

            <MappingGate>
              <main className="rounded-[30px] border border-zinc-200 bg-white/86 p-6 shadow-[0_18px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-[#0b0b0b]/88 dark:shadow-[0_0_60px_rgba(255,255,255,0.04)]">
                <Outlet />
              </main>
            </MappingGate>
          </div>
        </div>
      </div>
    </div>
  );
}
