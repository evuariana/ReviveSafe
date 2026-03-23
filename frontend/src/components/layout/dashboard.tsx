import { Link, Outlet, useLocation } from "react-router-dom";
import { ConnectionStatus, useAccount, useStatus } from "@luno-kit/react";
import {
  BellRing,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Moon,
  ScrollText,
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
  "/activity": "Review recent changes without mixing them into the work queue.",
  "/create":
    "Set up a new contract wallet with the people and approval rule your team needs.",
  "/dashboard":
    "Start here for the quick read: setup, work waiting on you, and active wallets.",
  "/deploy":
    "Operator tools for deployment and advanced beta setup.",
  "/import":
    "Add a native multisig by entering its signer list and approval rule.",
  "/inbox":
    "Use Inbox like a shared to-do list for approvals, updates, and wallet notices.",
  "/proposals":
    "See all open approvals and ready-to-execute items in one queue.",
  "/register":
    "Add an existing compatible contract wallet to this workspace.",
  "/wallet/:address":
    "Review balances, members, open proposals, and recent changes for one wallet.",
  "/wallets":
    "Open any native multisig or contract wallet in this workspace.",
};

function WorkspaceSessionGate({
  isRestoring,
  pageName,
}: {
  isRestoring: boolean;
  pageName: string;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] 2xl:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)] 2xl:gap-8">
      <div className={`${workspacePanelMutedClassName} min-w-0 p-6 md:p-8`}>
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
            : "Connect a supported wallet to open this page. ReviveSafe keeps you here and loads the workspace in place."}
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

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
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

      <div className={`${workspacePanelMutedClassName} min-w-0 p-5 md:p-6`}>
        <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
          <LifeBuoy className="h-4 w-4" />
          Before you continue
        </div>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          <p>
            Native multisig import works right away. Contract wallet create,
            approval, and execution flows still need one extra setup step on
            Asset Hub.
          </p>
          <p>
            Imported native wallets are kept in this browser on this device for
            now, so re-import them if you switch browsers or machines.
          </p>
          <p>
            If a flow is not live in this beta, ReviveSafe should say so clearly
            instead of implying hidden support.
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
  const pagePath = resolvePagePath(location.pathname);
  const navigationPath = resolveNavigationPath(location.pathname);
  const currentItem =
    navigation.find((item) => navigationPath === item.href) ?? navigation[0];
  const isRestoring = connectionStatus === ConnectionStatus.Connecting;
  const currentPageTitle = pageTitles[pagePath] ?? currentItem.name;
  const routeDescription =
    pageDescriptions[pagePath] ?? pageDescriptions["/dashboard"];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50 xl:h-screen xl:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_78%)] dark:opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[960px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-[110px] dark:bg-white/[0.03]" />
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-[320px] w-[320px] rounded-full bg-black/[0.03] blur-[120px] dark:bg-white/[0.02]" />

      <div className="relative w-full px-[clamp(0.875rem,1.4vw,1.5rem)] py-[clamp(0.875rem,1.2vw,1.5rem)] sm:px-[clamp(1rem,1.8vw,2rem)] xl:h-full xl:px-[clamp(1.25rem,2vw,2.75rem)] 2xl:px-[clamp(1.5rem,2.6vw,4rem)]">
        <div className="grid items-start gap-4 xl:h-full xl:grid-cols-[clamp(272px,18vw,340px)_minmax(0,1fr)] xl:gap-6 2xl:grid-cols-[clamp(292px,16vw,360px)_minmax(0,1fr)] 2xl:gap-8">
          <aside
            className={`${workspacePanelClassName} flex flex-col p-5 backdrop-blur xl:min-h-0 xl:h-full xl:self-stretch xl:overflow-y-auto xl:p-6`}
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

            <div className="relative z-10 mt-auto pt-6">
              <BetaSupportCard />

              <div className="mt-4 grid gap-3">
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
                    Create contract wallet
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 xl:flex xl:min-h-0 xl:flex-col xl:overflow-y-auto xl:pr-1">
            <div
              className={`relative mb-6 flex flex-col gap-4 p-4 backdrop-blur lg:flex-row lg:items-start lg:justify-between xl:items-center xl:p-5 2xl:p-6 ${workspacePanelClassName}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.06),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%)]" />

              <div className="relative z-10 min-w-0 flex-1">
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
                <div className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {routeDescription}
                </div>
              </div>

              <div className="relative z-10 flex w-full flex-wrap items-center justify-start gap-3 lg:w-auto lg:shrink-0 lg:justify-end">
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
