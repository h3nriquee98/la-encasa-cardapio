import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Instagram } from "@/components/Instagram";
import { Location } from "@/components/Location";
import { Featured } from "@/components/menu/Featured";
import { MenuSection } from "@/components/menu/MenuSection";
import { ProductSheet } from "@/components/menu/ProductSheet";
import { AddedToast, CartBar, CartSheet } from "@/components/order/CartSheet";
import { OrderProvider } from "@/components/order/OrderProvider";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export default function Home() {
  return (
    <OrderProvider>
      <Header />
      <main>
        <Hero />
        <Featured />
        <MenuSection />
        <About />
        <Instagram />
        <Location />
      </main>
      <Footer />

      <WhatsAppFab />
      <CartBar />
      <AddedToast />
      <ProductSheet />
      <CartSheet />
    </OrderProvider>
  );
}
