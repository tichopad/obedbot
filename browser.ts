import puppeteer from "puppeteer";

export async function getHtml(url: string): Promise<string> {
  console.log("Starting browser");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(url);
  // @ts-ignore
  const html = await page.evaluate(() => document.body.innerHTML);
  await browser.close();

  console.log("Got HTML");

  await Bun.write("./test.html", html);

  return html;
}
