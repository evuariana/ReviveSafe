import { ArrowRight } from "lucide-react";

import { useLandingActions } from "@/components/landing/use-landing-actions";
import { Button } from "@/components/ui/button";

function getButtonClasses(emphasis: "primary" | "secondary") {
  if (emphasis === "primary") {
    return "h-12 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200";
  }

  return "h-12 rounded-full border-zinc-200 bg-white px-8 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.04] dark:hover:text-white";
}

export function LandingCtaButtons() {
  const { handleCreate, handleImport } = useLandingActions();

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
      <Button className={getButtonClasses("primary")} onClick={handleCreate}>
        Create wallet
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className={getButtonClasses("secondary")}
        onClick={handleImport}
      >
        Add contract wallet
      </Button>
    </div>
  );
}
