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
  // En las vistas previas, Netlify agrega su barra abajo y tapa botones: se oculta solo para la prueba
  await ctx.addInitScript(() => {
    const css = '[data-netlify-deploy-id]{display:none!important}';
    document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = css; document.head.append(st); });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  try {
    // Inicio: estructura de landing (título claro, CTA, quita-miedos, confianza, inventario, vende tu auto)
    await page.goto(B + '/');
    await page.getByRole('heading', { level: 1 }).filter({ hasText: 'Autos seminuevos premium' }).waitFor({ timeout: 30000 });
    // Los quita-miedos van en el cierre (y en el hero en pantallas grandes)
    for (const t of ['Autos verificados', 'Papeles en regla', 'Precio a la vista']) await page.locator('#contacto').getByText(t, { exact: true }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) throw new Error('scroll horizontal en inicio: ' + overflow + 'px');
    const heroCta = page.locator('a', { hasText: 'Ver inventario' }).first();
    if (!(await heroCta.isVisible())) throw new Error('el botón principal no se ve sin hacer scroll');
    const box = await heroCta.boundingBox();
    if (box.y + box.height > 844) throw new Error('el botón principal queda abajo del primer pantallazo');
    // Versión 1 (skill /scroll-craft): hero con capas reales (fondo nocturno, «premium» detrás del auto real)
    if (!(await page.locator('#hero-title').isVisible().catch(() => true))) throw new Error('falta el título del hero');
    const car = page.locator('section[aria-labelledby=hero-title] img[src*="m3-recorte"]').first();
    await car.waitFor({ state: 'attached' });
    const z = await page.evaluate(() => {
      const word = [...document.querySelectorAll('#hero-title span')].find((e) => e.textContent.trim() === 'premium');
      const carLayer = document.querySelector('section[aria-labelledby=hero-title] img[src*="m3-recorte"]').closest('.z-20');
      return [getComputedStyle(word.closest('.z-10')).zIndex, getComputedStyle(carLayer).zIndex];
    });
    if (!(Number(z[0]) < Number(z[1]))) throw new Error('la palabra «premium» debe ir detrás del auto: ' + z);
    step('hero con capas: título y botón en el primer pantallazo, «premium» detrás del auto real');
    // Lo que el dueño pidió quitar (28-oct)
    for (const gone of ['autos disponibles hoy', '¿Cuál es tu presupuesto?', 'Ver del más barato al más caro']) {
      if (await page.getByText(gone).count()) throw new Error('debería haberse quitado: ' + gone);
    }
    if (await page.locator('a[href*="waze"]').count()) throw new Error('debería haberse quitado el botón de Waze');
    if (await page.locator('a[href="/autos?precio=0-300000"]').count()) throw new Error('debería haberse quitado el presupuesto');
    step('sin «N autos disponibles hoy», sin presupuesto y sin Waze');
    // 29-oct: se quitaron los números de confianza; la franja de marcas lleva logos
    for (const gone of ['Autos entregados', 'Años de experiencia', 'Tiempo de respuesta']) {
      if (await page.getByText(gone).count()) throw new Error('debería haberse quitado: ' + gone);
    }
    const logos = await page.locator('section[aria-label="Marcas en inventario"] svg').count();
    if (logos < 10) throw new Error('la franja de marcas debería llevar logos, hay ' + logos);
    step(`sin números de confianza; franja de marcas con ${logos} logos`);
    await page.getByRole('heading', { name: 'Autos listos para manejar' }).waitFor();
    const grid = page.locator('section[aria-labelledby=destacados] article');
    if ((await grid.count()) !== 8) throw new Error('el inventario del inicio debería mostrar 8 autos, hay ' + (await grid.count()));
    const [c1, c2] = [await grid.nth(0).boundingBox(), await grid.nth(1).boundingBox()];
    if (Math.abs(c1.y - c2.y) > 2 || c2.x <= c1.x) throw new Error('el inventario del inicio debería ir en 2 columnas');
    await page.locator('section[aria-labelledby=destacados] a', { hasText: 'Ver todos' }).last().waitFor();
    step('inventario: 8 autos en 2 columnas y «Ver todos» abajo');
    // Beneficios divididos en 2 (30-oct): al comprar y al vender
    const buy = page.locator('article[aria-labelledby=al-comprar]');
    const sellBox = page.locator('article[aria-labelledby=al-vender]');
    for (const t of ['Asesoramiento', 'Autos confiables', 'Papeles en regla', 'Precio justo']) await buy.getByRole('heading', { name: t, exact: true }).waitFor();
    for (const t of ['Ganas más que en un lote', 'Evita estafas', 'Sin citas con desconocidos', 'Papeleo y placas', 'Precio correcto']) await sellBox.getByRole('heading', { name: t, exact: true }).waitFor();
    if ((await page.locator('section[aria-labelledby=compra] article').count()) < 4) throw new Error('falta el carrusel de autos verificados');
    if (await page.getByText('Ver la ficha de este auto').count()) throw new Error('debería haberse quitado «Ver la ficha de este auto»');
    const sell = page.getByRole('heading', { name: 'Sácale más valor a tu vehículo.' });
    const diff = page.locator('#diferencia');
    if ((await sell.boundingBox()).y > (await diff.boundingBox()).y) throw new Error('«Vende tu auto» debe ir más arriba');
    step('beneficios en 2 (al comprar / al vender), carrusel de autos verificados y «Vende tu auto»');
    // Recorrido de un auto: al final del scroll se ven el precio y los botones
    const tour = page.locator('section[aria-label^="Recorrido"]');
    await tour.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight - innerHeight - 5));
    await tour.locator('a', { hasText: 'Me interesa' }).waitFor({ state: 'visible' });
    // Movimiento firma: al bajar, el mensaje se escribe solo y se envía
    const msg = page.locator('section[aria-labelledby=mensaje]');
    await msg.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * 0.5));
    await page.waitForTimeout(400);
    const partial = await msg.locator('p.whitespace-pre-line').innerText();
    await msg.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight - innerHeight - 5));
    await msg.getByText('✓✓').waitFor();
    const full = await msg.locator('p.whitespace-pre-line').innerText();
    if (!(partial.length < full.length && full.includes('¿Sigue disponible?'))) throw new Error('el mensaje no se escribe con el scroll: ' + partial.length + ' / ' + full.length);
    step('recorrido del auto (termina en precio y botones) y el mensaje que se escribe solo al bajar');
    if (await page.getByText('Ven a conocerlo').count()) throw new Error('los autos no están en un lote: no debe decir «Ven a conocerlo»');
    await page.getByRole('heading', { name: 'Agenda tu cita' }).waitFor();
    const faq = page.locator('details', { hasText: '¿Puedo ver el auto en persona?' });
    await faq.locator('summary').click();
    await faq.getByText('Sí, con cita.').waitFor();
    step('se ven con cita (sin «Ven a conocerlo») y las preguntas frecuentes abren');
    await page.locator('a[href="/autos?tipo=Blindado"]').first().click();
    await page.getByText('2 autos encontrados').waitFor({ timeout: 30000 });
    step('categoría «Blindados» del inicio filtra el catálogo → 2');
    await page.goto(B + '/');
    await page.locator('footer a[href="/admin/login"]', { hasText: 'Administración' }).waitFor();
    for (const t of ['Escríbenos', 'Llámanos', 'Oficina']) await page.locator('footer').getByText(t, { exact: true }).waitFor();
    step('pie de página: contacto directo y acceso discreto al panel');

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
    // Dato faltante: no aparece en el resumen ni en la ficha; abajo hay un aviso con botón para preguntarlo
    if (await page.getByText('Pregúntanos').count()) throw new Error('la ficha no debe mostrar «Pregúntanos»');
    if (await page.locator('section[aria-labelledby=ficha] dt', { hasText: 'Kilometraje' }).count()) throw new Error('el kilometraje sin dato no debe salir en la ficha');
    const ask = page.locator('section[aria-labelledby=ficha] a', { hasText: 'Preguntar' });
    const askHref = decodeURIComponent(await ask.getAttribute('href'));
    if (!askHref.includes('kilometraje') || !askHref.includes('Ford Mustang GT Premium 2022')) throw new Error('mensaje de dato faltante: ' + askHref);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    if (!ld.some((t) => t.includes('BreadcrumbList'))) throw new Error('faltan migas de pan para Google');
    step('detalle: botón en el primer pantallazo, sin filas vacías, aviso para preguntar y migas de pan');
    await page.locator('button[aria-label="Ver foto 3 de 10"]').click();
    const dialog = page.getByRole('dialog', { name: 'Galería' });
    await dialog.getByText('3 / 10').waitFor();
    const close = dialog.getByRole('button', { name: 'Cerrar galería' });
    const closeColors = await close.evaluate((e) => [getComputedStyle(e).backgroundColor, getComputedStyle(e).color]);
    if (closeColors[0] !== 'rgb(255, 255, 255)' || !(await close.innerText()).includes('Cerrar')) throw new Error('el botón Cerrar no es claro: ' + closeColors);
    await close.click();
    await dialog.waitFor({ state: 'detached' });
    await page.locator('button[aria-label="Ver foto 3 de 10"]').click();
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await page.click('button:has-text("Ver las 10 fotos")');
    await page.locator('button[aria-label="Ver foto 10 de 10"]').waitFor();
    step('cuadrícula de fotos: abre la foto tocada y muestra todas');

    // Fotos por sección y equipamiento con lista fija
    await page.goto(B + '/autos/bmw-m3-2018');
    await page.getByRole('tab', { name: /Interior/ }).first().waitFor({ timeout: 30000 });
    await page.locator('section[aria-labelledby=fotos]').getByRole('tab', { name: /Interior/ }).click();
    await page.click('button:has-text("Ver las 10 fotos")');
    if ((await page.locator('section[aria-labelledby=fotos] ul button[aria-label$="de 10"]').count()) !== 10) throw new Error('la pestaña Interior no muestra 10 fotos');
    const tabs = await page.locator('section[aria-labelledby=fotos] [role=tab]').allInnerTexts();
    if (tabs.some((t) => /Detalles|Motor/.test(t))) throw new Error('solo deben quedar Exterior e Interior: ' + tabs.join(', '));
    if (await page.getByText('Ven a conocerlo').count()) throw new Error('la ficha no debe decir «Ven a conocerlo»');
    await page.getByText('Míralo con cita.').waitFor();
    step('fotos por sección: solo Exterior e Interior (Interior del M3 con 10 fotos); se ve con cita');
    await page.goto(B + '/autos/ford-expedition-platinum-4x4-2017');
    await page.locator('a[href="#equipamiento"]', { hasText: 'Equipamiento (9)' }).waitFor({ timeout: 30000 });
    const eqItems = await page.locator('section#equipamiento li').count();
    if (eqItems !== 9) throw new Error('equipamiento esperado 9, hay ' + eqItems);
    if (await page.locator('section[aria-labelledby=destaca]').getByText('Asientos con calefacción y ventilación').count()) throw new Error('«Lo que destaca» repite el equipamiento');
    step('equipamiento: 9 elementos agrupados y sin repetir en «Lo que destaca»');

    // 29-oct: sin «Tus dudas»; los documentos confirmados salen como filas de la ficha técnica
    await page.goto(B + '/autos/toyota-land-cruiser-blindada-2014');
    const ficha = page.locator('section[aria-labelledby=ficha]');
    await ficha.waitFor({ timeout: 30000 });
    await ficha.locator('div', { hasText: 'Factura' }).getByText('De empresa').waitFor();
    await ficha.getByText('Nivel 3 Plus (BS Blindaje)').waitFor();
    if (await page.locator('#dudas').count()) throw new Error('la sección «Tus dudas» debería haberse quitado');
    if (await ficha.locator('dt', { hasText: 'Servicios' }).count()) throw new Error('servicios sin dato no debe salir');
    step('ficha: factura y blindaje confirmados como filas; sin «Tus dudas» ni filas vacías');

    // Tarjetas: botón directo de WhatsApp con el auto
    await page.goto(B + '/autos');
    const cardWa = page.locator('article').first().locator('a[aria-label^="Escribir por WhatsApp"]');
    const cardMsg = decodeURIComponent(await cardWa.getAttribute('href', { timeout: 30000 }));
    if (!cardMsg.includes('Me interesa el')) throw new Error('el WhatsApp de la tarjeta no lleva el auto: ' + cardMsg);
    step('tarjetas: WhatsApp directo con el auto en el mensaje');

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
