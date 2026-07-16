import { API_KEY } from "../../settings.ts";

// The project id is the second segment of the API key (`<hash>.<project_id>`) — the
// same value the backend derives as the tenant. Empty string when unconfigured.
export const PROJECT_ID = API_KEY.split(".")[1] ?? "";

const ADMIN_BASE = "https://app.adaptocms.com";

// Deep link into this project's Adapto CMS admin (optionally a section), tagged with a
// `ref` for PostHog attribution. Returns "" so callers gate the link off (e.g. hide
// "Add new") in two cases:
//   1. No project id (unconfigured).
//   2. Production build. Admin links carry the project id and point at the authenticated
//      admin — a local-development aid, not something to ship to public visitors. They
//      render only during `astro dev` (import.meta.env.DEV), so no project id lands in a
//      built site. This is the single chokepoint for every admin link in the app.
export function adminUrl(section = "", ref = "astro-starter"): string {
  if (!import.meta.env.DEV || !PROJECT_ID) return "";
  const path = section ? `/${section}` : "";
  return `${ADMIN_BASE}/projects/project-${PROJECT_ID}${path}?ref=${ref}`;
}

// Append a PostHog `ref` to any adaptocms.com link.
export function withRef(url: string, ref: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}ref=${ref}`;
}
