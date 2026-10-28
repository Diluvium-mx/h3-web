// Abre el sitio en tu celular para probarlo de punta a punta.
//   npm run movil              → celular en el mismo Wi-Fi que la computadora
//   npm run movil -- --tunel   → enlace https temporal que funciona desde cualquier red (requiere cloudflared)
//   H3_IP=192.168.1.50 npm run movil → si detecta otra red, fuerza la IP correcta
// Muestra el enlace y un código QR: apúntale con la cámara del celular.
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const qrcode = require("qrcode-terminal");
const PORT = process.env.PORT || "3000";
const tunnel = process.argv.includes("--tunel");

function lanIp() {
  const privada = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list ?? []) if (a.family === "IPv4" && !a.internal && privada.test(a.address)) return a.address;
  }
  return null;
}

function show(title, url) {
  console.log(`\n📱 ${title}\n   ${url}\n`);
  qrcode.generate(url, { small: true });
}

function startTunnel() {
  if (spawnSync("cloudflared", ["--version"]).status !== 0) {
    console.log("\nPara el enlace https instala cloudflared (Mac: brew install cloudflared) y vuelve a correr el comando.");
    return;
  }
  const t = spawn("cloudflared", ["tunnel", "--url", `http://localhost:${PORT}`], { stdio: ["ignore", "pipe", "pipe"] });
  let done = false;
  const onData = (d) => {
    const url = String(d).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0];
    if (url && !done) {
      done = true;
      show("Enlace https temporal (funciona con datos del celular; cambia cada vez):", url);
    }
  };
  t.stdout.on("data", onData);
  t.stderr.on("data", onData);
  process.on("exit", () => t.kill());
}

// H3_IP=192.168.x.x npm run movil → fuerza la IP si la computadora tiene varias redes
const ip = process.env.H3_IP || lanIp();
const hosts = [ip, tunnel && "*.trycloudflare.com"].filter(Boolean);
const next = spawn("npx", ["next", "dev", "-H", "0.0.0.0", "-p", PORT], {
  stdio: ["inherit", "pipe", "inherit"],
  env: { ...process.env, H3_DEV_HOSTS: hosts.join(",") },
});
next.stdout.pipe(process.stdout);

let announced = false;
next.stdout.on("data", (d) => {
  if (announced || !/Ready/i.test(String(d))) return;
  announced = true;
  if (ip) show("Abre esto en tu celular (conectado al mismo Wi-Fi):", `http://${ip}:${PORT}`);
  else console.log("\nNo encontré la IP de la red local. ¿La computadora está conectada a Wi-Fi?");
  console.log("Panel: /admin · contraseña de desarrollo: h3admin (o la de ADMIN_PASSWORD en .env.local)\n");
  if (tunnel) startTunnel();
});

const stop = () => {
  next.kill("SIGINT");
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => process.exit(code ?? 0));
