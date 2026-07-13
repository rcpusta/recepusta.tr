export function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.startsWith("/uploads/");
}

export function toYouTubeEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/embed/")) return `https://www.youtube.com${parsed.pathname}`;
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const shorts = parsed.pathname.match(/\/shorts\/([^/]+)/);
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function toVimeoEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
    if (host === "player.vimeo.com") return url;
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

export function toEmbedUrl(url: string): { kind: "youtube" | "vimeo" | "file"; src: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const yt = toYouTubeEmbed(trimmed);
  if (yt) return { kind: "youtube", src: yt };

  const vimeo = toVimeoEmbed(trimmed);
  if (vimeo) return { kind: "vimeo", src: vimeo };

  if (isDirectVideoUrl(trimmed) || trimmed.startsWith("http")) {
    if (isDirectVideoUrl(trimmed)) return { kind: "file", src: trimmed };
  }

  return null;
}
