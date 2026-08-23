export function slugify(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric substrings with "-"
    .replace(/^-|-$/g, ""); // trim leading/trailing "-"
}
