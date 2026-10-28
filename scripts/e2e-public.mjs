// Prueba de punta a punta. Uso: node scripts/e2e-public.mjs http://localhost:3000
// Requiere Playwright (global o `npm i -D playwright`). Supone el inventario de data/seed.json.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const B = process.argv[2] || 'http://localhost:3000';
const step = (m) => console.log('✔', m);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  try {
    // Inicio: estructura de landing (hero con prueba social, CTA, sin miedos, preguntas)
    await page.goto(B + '/');
    await page.getByRole('heading', { level: 1 }).filter({ hasText: 'sin sorpresas' }).waitFor({ timeout: 30000 });
    await page.getByText('13 autos disponibles hoy').first().waitFor();
    for (const t of ['Precio a la vista', 'Fotos reales de cada auto', 'Respuesta inmediata']) await page.getByText(t).first().waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) throw new Error('scroll horizontal en inicio: ' + overflow + 'px');
    const heroCta = page.locator('a', { hasText: 'Ver los 13 autos' }).first();
    if (!(await heroCta.isVisible())) throw new Error('el botón principal no se ve sin hacer scroll');
    const box = await heroCta.boundingBox();
    if (box.y + box.height > 844) throw new Error('el botón principal queda abajo del primer pantallazo');
    step('hero: prueba social, título, botón y quita-miedos en el primer pantallazo');
    const faq = page.locator('details', { hasText: '¿Puedo ver el auto en persona?' });
    await faq.locator('summary').click();
    await faq.getByText('de lunes a sábado de').waitFor();
    step('preguntas frecuentes abren');
    await page.locator('a[href="/autos?tipo=Blindado"]').first().click();
    await page.getByText('2 autos encontrados').waitFor({ timeout: 30000 });
    step('historia «Blindados» del inicio filtra el catálogo → 2');
    await page.goto(B + '/');
    const budget = page.locator('a[href="/autos?precio=0-300000"]');
    const label = (await budget.innerText()).match(/(\d+) autos?/)[1];
    await budget.click();
    await page.getByText(`${label} ${label === '1' ? 'auto encontrado' : 'autos encontrados'}`).waitFor({ timeout: 30000 });
    step(`presupuesto «Hasta $300k» del inicio coincide con el catálogo → ${label}`);

    // Catálogo con filtro desde URL
    await page.goto(B + '/autos?tipo=Deportivo');
    await page.getByText('3 autos encontrados').waitFor({ timeout: 30000 });
    step('filtro por URL (?tipo=Deportivo) → 3');
    await page.click('button:has-text("Todos")');
    await page.getByText('13 autos encontrados').waitFor();
    if (!page.url().endsWith('/autos')) throw new Error('URL no se limpió: ' + page.url());
    step('limpiar filtro actualiza URL');
    await page.fill('input[type=search]', 'bmw');
    await page.getByText('2 autos encontrados').waitFor();
    step('búsqueda "bmw" → 2; url=' + page.url().split('/').pop());
    await page.fill('input[type=search]', '');
    await page.click('button:has(svg.lucide-sliders-horizontal)');
    await page.getByRole('dialog', { name: 'Filtros' }).waitFor();
    await page.getByRole('dialog').locator('button:has-text("Más de $1M")').click();
    await page.getByRole('dialog').locator('button:has-text("Ver 1 auto")').click();
    await page.getByText('1 auto encontrado').waitFor();
    step('hoja de filtros móvil (Más de $1M) → 1');
    await page.goto(B + '/autos?marca=Tesla');
    await page.getByText('Sin resultados').waitFor();
    step('estado vacío con CTA de WhatsApp');

    // Detalle + galería
    await page.goto(B + '/autos/bmw-m3-2018');
    await page.getByText('1 / 22').first().waitFor({ timeout: 30000 });
    await page.waitForLoadState('networkidle');
    const track = page.locator('[aria-roledescription=carrusel]');
    await track.evaluate(el => el.scrollTo({ left: el.clientWidth * 3 }));
    await page.getByText('4 / 22').first().waitFor();
    step('galería deslizable actualiza contador (4/22)');
    await page.click('button[aria-label^="Ver foto 4"]');
    await page.getByRole('dialog', { name: 'Galería' }).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('dialog', { name: 'Galería' }).waitFor({ state: 'detached' });
    step('pantalla completa abre y cierra');

    // Menú móvil
    await page.goto(B + '/');
    await page.click('button[aria-label="Abrir menú"]');
    await page.locator('#mobile-menu').waitFor();
    await page.locator('#mobile-menu >> text=Vende tu auto').click();
    await page.waitForURL('**/vende-tu-auto');
    step('menú móvil navega');

    // Formulario de venta
    await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
    await page.click('button:has-text("Continuar")');
    await page.getByText('Escribe la marca y el modelo.').waitFor();
    step('validación del paso 1');
    await page.fill('input[placeholder="Ej. BMW"]', 'Audi');
    await page.fill('input[placeholder="Ej. Serie 3"]', 'Q5');
    await page.fill('input[placeholder="Ej. 2021"]', '2020');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[placeholder="Ej. 45,000"]', '58000');
    await page.click('[aria-label="Estado"] >> text=Excelente');
    await page.click('[aria-label="Factura"] >> text=Original');
    await page.click('button:has-text("Continuar")');
    await page.fill('input[placeholder="¿Cómo te llamas?"]', 'Carlos');
    await page.click('button:has-text("Enviar por WhatsApp")');
    const opened = await page.evaluate(() => window.__opened);
    console.log('  mensaje:\n' + decodeURIComponent(opened[0].split('text=')[1]).split('\n').map(l => '    ' + l).join('\n'));
    step('formulario de venta abre WhatsApp con mensaje armado');
    await page.reload();
    await page.waitForFunction(() => document.querySelector('input[placeholder="Ej. BMW"]')?.value === 'Audi', null, { timeout: 15000 });
    const kept = await page.inputValue('input[placeholder="Ej. BMW"]');
    step('borrador guardado tras recargar: ' + kept);
    await page.evaluate(() => localStorage.clear());

    // 404
    const r = await page.goto(B + '/autos/no-existe-123');
    await page.getByText('Te saliste de la pista').waitFor({ timeout: 30000 });
    step('404 de auto inexistente (status ' + r.status() + ', robots=' + await page.locator('meta[name=robots]').first().getAttribute('content').catch(() => 'n/a') + ')');
    const r2 = await page.goto(B + '/pagina-rara');
    await page.getByText('Te saliste de la pista').waitFor({ timeout: 30000 });
    step('404 global (status ' + r2.status() + ')');
  } catch (e) {
    console.log('✘ FALLO:', e.message);
    process.exitCode = 1;
  }
  if (errors.length) console.log('ERRORES DE CONSOLA:\n' + [...new Set(errors)].slice(0, 8).join('\n'));
  await browser.close();
})();
