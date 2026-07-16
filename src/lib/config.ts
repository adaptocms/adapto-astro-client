// True only when both the API URL and key are non-empty. Used to decide whether the
// app can talk to Adapto at all — a fresh scaffold with no `.env` has neither set.
export function isConfigured(url?: string, key?: string): boolean {
    return (url ?? "").trim() !== "" && (key ?? "").trim() !== "";
}
