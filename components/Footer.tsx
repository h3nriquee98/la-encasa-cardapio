import { site, whatsappLink } from "@/data/site";
import { Logo } from "./Header";
import { InstagramIcon, PinIcon, WhatsAppIcon } from "./ui/icons";

export function Footer() {
  return (
    <footer className="bg-ember pt-16 pb-28 text-white/80 lg:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-[15px]">{site.tagline}. Peça pelo site e receba a confirmação no WhatsApp.</p>
        </div>

        <ul className="space-y-3 text-[15px]">
          <li>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-cheddar">
              <InstagramIcon size={18} /> {site.instagram.handle}
            </a>
          </li>
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-cheddar">
              <WhatsAppIcon size={18} /> {site.whatsapp.display}
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <PinIcon size={18} className="mt-0.5 shrink-0" /> {site.address.oneLine}
          </li>
        </ul>

        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-3 text-[15px] font-semibold md:grid-cols-1">
            <li><a href="#cardapio" className="hover:text-cheddar">Cardápio</a></li>
            <li><a href="#localizacao" className="hover:text-cheddar">Localização</a></li>
            <li><a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-cheddar">Instagram</a></li>
            <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-cheddar">WhatsApp</a></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-sm text-white/50 sm:px-6">
        © 2026 La Encasa. Todos os direitos reservados.
      </div>
    </footer>
  );
}
