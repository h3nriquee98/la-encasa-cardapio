// Publica o site no GitHub Pages: gera o build estático e envia a pasta out/
// para a branch gh-pages do repositório.
// Uso: npm run deploy
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const read = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const remote = read("git remote get-url origin"); // ex.: https://github.com/usuario/repo.git
const [, owner, repo] = remote.match(/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/) ?? [];
if (!owner) throw new Error(`Não consegui ler o repositório do GitHub em: ${remote}`);

const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: `/${repo}`,
  NEXT_PUBLIC_SITE_URL: `https://${owner.toLowerCase()}.github.io/${repo}`,
};

console.log(`\n> Gerando o site para ${env.NEXT_PUBLIC_SITE_URL}\n`);
run("npm run build", { env });
writeFileSync("out/.nojekyll", "");

console.log("\n> Enviando para a branch gh-pages\n");
const git = (cmd) => run(`git ${cmd}`, { cwd: "out" });
git("init -q -b gh-pages");
git("add -A");
git(`-c user.name="${read("git config user.name")}" -c user.email="${read("git config user.email")}" commit -q -m "Publicação ${new Date().toISOString()}"`);
git(`push -q -f "${remote}" gh-pages`);

console.log(`\nPublicado: ${env.NEXT_PUBLIC_SITE_URL}/ (pode levar 1–2 minutos para atualizar)\n`);
