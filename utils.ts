import { convert } from "html-to-text";

export function getCleanTextFromHtml(html: string): string {
  const text = convert(html, {
    // Remove hrefs
    selectors: [{ selector: "a", options: { ignoreHref: true } }],
    wordwrap: false,
  });
  const cleanText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  console.log("Got clean text", cleanText);

  return cleanText;
}
