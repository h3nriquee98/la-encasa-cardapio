// Loader do next/image para site estático (GitHub Pages): serve o arquivo original
// com o prefixo da subpasta. O parâmetro "w" só evita cache de tamanhos diferentes.
import { withBase } from "./base-path";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return `${withBase(src)}?w=${width}`;
}
