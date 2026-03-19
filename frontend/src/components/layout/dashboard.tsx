import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "@luno-kit/react";
import {
  Boxes,
  LayoutDashboard,
  Shield,
  Upload,
  UserPlus,
  Wallet,
} from "lucide-react";

import { MappingGate } from "@/components/wallet/mapping-gate";
import { Button } from "@/components/ui/button";
import { ChainSelector } from "@/components/wallet/chain-selector";
import { ConnectButton } from "@/components/wallet/connect-button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Multisigs", href: "/wallets", icon: Wallet },
  { name: "Create", href: "/create", icon: Shield },
  { name: "Register", href: "/register", icon: UserPlus },
  { name: "Deploy", href: "/deploy", icon: Upload },
];

export default function DashboardLayout() {
  const { account } = useAccount();
  const location = useLocation();

  if (!account) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#eef2ff_55%,_#f8fafc)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <aside className="rounded-[28px] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/15 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">ReviveSafe</div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                PVM control room
              </div>
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
                      ? "bg-white text-slate-950"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Fresh write path</div>
            <p className="mt-2">
              All contract actions now flow through `pallet_revive.call` and
              `instantiate_with_code`.
            </p>
          </div>

          <div className="mt-auto hidden pt-6 lg:block">
            <Link to="/create">
              <Button className="w-full rounded-xl bg-white text-slate-950 hover:bg-slate-200">
                New multisig
              </Button>
            </Link>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-3 rounded-[26px] border border-white/60 bg-white/75 p-4 shadow-lg shadow-slate-200/50 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                ReviveSafe workspace
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                Dedot-first multisig operations for Asset Hub PVM
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ChainSelector />
              <ConnectButton />
            </div>
          </div>

          <MappingGate>
            <main className="rounded-[28px] border border-white/65 bg-white/78 p-5 shadow-xl shadow-slate-200/50 backdrop-blur sm:p-6">
              <Outlet />
            </main>
          </MappingGate>
        </div>
      </div>
    </div>
  );
}
