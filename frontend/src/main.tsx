import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppErrorBoundary } from "@/components/system/app-error-boundary";
import { installGlobalErrorHandlers } from "@/lib/observability";

import "./index.css";
import "@luno-kit/ui/styles.css";
import App from "./App.tsx";

installGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);
