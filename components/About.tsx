import Image from "next/image";
import { products } from "@/data/menu";
import { site } from "@/data/site";

const count = (cat: string) => products.filter((p) => p.category === cat).length;

export function About() {
  return (
    <section id="sobre" className="bg-bun/60 py-20 sm:py-28" aria-labelledby="sobre-titulo">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4">
          <div className="relative col-span-3 row-span-2 aspect-[3/4] overflow-hidden rounded-[28px] shadow-card">
            <Image src="/images/produtos/imperador.jpg" alt="Hambúrguer com queijo empanado, bacon e cheddar" fill sizes="(min-width: 1024px) 360px, 60vw" className="object-cover" />
          </div>
          <div className="relative col-span-2 overflow-hidden rounded-[22px] shadow-card">
            <Image src="/images/produtos/classico-artesanal.jpg" alt="Hambúrguer com bacon e queijo derretido" fill sizes="(min-width: 1024px) 240px, 40vw" className="object-cover" />
          </div>
          <div className="relative col-span-2 overflow-hidden rounded-[22px] shadow-card">
            <Image src="/images/produtos/turbinadao.jpg" alt="Hambúrguer duplo com ovo, cheddar e maionese" fill sizes="(min-width: 1024px) 240px, 40vw" className="object-cover" />
          </div>
        </div>

        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-ketchup uppercase">Sobre</p>
          <h2 id="sobre-titulo" className="mt-2 font-display text-4xl leading-[1.05] text-patty sm:text-5xl">
            Prazer, La Encasa.
          </h2>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-cocoa">
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t-2 border-dashed border-crust pt-6">
            {[
              [count("artesanais"), "lanches artesanais"],
              [count("tradicionais"), "lanches tradicionais"],
              [count("porcoes"), "porções"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-display text-3xl text-patty">{n}</span>
                  <span className="text-sm font-semibold text-cocoa">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="#cardapio"
            className="mt-8 inline-flex h-13 items-center rounded-2xl bg-patty px-6 font-bold text-white transition hover:bg-ember"
          >
            Ver o cardápio
          </a>
        </div>
      </div>
    </section>
  );
}
