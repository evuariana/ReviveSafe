import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export const workspacePanelClassName =
  "relative overflow-hidden rounded-[30px] border border-black/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(244,244,245,0.94))] shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(10,10,10,0.96),rgba(18,18,18,0.94))] dark:shadow-[0_0_60px_rgba(255,255,255,0.04)]";

export const workspacePanelMutedClassName =
  "rounded-[24px] border border-black/[0.08] bg-black/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

export const workspaceListItemClassName =
  "group relative block overflow-hidden rounded-[26px] border border-black/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(248,248,249,0.92))] px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition duration-300 ease-premium hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_18px_46px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(14,14,15,0.96),rgba(20,20,21,0.92))] dark:hover:border-white/16 dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]";

export const workspaceOutlineButtonClassName =
  "rounded-full border-black/10 bg-white/90 text-zinc-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 ease-premium hover:border-black/15 hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.07] dark:hover:text-white";

export const workspaceGhostButtonClassName =
  "rounded-full text-zinc-500 transition duration-300 ease-premium hover:bg-black/[0.05] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white";

export const workspaceInputClassName =
  "h-12 rounded-[18px] border-black/10 bg-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-300 ease-premium focus-visible:ring-1 focus-visible:ring-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:focus-visible:ring-white/20";

export const workspaceSelectClassName =
  "flex h-12 w-full rounded-[18px] border border-black/10 bg-white/88 px-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:focus-visible:ring-white/20";

export const workspaceEyebrowClassName =
  "text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400";

export const workspaceTitleClassName =
  "font-display text-3xl font-medium tracking-tight text-zinc-950 md:text-[2.6rem] md:leading-[1.02] dark:text-white";

export const workspaceDescriptionClassName =
  "max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400";

const badgeToneClasses = {
  amber:
    "border-amber-200/90 bg-amber-500/[0.10] text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
  default:
    "border-black/10 bg-black/[0.04] text-zinc-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200",
  emerald:
    "border-emerald-200/90 bg-emerald-500/[0.10] text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
  rose:
    "border-rose-200/90 bg-rose-500/[0.10] text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
  sky:
    "border-sky-200/90 bg-sky-500/[0.10] text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200",
};

type WorkspaceBadgeTone = keyof typeof badgeToneClasses;

export function WorkspaceBadge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: WorkspaceBadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
        badgeToneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function WorkspaceHero({
  actions,
  aside,
  className,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
  description: ReactNode;
  eyebrow: ReactNode;
  title: ReactNode;
}) {
  return (
    <section className={cn(workspacePanelClassName, "p-6 md:p-8", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.06),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_34%)]" />
      <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-black/[0.04] blur-3xl dark:bg-white/[0.05]" />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div>
          <div className={workspaceEyebrowClassName}>{eyebrow}</div>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-zinc-950 md:text-[3.3rem] md:leading-[1.01] dark:text-white">
            {title}
          </h1>
          <div className="mt-4 max-w-3xl text-base font-light leading-8 text-zinc-600 dark:text-zinc-400">
            {description}
          </div>
          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? (
          <div
            className={cn(
              workspacePanelMutedClassName,
              "relative z-10 p-5 md:p-6"
            )}
          >
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function WorkspacePanel({
  actions,
  children,
  className,
  contentClassName,
  description,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <section className={cn(workspacePanelClassName, "p-6", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.05),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%)]" />

      {(title || description || actions) && (
        <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-black/[0.06] pb-5 md:flex-row md:items-end md:justify-between dark:border-white/8">
          <div>
            {title ? (
              <h2 className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                {title}
              </h2>
            ) : null}
            {description ? (
              <div className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                {description}
              </div>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      )}

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </section>
  );
}

export function WorkspaceStatCard({
  description,
  icon: Icon,
  label,
  value,
}: {
  description: ReactNode;
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className={cn(workspacePanelMutedClassName, "p-5")}>
      <div className="flex items-center justify-between">
        <div className={workspaceEyebrowClassName}>{label}</div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/70 text-zinc-600 dark:border-white/8 dark:bg-white/[0.04] dark:text-zinc-300">
          <Icon className="h-4 w-4" strokeWidth={1.7} />
        </div>
      </div>
      <div className="mt-5 font-display text-3xl font-medium tracking-tight text-zinc-950 dark:text-white">
        {value}
      </div>
      <div className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </div>
    </div>
  );
}

export function WorkspaceEmptyState({
  action,
  className,
  description,
  icon: Icon,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: LucideIcon;
  title: ReactNode;
}) {
  return (
    <div
      className={cn(
        workspacePanelMutedClassName,
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      {Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/8 bg-white/70 text-zinc-500 dark:border-white/8 dark:bg-white/[0.04] dark:text-zinc-300">
          <Icon className="h-6 w-6" strokeWidth={1.7} />
        </div>
      ) : null}
      <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
        {title}
      </h3>
      <div className="mt-3 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
        {description}
      </div>
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}

export function WorkspaceNotice({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: WorkspaceBadgeTone;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border px-4 py-3 text-sm leading-6",
        badgeToneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  );
}

export function WorkspaceLinkCard({
  badge,
  description,
  meta,
  note,
  title,
  to,
}: {
  badge?: ReactNode;
  description: ReactNode;
  meta?: ReactNode;
  note?: ReactNode;
  title: ReactNode;
  to: string;
}) {
  return (
    <Link to={to} className={workspaceListItemClassName}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 ease-premium group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-black/[0.05] blur-2xl dark:bg-white/[0.05]" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="font-semibold text-zinc-950 dark:text-white">{title}</div>
          {meta ? (
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              {meta}
            </div>
          ) : null}
          <div className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {description}
          </div>
          {note ? <div className="mt-3">{note}</div> : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {badge}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/80 text-zinc-600 transition duration-300 ease-premium group-hover:border-black/12 group-hover:text-zinc-950 dark:border-white/8 dark:bg-white/[0.04] dark:text-zinc-300 dark:group-hover:border-white/14 dark:group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />
          </div>
        </div>
      </div>
    </Link>
  );
}
