/* G2 IMPÉRIO — overlays: busca, toasts, menu mobile */
import { useState, useEffect, useRef } from "react";
import { brl, norm } from "../lib/format.js";
import { hasPrice } from "../lib/store.js";
import { Placeholder } from "../components/primitives.jsx";
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
  const popular = ["Óculos de sol", "Relógio Curren", "Boné New Era", "Relógio feminino", "Óculos polarizado", "Boné Nike"];
  const featured = products.slice(0, 4);

  const priceLabel = (p) => (hasPrice(p) ? brl(p.price) : "Sob consulta");

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
                      <em>{priceLabel(p)}</em>
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
