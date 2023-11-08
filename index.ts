import OpenAI from "openai";
import { performance } from "perf_hooks";
import { getHtml } from "./browser";
import { getSystemPrompt, responseSchema } from "./prompt";
import { getCleanTextFromHtml } from "./utils";

const openai = new OpenAI();

const html = await getHtml("http://www.lastrada.cz/cz/denni-menu/");
const cleanText = getCleanTextFromHtml(html);

const system = getSystemPrompt(cleanText);

console.log("System prompt", system);

console.log("Starting completion");

const startCompletion = performance.now();
const completion = await openai.chat.completions.create({
  messages: [{ role: "system", content: system }],
  // model: "gpt-3.5-turbo-1106",
  model: "gpt-4-1106-preview",
  response_format: { type: "json_object" },
});
const endCompletion = performance.now();

console.log({
  elapsed: endCompletion - startCompletion,
  usage: completion.usage,
  response: completion.choices[0].message.content,
});

if (completion.choices[0].message.content === null) {
  throw new Error("No response");
}

const response = responseSchema.parse(
  JSON.parse(completion.choices[0].message.content)
);

console.log(response);
process.exit(1);
