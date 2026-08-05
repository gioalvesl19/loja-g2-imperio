/* G2 IMPÉRIO — layout: AnnouncementBar, Header, Footer, BottomBar, Logo */
import { useState, useEffect, useRef } from "react";
import { Placeholder } from "./primitives.jsx";
import { POLICY_LINKS } from "../store/policies.js";

function buildNav(categories) {
  const nav = categories.slice(0, 5).map((c) => ({ label: c.name, cat: c.slug }));
  nav.push({ label: "Perguntas Frequentes", view: "faq" });
  return nav;
}

/* ---------- Barra de anúncio ---------- */
export function AnnouncementBar({ onToast, settings }) {
  const [closed, setClosed] = useState(false);
  if (closed || settings.announcementEnabled === false) return null;
  const coupon = settings.coupon || "";
  const msg = settings.announcement || "";
  if (!msg && !coupon) return null;
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(coupon);
    onToast && onToast("📋 Cupom copiado!");
  };
  return (
    <div className="g2-ann">
      <div className="g2-ann__track">
        {[0, 1].map((k) => (
          <div className="g2-ann__group" key={k}>
            {[0, 1, 2].map((j) => (
              <span key={j} className="g2-ann__item">
                {msg}{" "}
                {coupon && (
                  <button className="g2-ann__coupon" onClick={copy}>
                    {coupon} <em>COPIAR</em>
                  </button>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
      <button className="g2-ann__close" onClick={() => setClosed(true)} aria-label="Fechar">
        ✕
      </button>
    </div>
  );
}

/* ---------- Logo ---------- */
export function Logo({ onClick, light, name = "G2 IMPÉRIO" }) {
  const [first, ...rest] = name.split(" ");
  return (
    <button className={"g2-logo" + (light ? " g2-logo--light" : "")} onClick={onClick} aria-label={name + " — início"}>
      <span className="g2-logo__crown">
        <svg viewBox="0 0 32 24" width="26" height="20" aria-hidden="true">
          <path d="M2 22h28l-2.5-15-7 7-4.5-11-4.5 11-7-7L2 22z" fill="currentColor" />
        </svg>
      </span>
      <span className="g2-logo__word">
        {first} <b>{rest.join(" ")}</b>
      </span>
    </button>
  );
}

/* ---------- Cabeçalho ---------- */
export function Header({ onNav, onSearch, onMenu, onAccount, categories, settings }) {
  const [open, setOpen] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const lastY = useRef(0);
  const NAV = buildNav(categories);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 10);
      setHidden(y > 240 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"g2-head" + (solid ? " is-solid" : "") + (hidden ? " is-hidden" : "")} onMouseLeave={() => setOpen(null)}>
      <div className="g2-head__bar">
        <div className="g2-head__left">
          <button className="g2-iconbtn g2-head__menu" onClick={onMenu} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <button className="g2-iconbtn" onClick={onSearch} aria-label="Buscar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
          </button>
        </div>

        <Logo onClick={() => onNav({ view: "home" })} name={settings.storeName} />

        <div className="g2-head__right">
          <button className="g2-iconbtn g2-head__acct" onClick={onAccount} aria-label="Administrador" title="Painel do administrador">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <em>Admin</em>
          </button>
        </div>
      </div>

      <nav className="g2-nav">
        {NAV.map((n, i) => (
          <div className="g2-nav__item" key={i} onMouseEnter={() => setOpen(i)}>
            <button
              className={"g2-nav__link" + (open === i ? " is-open" : "")}
              onClick={() => (n.view ? onNav({ view: n.view }) : n.cat ? onNav({ view: "collection", cat: n.cat }) : null)}
            >
              {n.label}
            </button>
            {open === i &&
              (n.items || n.mega || n.links) &&
              (n.mega ? (
                <MegaMenu categories={categories} onNav={onNav} onClose={() => setOpen(null)} />
              ) : (
                <div className="g2-nav__drop">
                  {n.links
                    ? n.links.map(([lbl, r], j) => (
                        <button
                          key={j}
                          onClick={() => {
                            onNav(r);
                            setOpen(null);
                          }}
                        >
                          {lbl}
                        </button>
                      ))
                    : n.items.map((it, j) => (
                        <button
                          key={j}
                          onClick={() => {
                            onNav({ view: "collection", cat: n.cat || "promocoes", title: it });
                            setOpen(null);
                          }}
                        >
                          {it}
                        </button>
                      ))}
                </div>
              ))}
          </div>
        ))}
      </nav>
    </header>
  );
}

function MegaMenu({ categories, onNav, onClose }) {
  return (
    <div className="g2-mega">
      {categories.map((c) => (
        <button
          key={c.slug}
          className="g2-mega__cat"
          onClick={() => {
            onNav({ view: "collection", cat: c.slug });
            onClose();
          }}
        >
          <Placeholder label={c.short.toLowerCase()} hue={c.hue} ratio="4 / 3" round={10} light={94} />
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Rodapé ---------- */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer({ onNav, categories, settings, onAdmin }) {
  return (
    <footer className="g2-foot">
      <div className="g2-foot__cols g2-foot__cols--3">
        <div className="g2-foot__col">
          <h4>Categorias</h4>
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav({ view: "collection", cat: c.slug });
                  }}
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="g2-foot__col">
          <h4>Políticas</h4>
          <ul>
            {POLICY_LINKS.map((p) => (
              <li key={p.slug}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav({ view: "policy", slug: p.slug });
                  }}
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="g2-foot__col g2-foot__contact">
          <h4>Contato</h4>
          <ul>
            <li>
              <a href={"https://wa.me/" + settings.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp: {settings.whatsappDisplay}
              </a>
            </li>
            {settings.whatsapp2 && (
              <li>
                <a href={"https://wa.me/" + settings.whatsapp2} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {settings.whatsapp2Display}
                </a>
              </li>
            )}
            <li>Atendimento: Seg–Sex 9h–18h</li>
            {settings.address && (
              <li style={{ marginTop: ".2rem" }}>
                <a href={settings.mapUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ lineHeight: 1.5, display: "block" }}>
                  📍{" "}
                  {settings.address.split("\n").map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </a>
              </li>
            )}
          </ul>
          <div className="g2-foot__social">
            <a href={settings.instagram || "#"} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="g2-foot__pay">
        {["VISA", "MASTER", "ELO", "PIX", "BOLETO", "AMEX"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="g2-foot__legal">
        <Logo light onClick={() => onNav({ view: "home" })} name={settings.storeName} />
        <p>{settings.storeName} © 2026 — Todos os direitos reservados. Anápolis-GO · Estilo com Atitude.</p>
        <a className="g2-foot__adminlink" href="/admin" onClick={(e) => { if (onAdmin) { e.preventDefault(); onAdmin(); } }}>
          Painel do administrador
        </a>
      </div>
    </footer>
  );
}

/* ---------- Barra inferior (mobile) ---------- */
export function BottomBar({ view, onNav, onSearch, onAccount, onWhats }) {
  const Item = ({ icon, label, active, onClick, center }) => (
    <button className={"g2-bb__item" + (active ? " is-active" : "") + (center ? " g2-bb__item--center" : "")} onClick={onClick}>
      <span className="g2-bb__ico">{icon}</span>
      <span className="g2-bb__lbl">{label}</span>
    </button>
  );
  return (
    <nav className="g2-bb g2-bb--4">
      <Item
        label="Início"
        active={view === "home"}
        onClick={() => onNav({ view: "home" })}
        icon={
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 11l9-7 9 7" />
            <path d="M5 10v10h14V10" />
          </svg>
        }
      />
      <Item
        label="Buscar"
        onClick={onSearch}
        icon={
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        }
      />
      <Item
        label="WhatsApp"
        center
        onClick={onWhats}
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm-3.6 6.07c.17 0 .34.01.49.02.16.01.37-.06.58.44.22.53.74 1.83.8 1.96.06.13.1.29.02.46-.08.17-.12.28-.24.43-.12.15-.26.33-.37.44-.12.13-.25.27-.11.51.14.25.62 1.02 1.33 1.65.91.81 1.68 1.06 1.93 1.18.24.12.39.1.53-.06.14-.16.61-.71.77-.96.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.11.06.63-.16 1.24-.22.61-1.29 1.17-1.79 1.24-.46.07-1.03.1-1.66-.1-.4-.13-.92-.3-1.58-.59-2.78-1.2-4.6-4-4.74-4.18-.14-.19-1.13-1.5-1.13-2.87 0-1.36.72-2.03.97-2.31.26-.28.56-.35.75-.35z" />
          </svg>
        }
      />
      <Item
        label="Admin"
        onClick={onAccount}
        icon={
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        }
      />
    </nav>
  );
}
