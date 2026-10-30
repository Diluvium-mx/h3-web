// Prueba del panel publicado en Netlify (con Netlify Blobs). Uso:
//   node scripts/e2e-panel-netlify.mjs https://deploy-preview-1--h3-seminuevos.netlify.app
// Entra con la contraseña (12345 o ADMIN_PASSWORD), cambia el precio de un auto, revisa que la ficha
// pública lo muestre y lo regresa a como estaba. Requiere Playwright (global o `npm i -D playwright`).
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const B = (process.argv[2] || "http://localhost:8888").replace(/\/$/, "");
const PASSWORD = process.env.ADMIN_PASSWORD || "12345";
const SLUG = "bmw-m240i-2017";
const step = (m) => console.log("✔", m);
const digits = (s) => s.replace(/[^\d]/g, "");

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // En las vistas previas, Netlify agrega su barra abajo y tapa botones: se oculta solo para la prueba
  await ctx.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const st = document.createElement("style");
      st.textContent = "[data-netlify-deploy-id]{display:none!important}";
      document.head.append(st);
    });
  });
  const page = await ctx.newPage();
  let editUrl = null;
  let original = null;
  try {
    await page.goto(B + "/admin");
    await page.waitForURL("**/admin/login", { timeout: 30000 });
    await page.fill("input[name=password]", PASSWORD);
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(B + "/admin", { timeout: 30000 });
    await page.getByText("BMW M240i").first().waitFor({ timeout: 30000 });
    const banner = await page.locator("body").innerText();
    if (banner.includes("Modo demo")) throw new Error("el panel sigue en modo demo");
    step("entra con la contraseña y ve el inventario (sin modo demo)");

    const href = await page.locator("li", { hasText: "BMW M240i" }).locator("a[aria-label=Editar]").getAttribute("href");
    editUrl = B + href;
    await page.goto(editUrl);
    await page.getByText("Guardar cambios").waitFor({ timeout: 30000 });
    original = await page.inputValue('input[placeholder="650,000"]');
    const changed = String(Number(digits(original)) + 1000);
    await page.fill('input[placeholder="650,000"]', changed);
    await page.click('button:has-text("Guardar cambios")');
    await page.waitForURL(B + "/admin", { timeout: 30000 });
    step(`precio guardado: ${original} → ${changed}`);

    const pub = await browser.newPage();
    const want = "$" + Number(changed).toLocaleString("en-US");
    let seen = false;
    for (let i = 0; i < 6 && !seen; i++) {
      await pub.goto(`${B}/autos/${SLUG}?r=${Date.now()}`);
      seen = (await pub.getByText(want).count()) > 0;
      if (!seen) await pub.waitForTimeout(5000);
    }
    if (!seen) throw new Error("la ficha pública no muestra el precio nuevo " + want);
    await pub.close();
    step("la ficha pública muestra el precio nuevo");
  } catch (e) {
    console.log("✘ FALLO:", e.message);
    process.exitCode = 1;
  } finally {
    // Regresa el precio original
    if (editUrl && original) {
      try {
        await page.goto(editUrl);
        await page.getByText("Guardar cambios").waitFor({ timeout: 30000 });
        await page.fill('input[placeholder="650,000"]', digits(original));
        await page.click('button:has-text("Guardar cambios")');
        await page.waitForURL(B + "/admin", { timeout: 30000 });
        step("precio regresado a " + original);
      } catch (e) {
        console.log("✘ no se pudo regresar el precio:", e.message);
        process.exitCode = 1;
      }
    }
    await browser.close();
  }
})();
