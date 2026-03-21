import { observabilityEndpoint, releaseChannel } from "@/config/release";

type ObservabilityLevel = "info" | "warn" | "error";

interface OperationalEvent {
  type: string;
  level: ObservabilityLevel;
  message: string;
  fingerprint?: string;
  details?: Record<string, unknown>;
}

const REPORT_DEDUP_WINDOW_MS = 60_000;
const recentEvents = new Map<string, number>();
let globalHandlersInstalled = false;

function trimRecentEvents(now: number) {
  for (const [fingerprint, lastSentAt] of recentEvents.entries()) {
    if (now - lastSentAt > REPORT_DEDUP_WINDOW_MS) {
      recentEvents.delete(fingerprint);
    }
  }
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (depth >= 3) {
    return "[truncated]";
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 20)
        .map(([key, entryValue]) => [key, sanitizeValue(entryValue, depth + 1)])
    );
  }

  return String(value);
}

function buildFingerprint(event: OperationalEvent) {
  if (event.fingerprint) {
    return event.fingerprint;
  }

  return `${event.type}:${event.message}`;
}

function shouldReport(fingerprint: string) {
  const now = Date.now();
  trimRecentEvents(now);
  const previous = recentEvents.get(fingerprint);

  if (previous && now - previous < REPORT_DEDUP_WINDOW_MS) {
    return false;
  }

  recentEvents.set(fingerprint, now);
  return true;
}

function buildPayload(event: OperationalEvent) {
  return {
    app: "ReviveSafe",
    releaseChannel,
    type: event.type,
    level: event.level,
    message: event.message,
    details: sanitizeValue(event.details ?? {}),
    timestamp: new Date().toISOString(),
    path:
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : undefined,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
}

async function sendPayload(payload: ReturnType<typeof buildPayload>) {
  if (!observabilityEndpoint) {
    if (import.meta.env.DEV && payload.level === "error") {
      console.warn("[observability stub]", payload);
    }
    return;
  }

  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(
      observabilityEndpoint,
      new Blob([body], { type: "application/json" })
    );
    return;
  }

  await fetch(observabilityEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function describeError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function reportOperationalEvent(event: OperationalEvent) {
  const fingerprint = buildFingerprint(event);
  if (!shouldReport(fingerprint)) {
    return;
  }

  void sendPayload(buildPayload(event));
}

export function installGlobalErrorHandlers() {
  if (globalHandlersInstalled || typeof window === "undefined") {
    return;
  }

  globalHandlersInstalled = true;

  window.addEventListener("error", (event) => {
    reportOperationalEvent({
      type: "window.error",
      level: "error",
      message: event.message || "Unhandled runtime error.",
      details: {
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportOperationalEvent({
      type: "window.unhandledrejection",
      level: "error",
      message: "Unhandled promise rejection.",
      details: {
        reason: event.reason,
      },
    });
  });
}
