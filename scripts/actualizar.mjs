// Baja a tu computadora la última versión de la rama `desarrollo`.
//   npm run actualizar   (luego: npm run movil)
// Si `next dev` cambió algún archivo (por ejemplo AGENTS.md), lo guarda aparte con `git stash` para que
// no estorbe. Solo corre `npm install` si cambiaron las dependencias.
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const read = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const before = read("git rev-parse HEAD");
if (read("git status --porcelain --untracked-files=no")) {
  console.log("Guardando aparte cambios locales (git stash)…");
  run('git stash push -m "antes de npm run actualizar"');
}
console.log("Bajando la rama desarrollo de GitHub…");
run("git fetch origin desarrollo");
run("git checkout -B desarrollo FETCH_HEAD");
const after = read("git rev-parse HEAD");

const depsChanged = before !== after && read(`git diff --name-only ${before} ${after} -- package.json package-lock.json`);
if (depsChanged || !existsSync("node_modules")) {
  console.log("Instalando dependencias…");
  run("npm install");
}

console.log(`\n✅ Listo: tienes la versión «${read("git log -1 --format=%s")}».`);
console.log("Ahora corre: npm run movil   (y recarga la página en el navegador y en el celular)\n");
