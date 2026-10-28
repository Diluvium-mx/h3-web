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
    // Inicio: estructura de landing (título claro, CTA, quita-miedos, confianza, inventario, vende tu auto)
    await page.goto(B + '/');
    await page.getByRole('heading', { level: 1 }).filter({ hasText: 'Autos seminuevos premium' }).waitFor({ timeout: 30000 });
    for (const t of ['Precio a la vista', 'Fotos reales de cada auto', 'Respuesta inmediata']) await page.getByText(t).first().waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) throw new Error('scroll horizontal en inicio: ' + overflow + 'px');
    const heroCta = page.locator('a', { hasText: 'Ver inventario' }).first();
    if (!(await heroCta.isVisible())) throw new Error('el botón principal no se ve sin hacer scroll');
    const box = await heroCta.boundingBox();
    if (box.y + box.height > 844) throw new Error('el botón principal queda abajo del primer pantallazo');
    step('hero: título, botón y quita-miedos en el primer pantallazo');
    // Lo que el dueño pidió quitar (28-oct)
    for (const gone of ['autos disponibles hoy', '¿Cuál es tu presupuesto?', 'Ver del más barato al más caro']) {
      if (await page.getByText(gone).count()) throw new Error('debería haberse quitado: ' + gone);
    }
    if (await page.locator('a[href*="waze"]').count()) throw new Error('debería haberse quitado el botón de Waze');
    if (await page.locator('a[href="/autos?precio=0-300000"]').count()) throw new Error('debería haberse quitado el presupuesto');
    step('sin «N autos disponibles hoy», sin presupuesto y sin Waze');
    await page.getByText('Autos entregados').first().waitFor();
    await page.getByText('Números de ejemplo').first().waitFor();
    step('números de confianza (de ejemplo, solo en desarrollo)');
    await page.getByRole('heading', { name: 'Autos listos para manejar' }).waitFor();
    const sell = page.getByRole('heading', { name: '¿Quieres vender tu auto?' });
    const reviews = page.locator('#diferencia');
    if ((await sell.boundingBox()).y > (await reviews.boundingBox()).y) throw new Error('«Vende tu auto» debe ir más arriba');
    step('«Autos listos para manejar» y «¿Quieres vender tu auto?» arriba');
    const faq = page.locator('details', { hasText: '¿Puedo ver el auto en persona?' });
    await faq.locator('summary').click();
    await faq.getByText('de lunes a sábado de').waitFor();
    step('preguntas frecuentes abren');
    await page.locator('a[href="/autos?tipo=Blindado"]').first().click();
    await page.getByText('2 autos encontrados').waitFor({ timeout: 30000 });
    step('categoría «Blindados» del inicio filtra el catálogo → 2');
    await page.goto(B + '/');
    await page.locator('footer a[href="/admin/login"]', { hasText: 'Administración' }).waitFor();
    step('acceso discreto al panel en el pie de página');

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

    // Detalle: botón, quita-miedos y dato faltante en el primer pantallazo
    await page.goto(B + '/autos/ford-mustang-gt-premium-2022');
    const cta = page.locator('#cta-principal');
    await cta.waitFor({ timeout: 30000 });
    const cb = await cta.boundingBox();
    if (cb.y + cb.height > 844) throw new Error('el botón de WhatsApp queda abajo del primer pantallazo: ' + Math.round(cb.y + cb.height));
    await page.getByText('Te respondemos de inmediato').first().waitFor();
    const ask = page.locator('a', { hasText: 'Kilometraje: pregúntanos' }).first();
    const askHref = decodeURIComponent(await ask.getAttribute('href'));
    if (!askHref.includes('kilometraje') || !askHref.includes('Ford Mustang GT Premium 2022')) throw new Error('mensaje de dato faltante: ' + askHref);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    if (!ld.some((t) => t.includes('BreadcrumbList'))) throw new Error('faltan migas de pan para Google');
    step('detalle: botón y quita-miedos en el primer pantallazo, «Kilometraje: pregúntanos» y migas de pan');
    await page.locator('button[aria-label="Ver foto 3 de 10"]').click();
    await page.getByRole('dialog', { name: 'Galería' }).getByText('3 / 10').waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('dialog', { name: 'Galería' }).waitFor({ state: 'detached' });
    await page.click('button:has-text("Ver las 10 fotos")');
    await page.locator('button[aria-label="Ver foto 10 de 10"]').waitFor();
    step('cuadrícula de fotos: abre la foto tocada y muestra todas');

    // Fotos por sección y equipamiento con lista fija
    await page.goto(B + '/autos/bmw-m3-2018');
    await page.getByRole('tab', { name: /Interior/ }).first().waitFor({ timeout: 30000 });
    await page.locator('section[aria-labelledby=fotos]').getByRole('tab', { name: /Interior/ }).click();
    await page.click('button:has-text("Ver las 10 fotos")');
    if ((await page.locator('section[aria-labelledby=fotos] ul button[aria-label$="de 10"]').count()) !== 10) throw new Error('la pestaña Interior no muestra 10 fotos');
    step('fotos por sección: «Interior» del M3 muestra sus 10 fotos');
    await page.goto(B + '/autos/ford-expedition-platinum-4x4-2017');
    await page.locator('a[href="#equipamiento"]', { hasText: 'Equipamiento (9)' }).waitFor({ timeout: 30000 });
    const eqItems = await page.locator('section#equipamiento li').count();
    if (eqItems !== 9) throw new Error('equipamiento esperado 9, hay ' + eqItems);
    if (await page.locator('section[aria-labelledby=destaca]').getByText('Asientos con calefacción y ventilación').count()) throw new Error('«Lo que destaca» repite el equipamiento');
    step('equipamiento: 9 elementos agrupados y sin repetir en «Lo que destaca»');

    // «Tus dudas, resueltas»: contesta con datos reales o pregunta por WhatsApp
    await page.goto(B + '/autos/toyota-land-cruiser-blindada-2014');
    const dudas = page.locator('#dudas');
    await dudas.waitFor({ timeout: 30000 });
    await dudas.getByText('Factura de empresa.').waitFor();
    await dudas.getByText('Nivel 3 Plus (BS Blindaje).').waitFor();
    const askServ = dudas.locator('div', { hasText: '¿Tiene sus servicios?' }).locator('a').first();
    const askMsg = decodeURIComponent(await askServ.getAttribute('href'));
    if (!askMsg.includes('¿Tiene sus servicios?') || !askMsg.includes('Toyota Land Cruiser')) throw new Error('pregunta sin el auto: ' + askMsg);
    step('dudas: factura y blindaje contestados; lo que falta pregunta por WhatsApp con el auto');

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
    await page.getByRole('heading', { name: 'Este auto ya no está' }).waitFor({ timeout: 30000 });
    const robots = await page.locator('meta[name=robots]').first().getAttribute('content').catch(() => 'n/a');
    if (!robots?.includes('noindex')) throw new Error('el auto que ya no existe debe llevar noindex: ' + robots);
    step('auto inexistente: «Este auto ya no está» con autos disponibles (status ' + r.status() + ', robots=' + robots + ')');
    await page.goto(B + '/autos/bmw-x5-xdrive40i-2015');
    await page.getByRole('heading', { name: 'BMW disponibles' }).waitFor({ timeout: 30000 });
    await page.locator('a', { hasText: 'Ver los 2 BMW' }).click();
    await page.getByText('2 autos encontrados').waitFor({ timeout: 30000 });
    step('enlace viejo de un BMW → ofrece los BMW disponibles y filtra el catálogo');
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
