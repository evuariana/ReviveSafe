import { Link, Outlet, useLocation } from "react-router-dom";
import { ConnectionStatus, useAccount, useStatus } from "@luno-kit/react";
import {
  BellRing,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
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
  if (
    pathname.startsWith("/wallet/") ||
    pathname === "/create" ||
    pathname === "/import" ||
    pathname === "/register"
  ) {
    return "/wallets";
  }

  if (pathname === "/deploy") {
    return "/dashboard";
  }

  return pathname;
}

function resolvePagePath(pathname: string) {
  if (pathname.startsWith("/wallet/")) {
    return "/wallet/:address";
  }

  return pathname;
}

const pageTitles: Record<string, string> = {
  "/activity": "Activity",
  "/create": "Create wallet",
  "/dashboard": "Home",
  "/deploy": "Operator tools",
  "/import": "Import wallet",
  "/inbox": "Inbox",
  "/proposals": "Proposals",
  "/register": "Add contract wallet",
  "/wallet/:address": "Wallet details",
  "/wallets": "Wallets",
};

const pageDescriptions: Record<string, string> = {
  "/activity": "Review recent wallet changes without mixing them into the live work queue.",
  "/create":
    "Set up a new programmable shared wallet with the owners and threshold your team needs.",
  "/dashboard":
    "Start here for the cross-wallet summary: setup, approvals waiting on you, and active wallets.",
  "/deploy":
    "Operator tools for contract deployment, registration, and advanced beta setup.",
  "/import":
    "Add a native multisig your team already uses by entering the exact signer list and threshold.",
  "/inbox":
    "Use Inbox like a shared to-do list for approvals, updates, and wallet notices.",
  "/proposals":
    "See all open approvals and ready-to-execute items in one queue.",
  "/register":
    "Add an existing compatible programmable wallet to this workspace.",
  "/wallet/:address":
    "Open one wallet at a time to review balances, members, proposals, and recent activity.",
  "/wallets":
    "Open any native or programmable wallet you have added to this workspace.",
};

function WorkspaceSessionGate({
  isRestoring,
  pageName,
}: {
  isRestoring: boolean;
  pageName: string;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,400px)] 2xl:grid-cols-[minmax(0,1.24fr)_minmax(360px,440px)] 2xl:gap-8">
      <div className={`${workspacePanelMutedClassName} p-6 md:p-8`}>
        <WorkspaceBadge tone={isRestoring ? "sky" : "amber"}>
          {isRestoring ? "Restoring session" : "Connect wallet"}
        </WorkspaceBadge>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-zinc-950 dark:text-white">
          {isRestoring
            ? "Opening your workspace"
            : `Connect to open ${pageName.toLowerCase()}`}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
          {isRestoring
            ? "ReviveSafe is checking your last wallet session and network context. Stay on this page and the workspace will load automatically when the connection finishes."
            : "Protected workspace pages stay on the current route now. Connect a supported wallet here and ReviveSafe will open this page instead of sending you back to the landing page."}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <ConnectButton className="h-12" iconSectionClassName="h-12 px-4" />
          <Link to="/import">
            <Button
              variant="outline"
              className={`h-12 px-5 ${workspaceOutlineButtonClassName}`}
            >
              See native import
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              label: "1. Connect",
              value: "Talisman, SubWallet, or Polkadot.js",
            },
            {
              label: "2. Check network",
              value: "Use the Asset Hub network your team expects",
            },
            {
              label: "3. Open work",
              value: "Go straight into wallets, proposals, and activity",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[20px] border border-black/8 bg-white/78 p-4 dark:border-white/8 dark:bg-white/[0.04]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                {item.label}
              </div>
              <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${workspacePanelMutedClassName} p-5 md:p-6`}>
        <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
          <LifeBuoy className="h-4 w-4" />
          Before you continue
        </div>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          <p>
            Native multisig import works without programmable wallet mapping, but
            programmable create and approval flows still need a mapped ReviveSafe
            account on Asset Hub.
          </p>
          <p>
            Imported native wallets are kept in this browser on this device for
            now, so re-import them if you switch browsers or machines.
          </p>
          <p>
            This beta is intentionally explicit about scope. If a flow is not
            live, ReviveSafe should say so instead of implying hidden support.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardLayout() {
  const { account } = useAccount();
  const connectionStatus = useStatus();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const factoryAddress = useFactoryAddress((state) => state.factoryAddress);
  const pagePath = resolvePagePath(location.pathname);
  const navigationPath = resolveNavigationPath(location.pathname);
  const currentItem =
    navigation.find((item) => navigationPath === item.href) ?? navigation[0];
  const isRestoring = connectionStatus === ConnectionStatus.Connecting;
  const currentPageTitle = pageTitles[pagePath] ?? currentItem.name;
  const routeDescription =
    pageDescriptions[pagePath] ?? pageDescriptions["/dashboard"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_78%)] dark:opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[960px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-[110px] dark:bg-white/[0.03]" />
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-[320px] w-[320px] rounded-full bg-black/[0.03] blur-[120px] dark:bg-white/[0.02]" />

      <div className="relative mx-auto w-full max-w-[1880px] px-4 py-4 sm:px-6 sm:py-6 xl:px-8 2xl:max-w-[2048px] 2xl:px-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(270px,308px)_minmax(0,1fr)] lg:gap-6 2xl:grid-cols-[minmax(300px,340px)_minmax(0,1fr)] 2xl:gap-8">
          <aside
            className={`${workspacePanelClassName} p-5 backdrop-blur lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto xl:p-6`}
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
                const isActive = navigationPath === item.href;

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
                What ReviveSafe does here
              </div>
              <p className="mt-3 leading-7">
                Keep shared wallet work understandable: import native multisigs,
                create programmable wallets, review approvals, and keep recent
                changes in one place.
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

          <div className="min-w-0 flex-1">
            <div
              className={`relative mb-6 flex flex-col gap-4 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between xl:p-5 2xl:p-6 ${workspacePanelClassName}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.06),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%)]" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
                    Workspace
                  </div>
                  <WorkspaceBadge tone={account ? "emerald" : isRestoring ? "sky" : "amber"}>
                    {account ? "Connected" : isRestoring ? "Restoring" : "Needs wallet"}
                  </WorkspaceBadge>
                </div>
                <div className="mt-3 font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                  {currentPageTitle}
                </div>
                <div className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {routeDescription}
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

            <main className={`${workspacePanelClassName} p-5 md:p-6 xl:p-7 2xl:p-8`}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.04),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_22%)]" />
              <div className="relative z-10">
                {account ? (
                  <Outlet />
                ) : (
                  <WorkspaceSessionGate
                    isRestoring={isRestoring}
                    pageName={currentPageTitle}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
