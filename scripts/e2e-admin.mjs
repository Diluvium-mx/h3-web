// Prueba de punta a punta. Uso: node scripts/e2e-admin.mjs http://localhost:3000
// Requiere Playwright (global o `npm i -D playwright`). Supone el inventario de data/seed.json.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const B = process.argv[2] || 'http://localhost:3000';
const step = (m) => console.log('✔', m);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  try {
    await page.goto(B + '/admin');
    await page.waitForURL('**/admin/login');
    step('redirige a login sin sesión');
    await page.fill('input[name=password]', 'mala');
    await page.click('button:has-text("Entrar")');
    await page.getByText('Contraseña incorrecta').waitFor();
    step('rechaza contraseña incorrecta');
    await page.fill('input[name=password]', 'h3admin');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(B + '/admin');
    await page.getByText('Mercedes-Benz G63 AMG').first().waitFor({ timeout: 30000 });
    const rows = await page.locator('ul > li').count();
    step('login correcto, autos en lista: ' + rows);

    await page.goto(B + '/admin/autos/nuevo');
    await page.getByText('Agregar fotos').waitFor({ timeout: 30000 });
    await page.setInputFiles('input[type=file]', [path.join(ROOT, 'app/opengraph-image.jpg'), path.join(ROOT, 'public/brand/icon-512.png')]);
    await page.locator('text=Portada').waitFor({ timeout: 30000 });
    await page.waitForFunction(() => !document.querySelector('.animate-spin'), null, { timeout: 30000 });
    step('2 fotos subidas y comprimidas');
    await page.fill('input[list=brands]', 'Porsche');
    await page.fill('input[placeholder="Ej. M3"]', 'Cayenne');
    await page.fill('input[placeholder="Ej. Competition"]', 'Coupé Platinum');
    await page.fill('input[placeholder="2021"]', '2022');
    await page.fill('input[placeholder="650,000"]', '1450000');
    await page.fill('input[placeholder="45,000"]', '31000');
    await page.click('[role=radiogroup][aria-label=Tipo] >> text=SUV');
    await page.click('[role=radiogroup][aria-label=Transmisión] >> text=Automática');
    await page.click('text=+ Único dueño');
    await page.fill('textarea', 'Auto de prueba creado por el test automático.');
    await page.click('button:has-text("Publicar auto")');
    await page.waitForURL(B + '/admin', { timeout: 30000 });
    await page.getByText('Porsche Cayenne Coupé Platinum').waitFor({ timeout: 30000 });
    step('auto creado y visible en el panel');

    const res = await page.goto(B + '/autos/porsche-cayenne-coupe-platinum-2022');
    console.log('  página pública status', res.status());
    await page.getByText('$1,450,000').first().waitFor({ timeout: 30000 });
    step('página pública del auto nuevo funciona');
    const wa = await page.locator('a:has-text("Me interesa este auto")').getAttribute('href');
    console.log('  WhatsApp:', decodeURIComponent(wa));
    await page.goto(B + '/autos');
    await page.getByText('14 autos encontrados').waitFor({ timeout: 30000 });
    step('catálogo actualizado (14)');

    await page.goto(B + '/admin');
    const row = page.locator('li', { hasText: 'Porsche Cayenne' });
    await row.locator('select').selectOption('vendido');
    await page.waitForTimeout(2500);
    await page.goto(B + '/autos');
    await page.getByText('13 autos encontrados').waitFor({ timeout: 30000 });
    step('marcado como vendido → sale del catálogo');
    await page.goto(B + '/');
    await page.getByText('Recién vendidos').waitFor({ timeout: 30000 });
    step('aparece en "Recién vendidos" en inicio');

    await page.goto(B + '/admin/autos/' + (await (async () => {
      await page.goto(B + '/admin');
      const href = await page.locator('li', { hasText: 'Porsche Cayenne' }).locator('a[aria-label=Editar]').getAttribute('href');
      return href.split('/').pop();
    })()));
    await page.getByText('Guardar cambios').waitFor({ timeout: 30000 });
    await page.fill('input[placeholder="650,000"]', '1399000');
    await page.click('button:has-text("Guardar cambios")');
    await page.waitForURL(B + '/admin', { timeout: 30000 });
    await page.getByText('$1,399,000').waitFor({ timeout: 30000 });
    step('edición de precio guardada');

    const r2 = page.locator('li', { hasText: 'Porsche Cayenne' });
    await r2.locator('button[aria-label=Eliminar]').click();
    await r2.locator('button:has-text("Eliminar")').click();
    await page.waitForTimeout(2500);
    await page.reload();
    const still = await page.getByText('Porsche Cayenne').count();
    if (still) throw new Error('no se eliminó');
    step('auto eliminado');
  } catch (e) {
    console.log('✘ FALLO:', e.message);
    process.exitCode = 1;
  }
  if (errors.length) console.log('ERRORES DE CONSOLA:\n' + [...new Set(errors)].slice(0, 10).join('\n'));
  await browser.close();
})();
