import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframeEmbed: {
      setIframeEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

export const IframeEmbed = Node.create({
  name: "iframeEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-iframe-embed] iframe",
        getAttrs: (el) => {
          const iframe = el as HTMLElement;
          return { src: iframe.getAttribute("src") };
        },
      },
      {
        tag: "iframe",
        getAttrs: (el) => {
          const iframe = el as HTMLIFrameElement;
          const src = iframe.getAttribute("src") || "";
          if (src.includes("vimeo.com") || src.includes("youtube.com") || src.includes("youtube-nocookie.com")) {
            return { src };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-iframe-embed": "",
        class: "video-embed my-4 aspect-video overflow-hidden rounded-xl",
      },
      [
        "iframe",
        mergeAttributes(HTMLAttributes, {
          class: "h-full w-full",
          allowfullscreen: "true",
          frameborder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setIframeEmbed:
        (options) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),
    };
  },
});
