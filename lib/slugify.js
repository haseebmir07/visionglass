// Convert an arbitrary string into a lowercase, hyphenated, URL-safe slug.
export function slugify(input = "") {
    return String(input)
        .normalize("NFKD")               // split accented chars into base + diacritic
        .replace(/[\u0300-\u036f]/g, "") // strip diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")    // remove non alphanumeric (except spaces/hyphens)
        .replace(/[\s_]+/g, "-")         // spaces/underscores -> hyphen
        .replace(/-+/g, "-")             // collapse multiple hyphens
        .replace(/^-+|-+$/g, "");        // trim leading/trailing hyphens
}

// Estimate reading time (minutes) from HTML content at ~200 wpm.
export function estimateReadingTime(html = "") {
    const text = String(html).replace(/<[^>]*>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}
