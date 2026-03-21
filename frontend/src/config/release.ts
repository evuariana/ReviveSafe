function normalizeOptionalValue(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

const DEFAULT_REPOSITORY_URL = "https://github.com/evuariana/ReviveSafe";

export const repositoryUrl =
  normalizeOptionalValue(import.meta.env.VITE_REPOSITORY_URL) ??
  DEFAULT_REPOSITORY_URL;

function buildDocsUrl(path: string) {
  return `${repositoryUrl.replace(/\/$/, "")}/blob/main/docs/${path}`;
}

export const supportUrl =
  normalizeOptionalValue(import.meta.env.VITE_BETA_SUPPORT_URL) ??
  `${repositoryUrl.replace(/\/$/, "")}/issues`;

export const supportLabel =
  normalizeOptionalValue(import.meta.env.VITE_BETA_SUPPORT_LABEL) ??
  "GitHub Issues";

export const observabilityEndpoint = normalizeOptionalValue(
  import.meta.env.VITE_OBSERVABILITY_ENDPOINT
);

export const releaseChannel =
  normalizeOptionalValue(import.meta.env.VITE_RELEASE_CHANNEL) ?? "beta";

export const releaseDocs = {
  readinessUrl: buildDocsUrl("revivesafe-release-readiness.md"),
  operatorRunbookUrl: buildDocsUrl("revivesafe-beta-operator-runbook.md"),
  trustSecurityUrl: buildDocsUrl("revivesafe-trust-and-security.md"),
  observabilityUrl: buildDocsUrl("revivesafe-observability-checklist.md"),
  repositoryUrl,
};
