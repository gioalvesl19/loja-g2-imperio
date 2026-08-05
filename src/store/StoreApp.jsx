/* G2 IMPÉRIO — aplicação da loja: catálogo + consulta/pedido via WhatsApp */
import { useState, useEffect, useCallback, useRef } from "react";
import { brl, openWhats } from "../lib/format.js";
import { useStore, hasPrice } from "../lib/store.js";
import { AnnouncementBar, Header, Footer, BottomBar } from "../components/layout.jsx";
import { Home } from "./Home.jsx";
import { Collection } from "./Collection.jsx";
import { ProductPage } from "./ProductPage.jsx";
import { Faq } from "./Faq.jsx";
import { PolicyPage } from "./PolicyPage.jsx";
import { SearchModal, MobileMenu, Toasts } from "./Overlays.jsx";

export function StoreApp({ onAdmin, productSlug, navigate }) {
  const { products, categories, reviews, blog, settings, hero, banner, kitPromo } = useStore();

  const [route, setRoute] = useState({ view: "home" });
  const [toasts, setToasts] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, msg }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2600);
  }, []);

  const nav = useCallback(
    (r) => {
      setRoute(r);
      setMenuOpen(false);
      window.scrollTo(0, 0);
      if (navigate && /\/produto\//i.test(window.location.pathname)) navigate("/");
    },
    [navigate]
  );

  const productsRef = useRef(products);
  productsRef.current = products;
  const openProduct = useCallback(
    (p) => {
      const full = productsRef.current.find((x) => x.id === p.id) || p;
      if (navigate && full.slug) navigate("/produto/" + full.slug);
      else {
        setRoute({ view: "product", product: full });
        window.scrollTo(0, 0);
      }
    },
    [navigate]
  );

  // sincroniza a rota interna com a URL (deep-link / voltar)
  useEffect(() => {
    if (!products.length) return;
    if (productSlug) {
      const p = products.find((x) => x.slug === productSlug);
      if (p) {
        setRoute({ view: "product", product: p });
        window.scrollTo(0, 0);
      }
    } else {
      setRoute((r) => (r.view === "product" ? { view: "home" } : r));
    }
  }, [productSlug, products]);

  // pedido / consulta via WhatsApp
  const order = useCallback(
    (p) => {
      const link = window.location.origin + "/produto/" + p.slug;
      const lines = hasPrice(p)
        ? ["Olá, G2 Império! 👑 Quero comprar este produto:", "", "• " + p.name, "Valor: " + brl(p.price), link, "", "Pode me ajudar a finalizar?"]
        : ["Olá, G2 Império! 👑 Tenho interesse neste produto:", "", "• " + p.name, link, "", "Qual o valor e a disponibilidade?"];
      openWhats(settings.whatsapp, lines.join("\n"));
      toast("💬 Abrindo o WhatsApp…");
    },
    [settings.whatsapp, toast]
  );

  const whatsGeneral = useCallback(() => {
    openWhats(settings.whatsapp, "Olá, G2 Império! 👑 Gostaria de atendimento.");
    toast("💬 Abrindo o WhatsApp…");
  }, [settings.whatsapp, toast]);

  return (
    <div className="g2-app">
      <AnnouncementBar onToast={toast} settings={settings} />
      <Header categories={categories} settings={settings} onNav={nav} onSearch={() => setSearchOpen(true)} onMenu={() => setMenuOpen(true)} onAccount={onAdmin} />

      {route.view === "home" && <Home products={products} categories={categories} reviews={reviews} blog={blog} settings={settings} hero={hero} banner={banner} kitPromo={kitPromo} onNav={nav} onOpenProduct={openProduct} onOrder={order} />}
      {route.view === "collection" && <Collection cat={route.cat} title={route.title} products={products} categories={categories} onNav={nav} onOpenProduct={openProduct} onOrder={order} />}
      {route.view === "faq" && <Faq onNav={nav} settings={settings} onWhats={whatsGeneral} />}
      {route.view === "policy" && <PolicyPage slug={route.slug} settings={settings} onNav={nav} onWhats={whatsGeneral} />}
      {route.view === "product" && <ProductPage product={route.product} products={products} settings={settings} onNav={nav} onOpenProduct={openProduct} onOrder={order} />}

      <Footer onNav={nav} categories={categories} settings={settings} onAdmin={onAdmin} />

      <BottomBar view={route.view} onNav={nav} onSearch={() => setSearchOpen(true)} onAccount={onAdmin} onWhats={whatsGeneral} />

      <SearchModal open={searchOpen} products={products} onClose={() => setSearchOpen(false)} onOpenProduct={openProduct} />
      <MobileMenu open={menuOpen} categories={categories} settings={settings} onClose={() => setMenuOpen(false)} onNav={nav} />

      <Toasts items={toasts} />
    </div>
  );
}
