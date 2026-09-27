// Gera as imagens do site a partir das fotos originais.
// Uso: npm run images  (ajuste SOURCE_DIR / HERO_FILE se as fotos mudarem de lugar)
//
// O next/image já entrega AVIF/WebP no tamanho certo para cada tela; este script
// só reduz os arquivos-fonte para o repositório não carregar PNGs de vários MB.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const DOWNLOADS = path.join(os.homedir(), "Downloads");
const SOURCE_DIR = path.join(DOWNLOADS, "la encasa");
const HERO_FILE = path.join(DOWNLOADS, "Imagem do ChatGPT 27 de set. de 2026, 11_10_49.png");

const OUT = path.resolve("public/images");
const APP = path.resolve("app");

// foto original -> nome usado no site (veja data/menu.ts)
const PRODUCTS = {
  "imgi_20_706981917_18124696870625480_800703754272713086_n.jpg": "duplo-cheddar",
  "imgi_21_689489760_18123311077625480_3223806572321474830_n.jpg": "empanado-do-chef",
  "imgi_31_639869610_18115418776625480_4270610683139816939_n.jpg": "fabuloso",
  "imgi_32_629277352_18114186469625480_4351888829517621373_n.jpg": "prime",
  "imgi_37_581287644_18106719439625480_5560370919775984670_n.jpg": "magnifico",
  "imgi_40_560437056_18101769124625480_5305324179919933445_n.jpg": "turbinadao",
  "imgi_41_558333346_18101397196625480_4626278879918774853_n.jpg": "imperador",
  "imgi_42_556972364_18100873879625480_4565976824950322143_n.jpg": "classico-artesanal",
};
const LOGO = "imgi_2_746129878_18129335140625480_1224920687722664556_n.jpg";

await mkdir(path.join(OUT, "produtos"), { recursive: true });

for (const [file, slug] of Object.entries(PRODUCTS)) {
  await sharp(path.join(SOURCE_DIR, file))
    .resize({ width: 1200, height: 1200, fit: "cover", position: "attention" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, "produtos", `${slug}.jpg`));
  console.log("produto:", slug);
}

await sharp(HERO_FILE).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, "hero.jpg"));
// Open Graph (1200x630) para compartilhamento no WhatsApp/Instagram/Facebook
await sharp(HERO_FILE)
  .resize({ width: 1200, height: 630, fit: "cover", position: "left" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(OUT, "og.jpg"));
console.log("hero + og");

// Logo: o arquivo original tem só 150x150. Troque por uma versão maior quando tiver.
const logo = path.join(SOURCE_DIR, LOGO);
await sharp(logo).png().toFile(path.join(OUT, "logo.png"));
await sharp(logo).resize(32, 32).png().toFile(path.join(APP, "icon.png"));
await sharp(logo).resize(180, 180, { kernel: "lanczos3" }).png().toFile(path.join(APP, "apple-icon.png"));
await sharp(logo).resize(192, 192, { kernel: "lanczos3" }).png().toFile(path.join(OUT, "icon-192.png"));
await sharp(logo).resize(512, 512, { kernel: "lanczos3" }).png().toFile(path.join(OUT, "icon-512.png"));
console.log("logo + ícones");
