import type { IMediaObjectsPlacement } from "../content/schemas/shared";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// /**
//  * Extracts the 11-character video ID from ANY type of YouTube URL
//  * and returns the clean embed URL.
//  */
function getYouTubeEmbedUrl(url: string): string | null {
  // This modern regex catches watch?v=, youtu.be, /embed/, /shorts/, and /live/
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);

  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Extracts the video ID (and optional privacy hash) from ANY Vimeo URL
 * and returns the correct embed URL.
 */
function getVimeoEmbedUrl(url: string): string | null {
  // This regex grabs the Video ID (Group 1) and the Privacy Hash if it exists (Group 2)
  const regExp =
    /(?:https?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:(?:[a-z0-9_-]+\/)+(?:videos?\/)?)?(\d+)(?:\/([a-z0-9]+))?/i;

  const match = url.match(regExp);

  if (match && match[1]) {
    const videoId = match[1];
    const privacyHash = match[2]; // Will be undefined if it's a public video

    // If it has a privacy hash, format it correctly with ?h=
    if (privacyHash) {
      return `https://player.vimeo.com/video/${videoId}?h=${privacyHash}`;
    }

    // Otherwise, return standard embed
    return `https://player.vimeo.com/video/${videoId}`;
  }

  return null;
}

/**
 * Extracts the video ID from a TikTok URL and returns the embed URL.
 */
function getTikTokEmbedUrl(url: string): string | null {
  const regExp =
    /tiktok\.com\/(?:@[a-zA-Z0-9_.-]+\/video\/|v\/|embed\/v2\/)(\d+)/i;
  const match = url.match(regExp);
  return match && match[1]
    ? `https://www.tiktok.com/embed/v2/${match[1]}`
    : null;
}

/**
 * Extracts Instagram post/reel ID and returns embed URL.
 */
function getInstagramEmbedUrl(url: string): string | null {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
  const match = url.match(regExp);
  return match
    ? `https://www.instagram.com/p/${match[1]}/embed/captioned/`
    : null;
}

export function hydrateMediaPlacements(
  html: string,
  mediaObjectsPlacements: IMediaObjectsPlacement[],
): string {
  for (const placement of mediaObjectsPlacements || []) {
    const { placement_key, media_object, alt_text, caption, meta_data } =
      placement;

    if (!media_object) continue;

    let innerHtml = "";

    //  SANITIZE ALL USER INPUTS HERE BEFORE USE
    const safeAlt = escapeHtml(alt_text || media_object.description || "");
    const safeCaption = escapeHtml(caption || "");

    let showAsLink = false;
    if (meta_data) {
      try {
        if (typeof meta_data === "string") {
          const parsedMeta = JSON.parse(meta_data);
          showAsLink = parsedMeta.showAsLink === true;
        }
        // Handle if meta_data is already a parsed object
        else if (typeof meta_data === "object") {
          showAsLink = meta_data.showAsLink === true;
        }
      } catch (e) {}
    }

    if (showAsLink) {
      // Force it to render as a simple link, regardless of media type
      innerHtml = `
        <a 
          href="${media_object.url}" 
          target="_blank" 
          rel="noopener noreferrer" 
          style="color: #2563eb; text-decoration: none; font-weight: 500; word-break: break-word;"
          title="${safeAlt}"
          onmouseover="this.style.textDecoration='underline'"
          onmouseout="this.style.textDecoration='none'"
        >
          ${media_object.url}
        </a>
      `;
    } else {
      // Generate ONLY the specific inner media HTML
      switch (media_object.type) {
        case "image":
          innerHtml = `
            <img
              src="${media_object.url}?w=1216&format=webp&quality=80"
              alt="${safeAlt}"
              width="1216"
              height="640"
              loading="lazy"
              style="width: 100%; max-width: 800px; height: auto; border-radius: 16px; object-fit: cover; background-color: #f3f4f6;"
            />
          `;
          break;

        case "youtube": {
          const embedUrl = getYouTubeEmbedUrl(media_object.url);
          if (embedUrl) {
            innerHtml = `
              <div style="width: 100%; max-width: 800px; aspect-ratio: 16 / 9; border-radius: 16px; overflow: hidden; background-color: #f3f4f6;">
                <iframe src="${embedUrl}" title="${safeAlt || "YouTube video player"}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" style="width: 100%; height: 100%;"></iframe>
              </div>
            `;
          }
          break;
        }

        case "vimeo": {
          const embedUrl = getVimeoEmbedUrl(media_object.url);
          if (embedUrl) {
            innerHtml = `
              <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; background-color: #f3f4f6;">
                <iframe src="${embedUrl}" title="${safeAlt || "Vimeo video player"}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
            `;
          }
          break;
        }

        case "tiktok": {
          const embedUrl = getTikTokEmbedUrl(media_object.url);
          if (embedUrl) {
            innerHtml = `
              <div style="max-width: 400px; border-radius: 16px; overflow: hidden; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                <iframe src="${embedUrl}" title="${safeAlt || "TikTok video player"}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" style="width: 100%; height: 715px; display: block;"></iframe>
              </div>
            `;
          }
          break;
        }

        case "instagram_post":
        case "instagram_reel": {
          const embedUrl = getInstagramEmbedUrl(media_object.url);
          if (embedUrl) {
            // Reels need to be taller than standard posts
            const iframeHeight =
              media_object.type === "instagram_reel" ? "750px" : "600px";
            innerHtml = `
              <div style="max-width: 400px; border-radius: 16px; overflow: hidden; background-color: #ffffff; border: 1px solid #e5e7eb;">
                <iframe src="${embedUrl}" title="${safeAlt || "Instagram"}" frameborder="0" scrolling="no" allowtransparency="true" loading="lazy" style="width: 100%; height: ${iframeHeight}; display: block;"></iframe>
              </div>
            `;
          }
          break;
        }

        case "video":
          innerHtml = `
            <video controls preload="metadata" style="width: 100%; max-width: 800px; border-radius: 16px; background-color: #000;">
              <source src="${media_object.url}">
              Your browser does not support the video tag.
            </video>
          `;
          break;

        case "audio":
          innerHtml = `
            <audio controls preload="metadata" style="width: 100%; max-width: 800px;">
              <source src="${media_object.url}">
              Your browser does not support the audio element.
            </audio>
          `;
          break;

        case "document":
          innerHtml = `
            <div style="width: 100%; max-width: 800px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; background-color: #f9fafb; display: flex; align-items: center; gap: 16px; font-family: system-ui, -apple-system, sans-serif;">
              <svg width="32" height="32" style="flex-shrink: 0; color: #6b7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div style="flex: 1; min-width: 0;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${media_object.title}</h3>
              </div>
              <a href="${media_object.url}" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; display: inline-block; padding: 8px 16px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                Download
              </a>
            </div>
          `;
          break;

        case "other":
        default:
          innerHtml = `
            <div style="width: 100%; max-width: 800px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; background-color: #f9fafb; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827;">${media_object.title}</h3>
              <a href="${media_object.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: #dbeafe; color: #1d4ed8; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                View Media
              </a>
            </div>
          `;
          break;
      }
    }

    //  Wrap the resulting media in the Figure and Caption globally
    if (innerHtml) {
      let replacementHtml = "";

      if (showAsLink) {
        replacementHtml = innerHtml;
      } else {
        replacementHtml = `
          <figure style="margin: 24px 0;">
            ${innerHtml}
            ${safeCaption ? `<figcaption style="font-size: 14px; color: #4b5563; margin-top: 8px; text-align: left;">${safeCaption}</figcaption>` : ""}
          </figure>
        `;
      }

      // Escape special regex characters in the key
      const escapedKey = placement_key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = `<media-object[^>]*key=['"]${escapedKey}['"][^>]*>\\s*<\\/media-object>`;

      html = html.replace(new RegExp(pattern, "g"), replacementHtml);
    }
  }

  return html;
}
