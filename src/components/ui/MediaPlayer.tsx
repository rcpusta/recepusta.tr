"use client";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  kind: "iframe" | "file";
  title?: string;
  className?: string;
};

export function MediaPlayer({ src, kind, title = "Video", className }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-[0_0_40px_rgba(34,211,238,0.08)]",
        className
      )}
    >
      <div className="relative aspect-video w-full">
        {kind === "iframe" ? (
          <iframe
            src={src}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain bg-black"
          >
            Tarayıcınız video etiketini desteklemiyor.
          </video>
        )}
      </div>
    </div>
  );
}
