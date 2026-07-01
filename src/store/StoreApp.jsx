/* G2 IMPÉRIO — aplicação da loja: rotas internas, carrinho, wishlist, overlays */
import { useState, useEffect, useCallback, useRef } from "react";
import { brl, openWhats } from "../lib/format.js";
import { useStore, loadCart, saveCart } from "../lib/store.js";
import { AnnouncementBar, Header, Footer, BottomBar } from "../components/layout.jsx";
import { Home } from "./Home.jsx";
import { Collection } from "./Collection.jsx";
import { ProductPage } from "./ProductPage.jsx";
import { Faq } from "./Faq.jsx";
import { PolicyPage } from "./PolicyPage.jsx";
import { CartDrawer, SearchModal, KitBuilder, MobileMenu, Toasts } from "./Overlays.jsx";

export function StoreApp({ onAdmin }) {
  const { products, categories, reviews, blog, settings, hero, banner, kitPromo, db } = useStore();

  const [route, setRoute] = useState({ view: "home" });
  const [cart, setCart] = useState(() => loadCart());
  const [wishlist, setWishlist] = useState(() => new Set());
  const [toasts, setToasts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // persiste o carrinho
  useEffect(() => saveCart(cart), [cart]);

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, msg }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2600);
  }, []);

  const nav = useCallback((r) => {
    setRoute(r);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const productsRef = useRef(products);
  productsRef.current = products;
  const openProduct = useCallback((p) => {
    const full = productsRef.current.find((x) => x.id === p.id) || p;
    setRoute({ view: "product", product: full });
    window.scrollTo(0, 0);
  }, []);

  const addToCart = useCallback(
    (p, qty = 1, variant) => {
      const key = p.id + (variant || "");
      const stock = Number(p.stock) || 0;
      if (stock <= 0) {
        toast("⚠️ Produto esgotado no momento.");
        return;
      }
      setCart((c) => {
        const ex = c.find((it) => it.key === key);
        const current = ex ? ex.qty : 0;
        const next = Math.min(stock, current + qty);
        if (next === current) {
          toast("⚠️ Quantidade máxima em estoque atingida.");
          return c;
        }
        if (ex) return c.map((it) => (it.key === key ? { ...it, qty: next } : it));
        return [...c, { key, id: p.id, name: p.name, price: p.price, hue: p.hue, image: p.image || "", stock, qty: next, variant: variant || null }];
      });
      toast("✅ Produto adicionado ao carrinho!");
      setCartOpen(true);
    },
    [toast]
  );

  const buyNow = useCallback(
    (p, qty, variant) => {
      const lines = ["Olá, G2 Império! 👑 Quero comprar este produto:", "", "• " + p.name + (variant ? " (" + variant + ")" : ""), "Quantidade: " + qty, "Valor: " + brl(p.price * qty), "", "Pode me ajudar a finalizar?"];
      openWhats(settings.whatsapp, lines.join("\n"));
      toast("💬 Abrindo o WhatsApp…");
    },
    [toast, settings.whatsapp]
  );

  const addKit = useCallback(
    (entries, subtotal, tier) => {
      setCart((c) => {
        const next = [...c];
        entries.forEach(({ p, qty }) => {
          const key = "kit-" + p.id;
          const ex = next.find((it) => it.key === key);
          if (ex) ex.qty += qty;
          else
            next.push({
              key,
              id: p.id,
              name: p.name,
              price: +(p.price * (1 - tier / 100)).toFixed(2),
              hue: p.hue,
              image: p.image || "",
              stock: Number(p.stock) || 0,
              qty,
              variant: tier > 0 ? "Kit " + tier + "% OFF" : "Kit",
            });
        });
        return next;
      });
      toast(`✅ Kit com ${entries.reduce((s, e) => s + e.qty, 0)} itens adicionado!`);
      setCartOpen(true);
    },
    [toast]
  );

  const setQty = useCallback((key, qty) => setCart((c) => c.map((it) => (it.key === key ? { ...it, qty: Math.min(it.stock || Infinity, Math.max(1, qty)) } : it))), []);
  const removeItem = useCallback(
    (key) => {
      setCart((c) => c.filter((it) => it.key !== key));
      toast("❌ Produto removido");
    },
    [toast]
  );
  const toggleWish = useCallback(
    (p) => {
      setWishlist((w) => {
        const n = new Set(w);
        if (n.has(p.id)) {
          n.delete(p.id);
          toast("♡ Removido da lista de desejos");
        } else {
          n.add(p.id);
          toast("♥ Adicionado à lista de desejos");
        }
        return n;
      });
    },
    [toast]
  );

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  const checkout = () => {
    const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const cashback = +((subtotal * (settings.cashbackPct || 10)) / 100).toFixed(2);
    const lines = ["Olá, G2 Império! 👑 Quero finalizar minha compra:", ""];
    cart.forEach((it) => lines.push("• " + it.name + (it.variant ? " (" + it.variant + ")" : "") + " — " + it.qty + "x — " + brl(it.price * it.qty)));
    lines.push("", "Subtotal: " + brl(subtotal), "Cashback a receber: " + brl(cashback), "", "Pode me atender para concluir o pedido?");
    openWhats(settings.whatsapp, lines.join("\n"));
    setCartOpen(false);
    toast("💬 Falando com um atendente no WhatsApp…");
  };

  return (
    <div className="g2-app">
      <AnnouncementBar onToast={toast} settings={settings} />
      <Header
        cartCount={cartCount}
        wishCount={wishlist.size}
        categories={categories}
        settings={settings}
        onNav={nav}
        onSearch={() => setSearchOpen(true)}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMenuOpen(true)}
        onAccount={onAdmin}
        onWish={() => toast("Sua lista de desejos tem " + wishlist.size + " item(ns)")}
      />

      {route.view === "home" && <Home products={products} categories={categories} reviews={reviews} blog={blog} settings={settings} hero={hero} banner={banner} kitPromo={kitPromo} onNav={nav} onOpenProduct={openProduct} onAdd={addToCart} onWish={toggleWish} wishlist={wishlist} onKit={() => setKitOpen(true)} />}
      {route.view === "collection" && <Collection cat={route.cat} title={route.title} products={products} categories={categories} onNav={nav} onOpenProduct={openProduct} onAdd={addToCart} onWish={toggleWish} wishlist={wishlist} />}
      {route.view === "faq" && (
        <Faq
          onNav={nav}
          settings={settings}
          onWhats={() => {
            openWhats(settings.whatsapp, "Olá, G2 Império! 👑 Tenho uma dúvida e gostaria de atendimento.");
            toast("💬 Abrindo o WhatsApp…");
          }}
        />
      )}
      {route.view === "policy" && (
        <PolicyPage
          slug={route.slug}
          settings={settings}
          onNav={nav}
          onWhats={() => {
            openWhats(settings.whatsapp, "Olá, G2 Império! 👑 Tenho uma dúvida e gostaria de atendimento.");
            toast("💬 Abrindo o WhatsApp…");
          }}
        />
      )}
      {route.view === "product" && <ProductPage product={route.product} products={products} settings={settings} onNav={nav} onOpenProduct={openProduct} onAdd={addToCart} onWish={toggleWish} wishlist={wishlist} onBuyNow={buyNow} />}

      <Footer onNav={nav} categories={categories} settings={settings} onAdmin={onAdmin} />

      <BottomBar view={route.view} cartCount={cartCount} onNav={nav} onSearch={() => setSearchOpen(true)} onKit={() => setKitOpen(true)} onCart={() => setCartOpen(true)} onAccount={onAdmin} />

      <CartDrawer
        open={cartOpen}
        items={cart}
        products={products}
        settings={settings}
        onClose={() => setCartOpen(false)}
        onQty={setQty}
        onRemove={removeItem}
        onOpenProduct={(it) => {
          const p = products.find((x) => x.id === it.id);
          if (p) {
            openProduct(p);
            setCartOpen(false);
          }
        }}
        onAdd={addToCart}
        onCheckout={checkout}
      />
      <SearchModal open={searchOpen} products={products} onClose={() => setSearchOpen(false)} onOpenProduct={openProduct} />
      <KitBuilder open={kitOpen} products={products} categories={categories} onClose={() => setKitOpen(false)} onAddKit={addKit} onToast={toast} />
      <MobileMenu open={menuOpen} categories={categories} settings={settings} onClose={() => setMenuOpen(false)} onNav={nav} />

      <Toasts items={toasts} />
    </div>
  );
}
