// Prueba de punta a punta. Uso: node scripts/e2e-admin.mjs http://localhost:3000
// Requiere Playwright (global o `npm i -D playwright`). Supone el inventario de data/seed.json.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const B = process.argv[2] || 'http://localhost:3000';
const step = (m) => console.log('✔', m);
// La prueba cambia la contraseña del panel: se respalda el archivo de ajustes y se restaura al final
const SETTINGS = path.join(ROOT, 'data/settings.local.json');
const settingsBackup = fs.existsSync(SETTINGS) ? fs.readFileSync(SETTINGS, 'utf8') : null;
if (settingsBackup) {
  const s = JSON.parse(settingsBackup);
  delete s.adminPassword;
  fs.writeFileSync(SETTINGS, JSON.stringify(s, null, 2));
}
const PASSWORD = process.env.ADMIN_PASSWORD || '12345';
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
    await page.fill('input[name=password]', PASSWORD);
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(B + '/admin');
    await page.getByText('Mercedes-Benz G63 AMG').first().waitFor({ timeout: 30000 });
    const rows = await page.locator('ul > li').count();
    step('login correcto, autos en lista: ' + rows);
    if (!process.env.ADMIN_PASSWORD) {
      await page.getByText('Estás usando la contraseña inicial').waitFor();
      step('aviso para cambiar la contraseña inicial');
    }

    await page.goto(B + '/admin/autos/nuevo');
    await page.getByText('Agregar fotos').waitFor({ timeout: 30000 });
    await page.setInputFiles('input[type=file]', [path.join(ROOT, 'app/opengraph-image.jpg'), path.join(ROOT, 'public/brand/icon-512.png')]);
    await page.getByText('Portada', { exact: true }).first().waitFor({ timeout: 30000 });
    await page.waitForFunction(() => !document.querySelector('.animate-spin'), null, { timeout: 30000 });
    step('2 fotos subidas y comprimidas');
    await page.getByText('Falta:').waitFor();
    await page.fill('input[list=brands]', 'Porsche');
    await page.fill('input[placeholder="Ej. M3"]', 'Cayenne');
    await page.fill('input[placeholder="Ej. Competition"]', 'Coupé Platinum');
    await page.fill('input[placeholder="2021"]', '2022');
    await page.fill('input[placeholder="650,000"]', '1450000');
    await page.fill('input[placeholder="45,000"]', '31000');
    await page.click('[role=radiogroup][aria-label=Tipo] >> text=SUV');
    await page.click('[role=radiogroup][aria-label=Transmisión] >> text=Automática');
    if (await page.locator('text=+ Único dueño').isVisible()) throw new Error('«Más detalles» debería empezar plegado');
    await page.click('summary:has-text("Más detalles")');
    await page.click('text=+ Único dueño');
    await page.fill('textarea', 'Auto de prueba creado por el test automático.');
    // 31-oct: vista previa, dónde va a aparecer y qué falta
    await page.getByText('Así se verá en la página').waitFor();
    await page.getByText('Categoría «SUV»').waitFor();
    await page.getByText('Todo listo para publicar').waitFor();
    step('vista previa de la tarjeta, dónde va a aparecer y «Todo listo para publicar»');
    await page.click('button:has-text("Publicar auto")');
    await page.waitForURL(/\/admin\?(publicado|guardado)=/, { timeout: 30000 });
    await page.getByText('¡Listo! Tu auto ya está en la página.').waitFor({ timeout: 30000 });
    for (const t of ['Ver en la página', 'Compartir por WhatsApp', 'Publicar otro']) await page.getByText(t).first().waitFor();
    await page.getByText('Porsche Cayenne Coupé Platinum').first().waitFor({ timeout: 30000 });
    step('auto creado: confirmación con «Ver en la página», «Compartir» y «Publicar otro»');

    const res = await page.goto(B + '/autos/porsche-cayenne-coupe-platinum-2022');
    console.log('  página pública status', res.status());
    await page.getByText('$1,450,000').first().waitFor({ timeout: 30000 });
    step('página pública del auto nuevo funciona');
    const wa = await page.locator('#cta-principal').getAttribute('href');
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
    await page.goto(B + '/autos/porsche-cayenne-coupe-platinum-2022');
    await page.getByText('Búscame uno similar').first().waitFor({ timeout: 30000 });
    step('su ficha queda como vendido y ofrece «Búscame uno similar»');

    await page.goto(B + '/admin/autos/' + (await (async () => {
      await page.goto(B + '/admin');
      const href = await page.locator('li', { hasText: 'Porsche Cayenne' }).locator('a[aria-label=Editar]').getAttribute('href');
      return href.split('/').pop();
    })()));
    await page.getByText('Guardar cambios').waitFor({ timeout: 30000 });
    await page.fill('input[placeholder="650,000"]', '1399000');
    await page.click('button:has-text("Guardar cambios")');
    await page.waitForURL(/\/admin\?(publicado|guardado)=/, { timeout: 30000 });
    await page.getByText('$1,399,000').first().waitFor({ timeout: 30000 });
    step('edición de precio guardada');

    // Video opcional: rechaza enlaces raros y reproduce YouTube dentro de la ficha
    const editHref = await page.locator('li', { hasText: 'Porsche Cayenne' }).locator('a[aria-label=Editar]').getAttribute('href');
    await page.goto(B + editHref);
    await page.getByText('Guardar cambios').waitFor({ timeout: 30000 });
    await page.fill('input[type=url]', 'https://ejemplo.com/video');
    await page.click('button:has-text("Guardar cambios")');
    await page.getByText('El video debe ser un enlace de YouTube').waitFor({ timeout: 30000 });
    await page.fill('input[type=url]', 'https://youtu.be/dQw4w9WgXcQ');
    await page.selectOption('select[aria-label="Sección de la foto 1"]', 'exterior');
    await page.selectOption('select[aria-label="Sección de la foto 2"]', 'interior');
    await page.click('button[aria-pressed]:has-text("Quemacocos")');
    await page.click('button[aria-pressed]:has-text("Cámara de reversa")');
    await page.fill('input[placeholder="1"]', '2');
    await page.click('[aria-label=Factura] >> text=Refacturada');
    await page.click('button:has-text("Guardar cambios")');
    await page.waitForURL(/\/admin\?(publicado|guardado)=/, { timeout: 30000 });
    await page.goto(B + '/autos/porsche-cayenne-coupe-platinum-2022');
    await page.locator('a[href="#video"]').waitFor({ timeout: 30000 });
    await page.click('button[aria-label^="Reproducir video"]');
    const iframe = await page.locator('iframe[src*="youtube-nocookie.com/embed/dQw4w9WgXcQ"]').count();
    if (!iframe) throw new Error('no se cargó el reproductor de YouTube');
    step('video: rechaza enlaces que no son de redes y reproduce YouTube en la ficha');
    await page.locator('a[href="#equipamiento"]', { hasText: 'Equipamiento (2)' }).waitFor({ timeout: 30000 });
    await page.getByRole('tab', { name: /Interior/ }).first().waitFor();
    step('secciones de foto y equipamiento guardados desde el panel se ven en la ficha');
    await page.goto(B + editHref);
    await page.getByText('Guardar cambios').waitFor({ timeout: 30000 });
    if ((await page.inputValue('input[placeholder="1"]')) !== '2') throw new Error('no se guardó el número de dueños');
    if ((await page.locator('[aria-label=Factura] [role=radio][aria-checked=true]').innerText()) !== 'Refacturada') throw new Error('no se guardó la factura');
    step('documentos e historial (dueños y factura) se guardan');
    await page.goto(B + '/admin');

    const r2 = page.locator('li', { hasText: 'Porsche Cayenne' });
    await r2.locator('button[aria-label=Eliminar]').click();
    await r2.locator('button:has-text("Eliminar")').click();
    await page.waitForTimeout(2500);
    await page.reload();
    const still = await page.getByText('Porsche Cayenne').count();
    if (still) throw new Error('no se eliminó');
    step('auto eliminado');

    // Reseñas: se agregan en el panel y aparecen en el inicio (y se pueden borrar)
    await page.goto(B + '/');
    if (await page.locator('#resenas').count()) throw new Error('hay reseñas antes de la prueba');
    step('sin reseñas, el inicio no muestra la sección');
    await page.goto(B + '/admin/resenas');
    await page.getByText('Nueva reseña').waitFor({ timeout: 30000 });
    await page.fill('input[placeholder="Ej. Carlos M."]', 'Prueba E2E');
    await page.fill('input[placeholder="Ej. BMW M3 2018"]', 'Auto de prueba');
    await page.click('[aria-label="4 estrellas"]');
    await page.fill('textarea', 'Texto de reseña de prueba automática.');
    await page.fill('input[placeholder="Una frase corta tomada de su reseña"]', 'Frase de prueba');
    await page.click('[aria-label=Origen] >> text=Google');
    await page.click('button:has-text("Publicar reseña")');
    await page.locator('li', { hasText: 'Prueba E2E' }).waitFor({ timeout: 30000 });
    await page.goto(B + '/');
    await page.getByText('Texto de reseña de prueba automática.').waitFor({ timeout: 30000 });
    await page.getByText('4.0 · 1 reseña').first().waitFor();
    await page.getByText('Reseña de Google').waitFor();
    step('reseña publicada → aparece en el inicio con su calificación');
    await page.goto(B + '/admin/resenas');
    const rv = page.locator('li', { hasText: 'Prueba E2E' });
    await rv.locator('button[aria-label=Eliminar]').click();
    await rv.locator('button:has-text("Eliminar")').click();
    await rv.waitFor({ state: 'detached', timeout: 30000 });
    await page.goto(B + '/');
    await page.getByRole('heading', { level: 1 }).filter({ hasText: 'Autos seminuevos seleccionados' }).waitFor({ timeout: 30000 });
    if (await page.getByText('Texto de reseña de prueba automática.').count()) throw new Error('la reseña sigue en el inicio');
    step('reseña eliminada → sale del inicio');

    // Ajustes: cambiar la contraseña cierra las otras sesiones
    const other = await (await browser.newContext()).newPage();
    await other.goto(B + '/admin/login');
    await other.fill('input[name=password]', PASSWORD);
    await other.click('button:has-text("Entrar")');
    await other.waitForURL(B + '/admin');
    await page.goto(B + '/admin/ajustes');
    await page.getByText('Contraseña del panel').waitFor({ timeout: 30000 });
    const pw = page.locator('section[aria-labelledby=contrasena] input');
    await pw.nth(0).fill('incorrecta');
    await pw.nth(1).fill('nueva-clave-e2e');
    await pw.nth(2).fill('nueva-clave-e2e');
    await page.click('button:has-text("Cambiar contraseña")');
    await page.getByText('La contraseña actual no es correcta.').waitFor({ timeout: 30000 });
    await pw.nth(0).fill(PASSWORD);
    await pw.nth(2).fill('otra-distinta');
    await page.click('button:has-text("Cambiar contraseña")');
    await page.getByText('no coinciden').waitFor();
    await pw.nth(2).fill('nueva-clave-e2e');
    await page.click('button:has-text("Cambiar contraseña")');
    await page.getByText('entra con tu nueva contraseña').waitFor({ timeout: 30000 });
    step('cambio de contraseña: valida la actual y la confirmación');
    await page.goto(B + '/admin');
    await page.getByText('Mercedes-Benz G63 AMG').first().waitFor({ timeout: 30000 });
    if (await page.getByText('Estás usando la contraseña inicial').count()) throw new Error('el aviso debe quitarse tras cambiarla');
    await other.goto(B + '/admin');
    await other.waitForURL('**/admin/login', { timeout: 30000 });
    step('esta sesión sigue abierta; la del otro dispositivo se cerró');
    await page.click('button:has-text("Cerrar sesión")');
    await page.waitForURL('**/admin/login');
    await page.fill('input[name=password]', PASSWORD);
    await page.click('button:has-text("Entrar")');
    await page.getByText('Contraseña incorrecta').waitFor({ timeout: 30000 });
    await page.fill('input[name=password]', 'nueva-clave-e2e');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(B + '/admin', { timeout: 30000 });
    step('la contraseña anterior ya no entra; la nueva sí');
  } catch (e) {
    console.log('✘ FALLO:', e.message);
    process.exitCode = 1;
  }
  if (errors.length) console.log('ERRORES DE CONSOLA:\n' + [...new Set(errors)].slice(0, 10).join('\n'));
  await browser.close();
  // Restaura la contraseña y los ajustes que había antes de la prueba
  if (settingsBackup !== null) fs.writeFileSync(SETTINGS, settingsBackup);
  else fs.rmSync(SETTINGS, { force: true });
})();
