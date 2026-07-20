import sanitizeHtml from "sanitize-html";

// Sanitize blog HTML (from the Tiptap editor) before storing and before
// rendering on public pages. Allows the tags the editor can produce plus
// safe attributes for images and links (incl. internal /blog links).
const OPTIONS = {
    allowedTags: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "a", "ul", "ol", "li", "blockquote",
        "b", "strong", "i", "em", "u", "s", "code", "pre",
        "br", "hr", "span", "img", "figure", "figcaption",
        "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        img: ["src", "alt", "title", "width", "height", "loading"],
        span: ["class"],
        code: ["class"],
        pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
        // Force safe rel on external links, keep internal links clean.
        a: (tagName, attribs) => {
            const href = attribs.href || "";
            const isInternal =
                href.startsWith("/") || href.startsWith("#");
            return {
                tagName: "a",
                attribs: isInternal
                    ? { ...attribs }
                    : { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
            };
        },
    },
};

export function sanitizeBlogHtml(dirty = "") {
    return sanitizeHtml(String(dirty), OPTIONS);
}

// Plain-text version of HTML, useful for excerpt / meta description fallbacks.
export function htmlToText(html = "") {
    return sanitizeHtml(String(html), { allowedTags: [], allowedAttributes: {} })
        .replace(/\s+/g, " ")
        .trim();
}
