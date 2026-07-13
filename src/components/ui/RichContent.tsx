export function isHtmlContent(value: string) {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function RichContent({ html }: { html: string }) {
  if (!html?.trim()) return null;

  if (!isHtmlContent(html)) {
    return (
      <div className="space-y-6 text-lg leading-relaxed text-white/85">
        {html
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
      </div>
    );
  }

  return (
    <div
      className="rich-content text-lg leading-relaxed text-white/85"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
