/* G2 IMPÉRIO — primitivos de UI */
import { useState } from "react";
import { brl } from "../lib/format.js";
import { displayBadge, stockInfo } from "../lib/store.js";

/* ---------- Placeholder listrado (quando não há foto) ---------- */
export function Placeholder({ label, hue = 40, ratio = "1 / 1", round = 0, sat = 18, light = 92, mono = true, style = {} }) {
  const bg = `hsl(${hue} ${sat}% ${light}%)`;
  const stripe = `hsl(${hue} ${sat}% ${light - 6}%)`;
  return (
    <div
      className="g2-ph"
      style={{
        aspectRatio: ratio,
        borderRadius: round,
        background: `repeating-linear-gradient(135deg, ${bg} 0 11px, ${stripe} 11px 22px)`,
        ...style,
      }}
    >
      {label ? (
        <span className="g2-ph__label" style={{ fontFamily: mono ? "'IBM Plex Mono', monospace" : "inherit" }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ---------- Mídia do produto: foto (se houver) ou placeholder ---------- */
export function ProductMedia({ product, label, round = 0, style = {}, light = 92 }) {
  if (product && product.image) {
    return (
      <div className="g2-img" style={{ borderRadius: round, ...style }}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
    );
  }
  return (
    <Placeholder
      label={label != null ? label : (product && product.catName ? product.catName.toLowerCase() : "")}
      hue={product ? product.hue : 40}
      light={light}
      ratio="auto"
      round={round}
      style={{ height: "100%", ...style }}
    />
  );
}

/* ---------- Badge ---------- */
export const BADGE_META = {
  promo: { label: "PROMOÇÃO", cls: "g2-badge--promo" },
  new: { label: "LANÇAMENTO", cls: "g2-badge--new" },
  out: { label: "ESGOTADO", cls: "g2-badge--out" },
  last: { label: "ÚLTIMAS UNIDADES", cls: "g2-badge--last" },
};
export function Badge({ kind }) {
  const m = BADGE_META[kind];
  if (!m) return null;
  return <span className={"g2-badge " + m.cls}>{m.label}</span>;
}

/* ---------- Estrelas ---------- */
export function Stars({ value = 5, size = 14 }) {
  const full = Math.round(value);
  return (
    <span className="g2-stars" style={{ fontSize: size }} aria-label={value + " estrelas"}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "is-on" : "is-off"}>
          ★
        </span>
      ))}
    </span>
  );
}

/* ---------- Coração / wishlist ---------- */
export function Heart({ active, onClick }) {
  return (
    <button
      className={"g2-heart" + (active ? " is-active" : "")}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick && onClick();
      }}
      aria-label="Lista de desejos"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 5 5.2 5c2 0 3.3 1.1 4.1 2.3C10.5 6.1 11.8 5 13.8 5 17 5 18.6 8.3 17 11.7 14.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}

/* ---------- Botão ---------- */
export function Btn({ variant = "primary", size = "md", full, children, ...rest }) {
  return (
    <button className={`g2-btn g2-btn--${variant} g2-btn--${size}` + (full ? " g2-btn--full" : "")} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Seletor de quantidade ---------- */
export function Qty({ value, onChange, small, max }) {
  const atMax = max != null && value >= max;
  return (
    <div className={"g2-qty" + (small ? " g2-qty--sm" : "")}>
      <button onClick={() => onChange(Math.max(1, value - 1))} aria-label="Diminuir">
        −
      </button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={atMax} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}

/* ---------- Card de produto ---------- */
export function ProductCard({ p, onOpen, onAdd, onWish, wished }) {
  const [hover, setHover] = useState(false);
  const badge = displayBadge(p);
  const info = stockInfo(p);
  const isOut = info.status === "out";
  return (
    <article
      className={"g2-card" + (isOut ? " g2-card--out" : "")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen && onOpen(p)}
    >
      <div className="g2-card__media">
        {badge && <Badge kind={badge} />}
        <Heart active={wished} onClick={() => onWish && onWish(p)} />
        {p.image ? (
          <div className="g2-img" style={{ height: "100%" }}>
            <img src={p.image} alt={p.name} loading="lazy" />
          </div>
        ) : (
          <Placeholder label={hover ? "ver detalhe" : (p.catName || "").toLowerCase()} hue={p.hue} light={hover ? 88 : 93} style={{ height: "100%" }} ratio="auto" />
        )}
        <div className={"g2-card__addbar" + (hover ? " is-shown" : "")}>
          <button
            disabled={isOut}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOut) onAdd && onAdd(p);
            }}
          >
            {isOut ? "ESGOTADO" : "+ ADICIONAR"}
          </button>
        </div>
      </div>
      <div className="g2-card__body">
        <div className="g2-card__rating">
          <Stars value={p.rating} size={12} />
          <em>
            {Number(p.rating).toFixed(1)} ({p.reviews})
          </em>
        </div>
        <h3 className="g2-card__name">{p.name}</h3>
        <div className="g2-card__price">
          {p.oldPrice && <s>{brl(p.oldPrice)}</s>}
          <strong>{brl(p.price)}</strong>
        </div>
        <span className="g2-card__inst">3x de {brl(p.installment)} sem juros</span>
        {info.status === "low" && <span className="g2-card__stock">🔥 {info.label}</span>}
        {info.status === "out" && <span className="g2-card__stock g2-card__stock--out">Sem estoque no momento</span>}
      </div>
    </article>
  );
}

/* ---------- Ícone do WhatsApp ---------- */
export function WhatsIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24zm-3.6 4.4c-.17 0-.45.06-.68.31-.23.25-.9.88-.9 2.13 0 1.26.92 2.47 1.05 2.64.13.17 1.8 2.86 4.46 3.9 2.2.87 2.65.7 3.13.65.48-.04 1.55-.63 1.77-1.25.22-.62.22-1.15.15-1.26-.06-.11-.23-.17-.48-.3-.25-.12-1.55-.76-1.79-.85-.24-.09-.42-.13-.59.13-.17.25-.67.85-.83 1.02-.15.17-.3.2-.56.07-.25-.13-1.07-.4-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.44.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.39-.78-1.9-.2-.5-.41-.43-.56-.44l-.48-.01z" />
    </svg>
  );
}
