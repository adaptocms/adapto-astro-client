// Reserved collection slugs use a leading underscore (e.g. `_adapto_seo`): agent-skills create
// these for internal use, so they must never surface in nav, routes, or the sitemap. Filtering
// them out of the two content loaders keeps them out of every downstream surface at once.
export function isReserved(slug: string): boolean {
  return slug.startsWith("_");
}
