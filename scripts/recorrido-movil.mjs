// Graba en video un recorrido completo del sitio en tamaño de celular (iPhone y Android), incluido el panel.
// Uso, con el sitio corriendo (npm run dev o npm run movil):
//   node scripts/recorrido-movil.mjs http://localhost:3000 [carpeta-de-salida]
// Los videos (.webm) se abren en Chrome o en QuickTime/VLC. La carpeta por defecto es recorridos/ (ignorada por git).
// Usa la contraseña de desarrollo local del panel (h3admin) o ADMIN_PASSWORD si está definida.
import { createRequire } from "node:module";
import { mkdirSync, renameSync } from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const B = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || "recorridos";
const PASSWORD = process.env.ADMIN_PASSWORD || "h3admin";

const DEVICES = [
  {
    name: "iphone",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "android",
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  },
];

const pause = (page, ms = 900) => page.waitForTimeout(ms);

// Desplaza poco a poco, como un dedo, hasta el final o hasta `max` pixeles
async function scrollDown(page, max = Infinity, step = 380) {
  let y = 0;
  const total = Math.min(max, await page.evaluate(() => document.body.scrollHeight - innerHeight));
  while (y < total) {
    await page.mouse.wheel(0, step);
    y += step;
    await page.waitForTimeout(260);
  }
}

async function tour(page) {
  // Inicio
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await pause(page, 2200);
  await scrollDown(page);
  await pause(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await pause(page, 1200);

  // Catálogo y filtros
  await page.locator("a", { hasText: /Ver los \d+ autos/ }).first().tap();
  await page.waitForURL("**/autos");
  await pause(page, 1500);
  await page.locator("button", { hasText: "SUV" }).first().tap();
  await pause(page, 1500);
  await page.locator("button:has(svg.lucide-sliders-horizontal)").tap();
  await pause(page, 1500);
  await page.keyboard.press("Escape").catch(() => {});
  await page.getByRole("dialog").locator("button", { hasText: /^Ver / }).tap().catch(() => {});
  await pause(page, 1000);
  await scrollDown(page, 1600);

  // Ficha de un auto: fotos por sección, equipamiento y botones
  await page.goto(B + "/autos/ford-expedition-platinum-4x4-2017", { waitUntil: "networkidle" });
  await pause(page, 2200);
  await scrollDown(page, 900);
  await pause(page);
  const tabs = page.locator("section[aria-labelledby=fotos]").getByRole("tab", { name: /Interior/ });
  if (await tabs.count()) {
    await tabs.first().tap();
    await pause(page, 1500);
    await page.locator("section[aria-labelledby=fotos] ul button").first().tap();
    await pause(page, 1500);
    await page.keyboard.press("Escape");
    await pause(page);
  }
  await scrollDown(page, 3200);
  await pause(page, 1200);

  // Vende tu auto
  await page.goto(B + "/vende-tu-auto", { waitUntil: "networkidle" });
  await pause(page, 1500);
  await page.fill('input[placeholder="Ej. BMW"]', "Audi");
  await page.fill('input[placeholder="Ej. Serie 3"]', "Q5");
  await page.fill('input[placeholder="Ej. 2021"]', "2020");
  await pause(page, 600);
  await page.locator("button", { hasText: "Continuar" }).tap();
  await pause(page, 1500);
  await page.evaluate(() => localStorage.clear());

  // Panel
  await page.goto(B + "/admin/login", { waitUntil: "networkidle" });
  await pause(page, 1200);
  await page.fill("input[name=password]", PASSWORD);
  await pause(page, 500);
  await page.locator("button", { hasText: "Entrar" }).tap();
  await page.waitForURL(B + "/admin", { timeout: 30000 });
  await pause(page, 2000);
  await scrollDown(page, 1400);
  const edit = await page.locator("li", { hasText: "Expedition" }).locator("a[aria-label=Editar]").first().getAttribute("href");
  await page.goto(B + edit, { waitUntil: "networkidle" });
  await pause(page, 2000);
  await scrollDown(page, 5200);
  await pause(page, 1200);
  await page.goto(B + "/admin/resenas", { waitUntil: "networkidle" });
  await pause(page, 2000);
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const d of DEVICES) {
  const ctx = await browser.newContext({
    viewport: d.viewport,
    deviceScaleFactor: d.deviceScaleFactor,
    userAgent: d.userAgent,
    isMobile: true,
    hasTouch: true,
    locale: "es-MX",
    recordVideo: { dir: OUT, size: d.viewport },
  });
  const page = await ctx.newPage();
  try {
    await tour(page);
    console.log("✔ recorrido", d.name);
  } catch (e) {
    console.log("✘ recorrido", d.name, e.message.split("\n")[0]);
    process.exitCode = 1;
  }
  const video = page.video();
  await ctx.close();
  const file = path.join(OUT, `recorrido-${d.name}.webm`);
  renameSync(await video.path(), file);
  console.log("  video:", file);
}
await browser.close();
