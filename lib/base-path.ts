// Prefixo do site quando publicado numa subpasta (ex.: GitHub Pages em /la-encasa-cardapio).
// Vazio no computador e em hospedagens na raiz do domínio.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBase = (path: string) =>
  path.startsWith("/") && !path.startsWith(`${basePath}/`) ? `${basePath}${path}` : path;
