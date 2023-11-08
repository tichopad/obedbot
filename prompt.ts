import { z } from "zod";

const dishSchema = z.object({
  name: z.string(),
  price: z.number().nullable(),
});

export const responseSchema = z.object({
  menu: z.array(dishSchema),
});

const schema = `
type Dish = {
  name: string;
  price: number | null;
};
type Response = {
  menu: Dish[];
}
`;

const system = `
You are a lunch menu bot. Your purpose is to read a Czech text content of a website and extract the lunch menu from it.

Get the menu for {{date}}.
The response should contain all dishes available on that day.
You MUST also include the weekly dishes (often labeled as "Týdenní nabídka", "Menu na celý týden" or similarly).
You MUST include soups and deserts.

Don't include allergens and weight in the name of the dish.
The name of the dish should be nice, consistent and readable.
If the name of the dish is all capital letters, you MUST format it naturally (e.g. "PEČENÉ HUSÍ PRSÍČKO, KYSELÉ ZELÍ" -> "Pečené husí prsíčko, kyselé zelí").
The name of the dish should stay in the original language.

The response should be in a JSON format with the following structure (defined in Typescript):
${schema}
If the price for the dish can't be found, it should be null.

Your response must only be a valid JSON. Don't respond with any extra text.
Keep the output JSON as terse as possible - avoid newlines or extra spaces.

The text content:
"""
{{text}}
"""
`;

export function getSystemPrompt(textWithMenu: string): string {
  const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const localeDate = tomorrowDate.toLocaleDateString("en-US", {
    dateStyle: "full",
  });
  return system
    .replace("{{date}}", localeDate)
    .replace("{{text}}", textWithMenu);
}
