import Image from "next/image";
import type { Product } from "@/data/menu";

type Props = {
  product: Pick<Product, "name" | "image" | "category">;
  sizes: string;
  className?: string;
  preload?: boolean;
};

/** Foto do produto; sem foto, mostra uma ilustração no estilo do logo. */
export function ProductImage({ product, sizes, className = "", preload }: Props) {
  if (product.image) {
    return (
      <div className={`relative overflow-hidden bg-bun ${className}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative grid place-items-center overflow-hidden bg-bun ${className}`}
      role="img"
      aria-label={`${product.name} (sem foto)`}
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #de8600 1px, transparent 1.4px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden
      />
      <Glyph category={product.category} />
    </div>
  );
}

function Glyph({ category }: { category: Product["category"] }) {
  const cls = "relative w-[46%] max-w-28 drop-shadow-[0_6px_10px_rgba(42,21,12,0.18)]";
  switch (category) {
    case "porcoes":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden>
          {[14, 21, 28, 35, 42, 49].map((x, i) => (
            <rect key={x} x={x - 3} y={8 + (i % 3) * 4} width="6" height="30" rx="2" fill="#f7a814" stroke="#de8600" strokeWidth="1.2" />
          ))}
          <path d="M8 28h48l-6 30H14L8 28Z" fill="#d52b1e" />
          <path d="M20 40c4 4 20 4 24 0" stroke="#fffaf2" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "bebidas":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden>
          <path d="M36 4 40 16" stroke="#2a150c" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 16h32l-4 44H20L16 16Z" fill="#d52b1e" />
          <rect x="13" y="13" width="38" height="7" rx="3" fill="#2a150c" />
          <path d="M21 32h22" stroke="#fffaf2" strokeWidth="3" strokeLinecap="round" />
          <path d="M22 40h20" stroke="#f7a814" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "cervejas":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden>
          <path d="M27 4h10v12c0 4 7 7 7 14v28a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V30c0-7 7-10 7-14V4Z" fill="#6b4632" />
          <rect x="24" y="34" width="16" height="14" rx="2" fill="#f7a814" />
          <rect x="27" y="4" width="10" height="4" fill="#d52b1e" />
        </svg>
      );
    default:
      // hambúrguer, no mesmo desenho do logo: pão, tomate, carne e queijo derretendo
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden>
          <path d="M8 26c0-11 11-18 24-18s24 7 24 18H8Z" fill="#f7a814" />
          <g fill="#fffaf2">
            <ellipse cx="22" cy="16" rx="1.6" ry="1" />
            <ellipse cx="32" cy="13" rx="1.6" ry="1" />
            <ellipse cx="42" cy="17" rx="1.6" ry="1" />
            <ellipse cx="27" cy="21" rx="1.6" ry="1" />
            <ellipse cx="38" cy="22" rx="1.6" ry="1" />
          </g>
          <rect x="7" y="28" width="50" height="5" rx="2.5" fill="#d52b1e" />
          <rect x="6" y="35" width="52" height="9" rx="4.5" fill="#2a150c" />
          <path d="M10 44h44v2c0 1-2 2-4 2h-4c-1 0-2 1-2 3s-1 3-2 3-2-1-2-3-1-3-2-3H14c-2 0-4-1-4-2v-2Z" fill="#f7a814" />
          <path d="M8 50h48c0 5-4 8-9 8H17c-5 0-9-3-9-8Z" fill="#de8600" />
        </svg>
      );
  }
}
