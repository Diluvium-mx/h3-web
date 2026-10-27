// Prueba de la subida de fotos a Cloudinary, simulando las respuestas de Cloudinary.
// Uso (con datos de prueba, NO los reales):
//   CLOUDINARY_URL=cloudinary://111:secreto-de-prueba@h3prueba npm run dev
//   node scripts/e2e-cloudinary.mjs http://localhost:3000
// Requiere Playwright (global o `npm i -D playwright`).
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const B = process.argv[2] || "http://localhost:3000";
const CLOUD = "h3prueba";
const SECRET = "secreto-de-prueba";
const photo = readFileSync(path.join(ROOT, "app/opengraph-image.jpg"));
const step = (m) => console.log("✔", m);

function parseMultipart(body, contentType) {
  const boundary = contentType.split("boundary=")[1];
  const fields = {};
  for (const part of body.toString("latin1").split(`--${boundary}`)) {
    const name = part.match(/name="([^"]+)"/)?.[1];
    if (!name || name === "file") continue;
    fields[name] = part.split("\r\n\r\n")[1]?.replace(/\r\n$/, "");
  }
  return fields;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const uploads = [];
  let n = 0;
  await ctx.route(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, async (route) => {
    const req = route.request();
    const f = parseMultipart(req.postDataBuffer(), req.headers()["content-type"]);
    const { signature, api_key, ...signed } = f;
    const expected = createHash("sha1")
      .update(Object.keys(signed).sort().map((k) => `${k}=${signed[k]}`).join("&") + SECRET)
      .digest("hex");
    uploads.push({ ok: signature === expected && api_key === "111", folder: f.folder, transformation: f.transformation });
    n += 1;
    await route.fulfill({
      json: { secure_url: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/h3/autos/prueba-${n}.jpg` },
    });
  });
  await ctx.route("https://res.cloudinary.com/**", (route) =>
    route.fulfill({ body: photo, contentType: "image/jpeg" }),
  );
  try {
    await page.goto(B + "/admin/login");
    await page.fill("input[name=password]", "h3admin");
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(B + "/admin");
    await page.goto(B + "/admin/autos/nuevo");
    await page.getByText("Agregar fotos").waitFor({ timeout: 30000 });
    await page.setInputFiles("input[type=file]", [
      path.join(ROOT, "app/opengraph-image.jpg"),
      path.join(ROOT, "public/brand/icon-512.png"),
    ]);
    await page.locator("text=Portada").waitFor({ timeout: 30000 });
    await page.waitForFunction(() => !document.querySelector(".animate-spin"), null, { timeout: 30000 });
    if (uploads.length !== 2 || !uploads.every((u) => u.ok)) throw new Error("firma inválida: " + JSON.stringify(uploads));
    step(`2 fotos subidas directo a Cloudinary con firma válida (carpeta ${uploads[0].folder}, ${uploads[0].transformation})`);
    await page.fill("input[list=brands]", "Prueba");
    await page.fill('input[placeholder="Ej. M3"]', "Cloudinary");
    await page.fill('input[placeholder="2021"]', "2020");
    await page.fill('input[placeholder="650,000"]', "100000");
    await page.click("[role=radiogroup][aria-label=Tipo] >> text=SUV");
    await page.click('button:has-text("Publicar auto")');
    await page.waitForURL(B + "/admin", { timeout: 30000 });
    await page.goto(B + "/autos/prueba-cloudinary-2020");
    const src = await page.locator('img[alt="Prueba Cloudinary 2020"]').first().getAttribute("src");
    if (!src?.includes(`res.cloudinary.com/${CLOUD}/image/upload/f_auto`)) throw new Error("src inesperado: " + src);
    step("la página pública pide la foto optimizada a Cloudinary: " + src.split("/upload/")[1]);
    await page.goto(B + "/admin");
    const row = page.locator("li", { hasText: "Prueba Cloudinary" });
    await row.locator("button[aria-label=Eliminar]").click();
    await row.locator('button:has-text("Eliminar")').click();
    await page.waitForTimeout(2500);
    await page.reload();
    if (await page.getByText("Prueba Cloudinary").count()) throw new Error("no se eliminó");
    step("auto de prueba eliminado");
  } catch (e) {
    console.log("✘ FALLO:", e.message);
    process.exitCode = 1;
  }
  await browser.close();
})();
