/**
 * Literalmente puppeteer. Librería que permite controlar
 * una instancia de Chrome o Chromium, para renderizar
 * html, páginas web, aplicaciones web, etc. y tomar
 * capturas, generar pdfs, automatizar pruebas de
 * interfaz, etc.
 * Si quieres conocer más: https://www.npmjs.com/package/puppeteer
 */
const puppeteer = require("puppeteer");

// FS viene de File system. Tiene un montón de utilidades
// para crear o leer archivos en el sistema. Uso promises,
// porque por defecto viene con callbacks.
const fs = require("fs").promises;

(async () => {
  // Lee el archivo aaa.html como utf-8, para que salga todo el html
  const html = await fs.readFile("aaa.html", "utf-8");

  // Ejecuta una instancia de puppeteer en headless.
  // Headless significa que no va a abrir el navegador chrome,
  // lo va a hacer de fondo.
  const browser = await puppeteer.launch({
    headless: true,
  });

  // El contexto del navegador será en modo incógnito, para que
  // no se guarden en caché cosas.
  const context = await browser.createIncognitoBrowserContext();

  // Se abre una nueva página.
  const page = await context.newPage();

  // Dentro de esa página, se manda el html, y se usa
  // el waitUntil, para que espere a que no hayan
  // más peticiones de red, es decir, cuando ya se
  // haya cargado todo.
  await page.goto(`data: text/html, ${html}`, {
    waitUntil: "networkidle0",
  });

  // Coloca el contenido html.
  await page.setContent(html);

  // Crea el pdf en formato A4, y que salgan
  // imágenes, en el caso de existir.
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  // Se cierra el navegador.
  await context.close();

  // Se guarda el archivo owo.pdf.
  await fs.writeFile("owo.pdf", pdf);
})()
  .then(() => console.log("terminó"))
  .catch((err) => console.error("no funcionó ", err));
