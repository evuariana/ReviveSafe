import { Link } from "react-router-dom";
import { Boxes, ShieldCheck, Waypoints, Wrench } from "lucide-react";
import { useAccount } from "@luno-kit/react";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/wallet/connect-button";

const pillars = [
  {
    title: "Mapped identity first",
    body:
      "Every contract action now starts from the SS58 account, resolves its mapped H160, and submits through `pallet_revive` instead of an EVM wallet shim.",
    icon: Waypoints,
  },
  {
    title: "PVM multisig flow",
    body:
      "ReviveSafe keeps the familiar multisig dashboard, but proposal creation, confirmation, and execution now ride on the Asset Hub revive runtime.",
    icon: ShieldCheck,
  },
  {
    title: "Hackathon deploy console",
    body:
      "Compile with `resolc`, instantiate with code, and keep a write panel ready for live demos without leaving the app.",
    icon: Wrench,
  },
];

export default function Landing() {
  const { account } = useAccount();

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8 lg:pt-28">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 shadow-sm backdrop-blur">
              <Boxes className="h-3.5 w-3.5" />
              Polkadot Asset Hub PVM track
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              ReviveSafe is now a{" "}
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 bg-clip-text text-transparent">
                Dedot-first
              </span>{" "}
              multisig control room.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Built for the 2026 Polkadot Solidity Hackathon, this rewrite keeps
              the team multisig UX but moves every critical path onto
              `pallet_revive`, mapped H160 accounts, and asset precompile-aware
              proposal flows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {account ? (
                <Link to="/dashboard">
                  <Button className="h-11 rounded-xl px-5 text-sm">
                    Open dashboard
                  </Button>
                </Link>
              ) : (
                <div className="w-fit">
                  <ConnectButton />
                </div>
              )}
              <Link to="/deploy">
                <Button variant="outline" className="h-11 rounded-xl px-5 text-sm">
                  Open deploy console
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-rose-200/30 backdrop-blur">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Live flow
              </div>
              <div className="mt-4 space-y-4">
                {[
                  "Connect with LunoKit",
                  "Map SS58 to H160 with `map_account`",
                  "Create or register a multisig",
                  "Submit native or asset-precompile proposals",
                  "Deploy fresh contracts through Revive",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-950">
                      {index + 1}
                    </div>
                    <div className="text-sm text-slate-200">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[28px] border border-white/60 bg-white/78 p-6 shadow-lg shadow-slate-200/50 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white">
                <pillar.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
