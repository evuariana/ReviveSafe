import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "@luno-kit/react";
import {
  BellRing,
  Inbox,
  LayoutDashboard,
  Moon,
  ScrollText,
  Sparkles,
  Sun,
  Wallet,
} from "lucide-react";

import { ReviveSafeBrand } from "@/components/brand/revivesafe-brand";
import { BetaSupportCard } from "@/components/layout/beta-support-card";
import { ChainConnectionBanner } from "@/components/layout/chain-connection-banner";
import {
  WorkspaceBadge,
  workspaceOutlineButtonClassName,
  workspacePanelClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { ChainSelector } from "@/components/wallet/chain-selector";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import { useTheme } from "@/hooks/useTheme";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Proposals", href: "/proposals", icon: BellRing },
  { name: "Activity", href: "/activity", icon: ScrollText },
];

function resolveNavigationPath(pathname: string) {
  if (pathname.startsWith("/wallet/")) {
    return "/wallets";
  }

  return pathname;
}

export default function DashboardLayout() {
  const { account } = useAccount();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const factoryAddress = useFactoryAddress((state) => state.factoryAddress);
  const resolvedPath = resolveNavigationPath(location.pathname);
  const currentItem =
    navigation.find((item) => resolvedPath === item.href) ?? navigation[0];

  if (!account) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_78%)] dark:opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[960px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-[110px] dark:bg-white/[0.03]" />
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-[320px] w-[320px] rounded-full bg-black/[0.03] blur-[120px] dark:bg-white/[0.02]" />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside
            className={`${workspacePanelClassName} p-5 backdrop-blur lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_26%)]" />

            <div className="relative z-10 flex items-center gap-3 border-b border-zinc-200/80 pb-5 dark:border-white/8">
              <ReviveSafeBrand
                className="gap-3"
                logoClassName="h-9 w-auto"
                labelClassName="text-lg font-semibold"
              />
            </div>

            <nav className="relative z-10 mt-6 space-y-2">
              {navigation.map((item) => {
                const isActive = resolvedPath === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300 ease-premium ${
                      isActive
                        ? "border border-black/10 bg-zinc-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white dark:text-black"
                        : "text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div
              className={`relative z-10 mt-6 p-4 text-sm text-zinc-600 dark:text-zinc-300 ${workspacePanelMutedClassName}`}
            >
              <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
                <Sparkles className="h-4 w-4" />
                Workspace actions
              </div>
              <p className="mt-3 leading-7">
                Import native multisigs, create programmable wallets, review
                shared approvals, and keep wallet activity in one workspace.
              </p>
              {factoryAddress && (
                <p className="mt-3 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                  Operator tools are mainly for factory setup and advanced
                  contract workflows. Most beta users only need Home, Wallets,
                  Inbox, Proposals, and Activity.
                </p>
              )}
            </div>

            <div className="relative z-10">
              <BetaSupportCard />
            </div>

            <div className="relative z-10 mt-6 grid gap-3">
              <Link to="/import">
                <Button className="h-11 w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  Import wallet
                </Button>
              </Link>
              <Link to="/create">
                <Button
                  variant="outline"
                  className={`h-11 w-full ${workspaceOutlineButtonClassName}`}
                >
                  Create programmable wallet
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  className={`h-11 w-full ${workspaceOutlineButtonClassName}`}
                >
                  Add contract wallet
                </Button>
              </Link>
              <Link to="/deploy">
                <Button
                  variant="outline"
                  className={`h-11 w-full ${workspaceOutlineButtonClassName}`}
                >
                  Open operator tools
                </Button>
              </Link>
            </div>
          </aside>

          <div className="flex-1">
            <div
              className={`relative mb-6 flex flex-col gap-4 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between ${workspacePanelClassName}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.06),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%)]" />

              <div className="relative z-10">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Workspace
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-lg font-semibold text-zinc-950 dark:text-white">
                    {currentItem.name}
                  </div>
                  <WorkspaceBadge>{currentItem.name}</WorkspaceBadge>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-3">
                <ChainSelector />
                <button
                  type="button"
                  className="rounded-full border border-black/10 bg-white/85 p-2 text-zinc-600 transition duration-300 ease-premium hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <ConnectButton />
              </div>
            </div>

            <ChainConnectionBanner />

            <main className={`${workspacePanelClassName} p-5 md:p-6`}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.04),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_22%)]" />
              <div className="relative z-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
