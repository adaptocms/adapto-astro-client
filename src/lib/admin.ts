import { API_KEY } from "../../settings.ts";

// The project id is the second segment of the API key (`<hash>.<project_id>`) — the
// same value the backend derives as the tenant. Empty string when unconfigured.
export const PROJECT_ID = API_KEY.split(".")[1] ?? "";

const ADMIN_BASE = "https://app.adaptocms.com";

// Deep link into this project's Adapto CMS admin (optionally a section), tagged with a
// `ref` for PostHog attribution. Returns "" when there is no project id so callers can
// gate the link (e.g. hide "Add new" when unconfigured).
export function adminUrl(section = "", ref = "astro-starter"): string {
  if (!PROJECT_ID) return "";
  const path = section ? `/${section}` : "";
  return `${ADMIN_BASE}/projects/project-${PROJECT_ID}${path}?ref=${ref}`;
}

// Append a PostHog `ref` to any adaptocms.com link.
export function withRef(url: string, ref: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}ref=${ref}`;
}
