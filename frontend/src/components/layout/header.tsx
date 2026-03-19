import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Shield, X } from "lucide-react";

import { ChainSelector } from "@/components/wallet/chain-selector";
import { ConnectButton } from "@/components/wallet/connect-button";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Multisigs", href: "/wallets" },
  { name: "Create", href: "/create" },
  { name: "Register", href: "/register" },
  { name: "Deploy", href: "/deploy" },
];

export default function Header() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white shadow-lg shadow-rose-200">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-950">
              ReviveSafe
            </div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Dedot + LunoKit
            </div>
          </div>
        </Link>

        {!isLanding && (
          <div className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ChainSelector />
          </div>
          <ConnectButton />
          {!isLanding && (
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white p-2 lg:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </nav>

      {!isLanding && mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
          <div className="mb-4 sm:hidden">
            <ChainSelector />
          </div>
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
