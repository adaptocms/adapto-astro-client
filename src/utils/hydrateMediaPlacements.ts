import type { IMediaObjectsPlacement } from "../content/schemas/articles";

export function hydrateMediaPlacements(
  html: string,
  mediaObjectsPlacements: IMediaObjectsPlacement[],
): string {
  for (const placement of mediaObjectsPlacements || []) {
    const { placement_key, media_object, alt_text, caption } = placement;

    //TODO handle other media types (video, audio)
    if (!media_object || media_object.type !== "image") continue;

    // add the size and type from the url

    const imgHtml = `
        <img
          src="${media_object.url}"
          alt="${alt_text || media_object.description || ""}"
          height="300"
          type="image/webp"
          loading="lazy"
          class="w-full rounded"
        />
    `;

    const pattern = `<media-object[^>]*key=['"]${placement_key.replace(
      "$",
      "\\$",
    )}['"][^>]*>\\s*<\\/media-object>`;

    html = html.replace(new RegExp(pattern, "g"), imgHtml);
  }

  return html;
}
