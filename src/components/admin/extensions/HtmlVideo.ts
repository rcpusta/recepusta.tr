import { Node, mergeAttributes } from "@tiptap/core";

export type HtmlVideoOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    htmlVideo: {
      setHtmlVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const HtmlVideo = Node.create<HtmlVideoOptions>({
  name: "htmlVideo",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: "true",
        playsinline: "true",
      }),
    ];
  },

  addCommands() {
    return {
      setHtmlVideo:
        (options) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),
    };
  },
});
