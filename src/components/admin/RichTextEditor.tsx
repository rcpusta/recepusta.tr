"use client";

import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link2,
  ImagePlus,
  Pilcrow,
  Video,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/upload-client";
import { HtmlVideo } from "@/components/admin/extensions/HtmlVideo";
import { IframeEmbed } from "@/components/admin/extensions/IframeEmbed";
import { toEmbedUrl, toYouTubeEmbed } from "@/lib/media-url";

function toHtml(value: string) {
  if (!value?.trim()) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");
}

type Props = {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "rounded-lg p-2 transition",
        active ? "bg-cyan-400/20 text-cyan-200" : "text-white/55 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "İçeriği yazın… Görsel ve videoları sürükleyebilirsiniz.",
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-4",
        },
      }),
      HtmlVideo.configure({
        HTMLAttributes: {
          class: "rounded-xl w-full my-4 aspect-video bg-black",
        },
      }),
      IframeEmbed,
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: "rounded-xl w-full my-4 aspect-video overflow-hidden",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cyan-300 underline underline-offset-2",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: toHtml(value) || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[240px] max-h-[520px] overflow-y-auto px-4 py-3 text-sm leading-relaxed text-white/90 outline-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files?.length) return false;
        const file = event.dataTransfer.files[0];
        if (!file) return false;

        if (file.type.startsWith("image/")) {
          event.preventDefault();
          const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
          void uploadFile(file).then((url) => {
            const node = view.state.schema.nodes.image?.create({ src: url });
            if (!node) return;
            const pos = coords?.pos ?? view.state.selection.from;
            view.dispatch(view.state.tr.insert(pos, node));
          });
          return true;
        }

        if (file.type.startsWith("video/")) {
          event.preventDefault();
          const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
          void uploadFile(file).then((url) => {
            const node = view.state.schema.nodes.htmlVideo?.create({ src: url });
            if (!node) return;
            const pos = coords?.pos ?? view.state.selection.from;
            view.dispatch(view.state.tr.insert(pos, node));
          });
          return true;
        }

        return false;
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (text) {
          const yt = toYouTubeEmbed(text);
          if (yt) {
            event.preventDefault();
            const node = view.state.schema.nodes.youtube?.create({ src: yt });
            if (node) view.dispatch(view.state.tr.replaceSelectionWith(node));
            return true;
          }
          const embed = toEmbedUrl(text);
          if (embed?.kind === "vimeo") {
            event.preventDefault();
            const node = view.state.schema.nodes.iframeEmbed?.create({ src: embed.src });
            if (node) view.dispatch(view.state.tr.replaceSelectionWith(node));
            return true;
          }
        }

        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith("image/") || item.type.startsWith("video/")) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            void uploadFile(file).then((url) => {
              const type = item.type.startsWith("video/") ? "htmlVideo" : "image";
              const node = view.state.schema.nodes[type]?.create({ src: url });
              if (!node) return;
              view.dispatch(view.state.tr.replaceSelectionWith(node));
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadFile(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // ignore
      }
    };
    input.click();
  }, [editor]);

  const addVideoFile = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/ogg,video/quicktime";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadFile(file);
        editor.chain().focus().setHtmlVideo({ src: url }).run();
      } catch {
        // ignore
      }
    };
    input.click();
  }, [editor]);

  const addVideoUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube, Vimeo veya video URL’si");
    if (!url) return;

    const yt = toYouTubeEmbed(url);
    if (yt) {
      editor.commands.setYoutubeVideo({ src: yt });
      return;
    }

    const embed = toEmbedUrl(url);
    if (embed?.kind === "file") {
      editor.chain().focus().setHtmlVideo({ src: embed.src }).run();
      return;
    }

    if (embed?.kind === "vimeo") {
      editor.chain().focus().setIframeEmbed({ src: embed.src }).run();
      return;
    }

    window.alert("Geçerli bir YouTube, Vimeo veya MP4/WEBM linki girin.");
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Bağlantı URL", prev || "https://");
    if (next === null) return;
    if (next === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: next }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>
        <div className="mt-2 h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    );
  }

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>
      <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 px-2 py-1.5">
          <ToolbarButton
            title="Paragraf"
            active={editor.isActive("paragraph")}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Başlık 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Başlık 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Kalın"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="İtalik"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Liste"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Numaralı liste"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton
            title="Alıntı"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarButton title="Bağlantı" active={editor.isActive("link")} onClick={addLink}>
            <Link2 size={15} />
          </ToolbarButton>
          <ToolbarButton title="Görsel ekle" onClick={() => void addImage()}>
            <ImagePlus size={15} />
          </ToolbarButton>
          <ToolbarButton title="YouTube / Vimeo" onClick={addVideoUrl}>
            <Video size={15} />
          </ToolbarButton>
          <ToolbarButton title="Video dosyası yükle" onClick={() => void addVideoFile()}>
            <Film size={15} />
          </ToolbarButton>
          <div className="mx-1 h-5 w-px bg-white/10" />
          <ToolbarButton title="Geri al" onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 size={15} />
          </ToolbarButton>
          <ToolbarButton title="İleri al" onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 size={15} />
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} />
        <p className="border-t border-white/5 px-4 py-2 text-[11px] text-white/35">
          Görsel/video sürükle-bırak · YouTube linki yapıştır · araç çubuğundan medya ekle
        </p>
      </div>
    </div>
  );
}
