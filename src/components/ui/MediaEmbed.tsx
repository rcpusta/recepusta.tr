"use client";

import { MediaPlayer } from "@/components/ui/MediaPlayer";
import { toEmbedUrl } from "@/lib/media-url";

export function MediaEmbed({ url, title }: { url: string; title?: string }) {
  const embed = toEmbedUrl(url);
  if (!embed) {
    // Fallback: try as iframe/src for raw youtube-like strings TipTap may store
    if (url.includes("youtube.com") || url.includes("vimeo.com")) {
      return <MediaPlayer src={url} kind="iframe" title={title} />;
    }
    if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) || url.startsWith("/uploads/")) {
      return <MediaPlayer src={url} kind="file" title={title} />;
    }
    return null;
  }

  return (
    <MediaPlayer
      src={embed.src}
      kind={embed.kind === "file" ? "file" : "iframe"}
      title={title}
    />
  );
}
