/* G2 IMPÉRIO — overlays: carrinho, busca, montador de kit, toasts, menu mobile */
import { useState, useEffect, useRef } from "react";
import { brl, norm } from "../lib/format.js";
import { Btn, Placeholder, Qty, WhatsIcon } from "../components/primitives.jsx";
import { Logo } from "../components/layout.jsx";

/* ---------- Toasts ---------- */
export function Toasts({ items }) {
  return (
    <div className="g2-toasts">
      {items.map((t) => (
        <div key={t.id} className="g2-toast">
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- Carrinho ---------- */
export function CartDrawer({ open, items, products, settings, onClose, onQty, onRemove, onOpenProduct, onAdd, onCheckout }) {
  const FREE_SHIP = settings.freeShip || 299;
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);
  const cashback = +((subtotal * (settings.cashbackPct || 10)) / 100).toFixed(2);
  const suggestions = products.filter((p) => !items.some((it) => it.id === p.id) && (Number(p.stock) || 0) > 0).slice(0, 3);

  return (
    <div className={"g2-overlay" + (open ? " is-open" : "")} onClick={onClose}>
      <aside className={"g2-cart" + (open ? " is-open" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="g2-drawer__head">
          <h3>SEU CARRINHO ({items.reduce((s, i) => s + i.qty, 0)})</h3>
          <button className="g2-x" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="g2-cart__ship">
          {remaining > 0 ? (
            <p>
              Adicione mais <strong>{brl(remaining)}</strong> para ganhar <strong>frete grátis</strong>! 🚚
            </p>
          ) : (
            <p>
              🎉 Você ganhou <strong>frete grátis</strong>!
            </p>
          )}
          <div className="g2-cart__bar">
            <span style={{ width: pct + "%" }} />
          </div>
        </div>

        <div className="g2-cart__items">
          {items.length === 0 && (
            <div className="g2-cart__empty">
              Seu carrinho está vazio.
              <br />
              Que tal explorar os <b>mais vendidos</b>?
            </div>
          )}
          {items.map((it) => (
            <div className="g2-cartitem" key={it.key}>
              <button className="g2-cartitem__media" onClick={() => onOpenProduct(it)}>
                {it.image ? (
                  <div className="g2-img" style={{ width: "100%", height: "100%" }}>
                    <img src={it.image} alt={it.name} />
                  </div>
                ) : (
                  <Placeholder label="" hue={it.hue} ratio="1/1" round={8} light={91} />
                )}
              </button>
              <div className="g2-cartitem__body">
                <h4 onClick={() => onOpenProduct(it)}>{it.name}</h4>
                {it.variant && <span className="g2-cartitem__var">{it.variant}</span>}
                <div className="g2-cartitem__row">
                  <Qty value={it.qty} onChange={(v) => onQty(it.key, v)} small max={it.stock || undefined} />
                  <strong>{brl(it.price * it.qty)}</strong>
                </div>
                <button className="g2-cartitem__rm" onClick={() => onRemove(it.key)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && suggestions.length > 0 && (
          <div className="g2-cart__cross">
            <h5>ADICIONE TAMBÉM</h5>
            <div className="g2-cart__crosslist">
              {suggestions.map((s) => (
                <div className="g2-crossitem" key={s.id}>
                  {s.image ? (
                    <div className="g2-img" style={{ width: 44, height: 44, borderRadius: 6 }}>
                      <img src={s.image} alt={s.name} />
                    </div>
                  ) : (
                    <Placeholder label="" hue={s.hue} ratio="1/1" round={6} light={91} style={{ width: 44, height: 44 }} />
                  )}
                  <div>
                    <strong>{s.name}</strong>
                    <em>{brl(s.price)}</em>
                  </div>
                  <button onClick={() => onAdd(s)} aria-label="Adicionar">
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="g2-cart__foot">
          <div className="g2-cart__cashback">
            💰 Você acumulará <strong>{brl(cashback)}</strong> de cashback
          </div>
          <div className="g2-cart__subtotal">
            <span>Subtotal</span>
            <strong>{brl(subtotal)}</strong>
          </div>
          <Btn variant="gold" full disabled={items.length === 0} onClick={onCheckout}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: ".5em", lineHeight: 1.15, textAlign: "center" }}>
              <WhatsIcon /> FINALIZAR COMPRA COM ATENDENTE NO WHATSAPP
            </span>
          </Btn>
          <div className="g2-cart__pay">
            {["VISA", "MASTER", "ELO", "PIX", "BOLETO"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Busca ---------- */
export function SearchModal({ open, products, onClose, onOpenProduct }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  const results = q.trim() ? products.filter((p) => norm(p.name).includes(norm(q)) || norm(p.catName).includes(norm(q))).slice(0, 8) : [];
  const popular = ["Óculos aviador", "Smartwatch", "Bolsa tote", "Fone TWS", "Garrafa térmica", "Mochila notebook"];
  const featured = products.filter((p) => p.badge === "new").slice(0, 4);

  return (
    <div className="g2-searchmodal" onClick={onClose}>
      <div className="g2-searchmodal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="g2-searchmodal__bar">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="O que você procura hoje?" />
          <button className="g2-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="g2-searchmodal__body">
          {q.trim() ? (
            <div className="g2-search__results">
              {results.length === 0 ? (
                <p className="g2-search__none">Nada encontrado para "{q}".</p>
              ) : (
                results.map((p) => (
                  <button
                    key={p.id}
                    className="g2-search__res"
                    onClick={() => {
                      onOpenProduct(p);
                      onClose();
                    }}
                  >
                    {p.image ? (
                      <div className="g2-img" style={{ width: 52, height: 52, borderRadius: 8 }}>
                        <img src={p.image} alt={p.name} />
                      </div>
                    ) : (
                      <Placeholder label="" hue={p.hue} ratio="1/1" round={8} light={91} style={{ width: 52, height: 52 }} />
                    )}
                    <div>
                      <strong>{p.name}</strong>
                      <em>{brl(p.price)}</em>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="g2-search__suggest">
              <div className="g2-search__col">
                <h5>OS MAIS BUSCADOS</h5>
                <ul>
                  {popular.map((t) => (
                    <li key={t}>
                      <button onClick={() => setQ(t)}>↗ {t}</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="g2-search__col">
                <h5>CONHEÇA</h5>
                <div className="g2-search__feat">
                  {featured.map((p) => (
                    <button
                      key={p.id}
                      className="g2-search__featitem"
                      onClick={() => {
                        onOpenProduct(p);
                        onClose();
                      }}
                    >
                      {p.image ? (
                        <div className="g2-img" style={{ aspectRatio: "1/1", borderRadius: 10 }}>
                          <img src={p.image} alt={p.name} />
                        </div>
                      ) : (
                        <Placeholder label="" hue={p.hue} ratio="1/1" round={10} light={92} />
                      )}
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Montador de kit ---------- */
const KIT_TIERS = [
  [2, 5],
  [4, 10],
  [6, 12],
  [8, 15],
];
export function KitBuilder({ open, products, categories, onClose, onAddKit, onToast }) {
  const [tab, setTab] = useState(categories[0] ? categories[0].slug : "");
  const [sel, setSel] = useState({});
  useEffect(() => {
    if (open && !categories.some((c) => c.slug === tab)) setTab(categories[0] ? categories[0].slug : "");
  }, [open]);
  if (!open) return null;

  const list = products.filter((p) => p.cat === tab && (Number(p.stock) || 0) > 0);
  const entries = Object.values(sel);
  const count = entries.reduce((s, e) => s + e.qty, 0);
  const gross = entries.reduce((s, e) => s + e.p.price * e.qty, 0);
  let tier = 0;
  KIT_TIERS.forEach(([n, d]) => {
    if (count >= n) tier = d;
  });
  const subtotal = +(gross * (1 - tier / 100)).toFixed(2);
  const nextTier = KIT_TIERS.find(([n]) => count < n);
  const setQ = (p, qty) =>
    setSel((s) => {
      const n = { ...s };
      if (qty <= 0) delete n[p.id];
      else n[p.id] = { p, qty };
      return n;
    });

  return (
    <div className="g2-overlay is-open" onClick={onClose}>
      <aside className="g2-kit is-open" onClick={(e) => e.stopPropagation()}>
        <div className="g2-drawer__head">
          <h3>⚡ MONTE SEU KIT</h3>
          <button className="g2-x" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="g2-kit__progress">
          <div className="g2-kit__progresslbl">
            {nextTier ? (
              <span>
                Faltam <strong>{nextTier[0] - count}</strong> {nextTier[0] - count === 1 ? "item" : "itens"} para <strong>{nextTier[1]}% OFF</strong>
              </span>
            ) : (
              <span>
                🎉 Desconto máximo + <strong>brinde surpresa</strong> liberado!
              </span>
            )}
            <b>{tier > 0 ? tier + "% OFF" : "—"}</b>
          </div>
          <div className="g2-kit__track">
            {KIT_TIERS.map(([n, d]) => (
              <div key={n} className={"g2-kit__milestone" + (count >= n ? " is-on" : "")} style={{ left: (n / 8) * 100 + "%" }}>
                <i />
                <span>{n}</span>
              </div>
            ))}
            <div className="g2-kit__fill" style={{ width: Math.min(100, (count / 8) * 100) + "%" }} />
          </div>
        </div>

        <div className="g2-kit__tabs">
          {categories.map((c) => (
            <button key={c.slug} className={tab === c.slug ? "is-active" : ""} onClick={() => setTab(c.slug)}>
              {c.short}
            </button>
          ))}
        </div>

        <div className="g2-kit__grid">
          {list.map((p) => {
            const q = sel[p.id] ? sel[p.id].qty : 0;
            return (
              <div className={"g2-kititem" + (q > 0 ? " is-sel" : "")} key={p.id}>
                {p.image ? (
                  <div className="g2-img" style={{ aspectRatio: "1/1", borderRadius: 8 }}>
                    <img src={p.image} alt={p.name} />
                  </div>
                ) : (
                  <Placeholder label="" hue={p.hue} ratio="1/1" round={8} light={92} />
                )}
                <h5>{p.name}</h5>
                <span className="g2-kititem__price">{brl(p.price)}</span>
                {q > 0 ? <Qty value={q} onChange={(v) => setQ(p, v)} small max={p.stock || undefined} /> : <button className="g2-kititem__add" onClick={() => setQ(p, 1)}>+ Adicionar</button>}
              </div>
            );
          })}
          {list.length === 0 && <p style={{ color: "var(--g2-muted)", gridColumn: "1/-1" }}>Sem itens disponíveis nesta categoria.</p>}
        </div>

        <div className="g2-kit__foot">
          <div className="g2-kit__totals">
            <span>
              {count} {count === 1 ? "item" : "itens"}
              {tier > 0 && <em> · {tier}% OFF</em>}
            </span>
            <strong>{brl(subtotal)}</strong>
          </div>
          <Btn
            variant="gold"
            full
            disabled={count === 0}
            onClick={() => {
              onAddKit(entries, subtotal, tier);
              onClose();
            }}
          >
            ADICIONAR AO CARRINHO
          </Btn>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Menu mobile ---------- */
export function MobileMenu({ open, categories, settings, onClose, onNav }) {
  return (
    <div className={"g2-overlay" + (open ? " is-open" : "")} onClick={onClose}>
      <aside className={"g2-mobmenu" + (open ? " is-open" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="g2-drawer__head">
          <Logo
            name={settings.storeName}
            onClick={() => {
              onNav({ view: "home" });
              onClose();
            }}
          />
          <button className="g2-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="g2-mobmenu__body">
          <h5>CATEGORIAS</h5>
          {categories.map((c) => (
            <button
              key={c.slug}
              className="g2-mobmenu__link"
              onClick={() => {
                onNav({ view: "collection", cat: c.slug });
                onClose();
              }}
            >
              <span className="g2-mobmenu__dot" style={{ background: `hsl(${c.hue} 45% 50%)` }} />
              {c.name}
            </button>
          ))}
          <h5>COLEÇÕES</h5>
          {["Lançamentos", "Mais Vendidos", "Promoções", "Kits e Combos"].map((t) => (
            <button
              key={t}
              className="g2-mobmenu__link"
              onClick={() => {
                onNav({ view: "collection", cat: "promocoes", title: t });
                onClose();
              }}
            >
              {t}
            </button>
          ))}
          <h5>AJUDA</h5>
          <button
            className="g2-mobmenu__link"
            onClick={() => {
              onNav({ view: "faq" });
              onClose();
            }}
          >
            Perguntas Frequentes
          </button>
        </div>
      </aside>
    </div>
  );
}
