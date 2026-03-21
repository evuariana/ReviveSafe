import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { releaseDocs, supportLabel, supportUrl } from "@/config/release";
import { reportOperationalEvent } from "@/lib/observability";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportOperationalEvent({
      type: "react.error-boundary",
      level: "error",
      message: error.message,
      details: {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950 dark:bg-[#050505] dark:text-zinc-50">
        <div className="w-full max-w-xl rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_18px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0b0b0b] dark:shadow-[0_0_60px_rgba(255,255,255,0.04)]">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Runtime error
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            ReviveSafe hit an unexpected error
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Reload the app first. If this happens again, use the beta support
            path and include the network, wallet flow, and wallet address you
            were using.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="rounded-full px-5"
              onClick={() => window.location.reload()}
            >
              Reload app
            </Button>
            <a href={supportUrl} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                className="rounded-full border-zinc-200 bg-white px-5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                {supportLabel}
              </Button>
            </a>
            <a
              href={releaseDocs.readinessUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-white"
            >
              Release readiness
            </a>
          </div>
        </div>
      </div>
    );
  }
}
