/* G2 IMPÉRIO — layout: AnnouncementBar, Header, Footer, BottomBar, Logo */
import { useState, useEffect, useRef } from "react";
import { Btn, Placeholder } from "./primitives.jsx";

/* subitens ricos para as categorias padrão (apenas cosmético no cabeçalho) */
const SUBITEMS = {
  oculos: ["Óculos de Sol Masculino", "Óculos de Sol Feminino", "Óculos Esportivo", "Coleção Premium", "Ver Todos"],
  relogios: ["Relógios Masculinos", "Relógios Femininos", "Smartwatches", "Relógios Esportivos", "Ver Todos"],
  "bolsas-malas": ["Bolsas Femininas", "Bolsas Masculinas", "Malas de Viagem", "Necessaires", "Ver Todos"],
};

function buildNav(categories) {
  const nav = [{ label: "Coleções", items: ["Lançamentos", "Mais Vendidos", "Promoções", "Kits e Combos"] }];
  categories.slice(0, 3).forEach((c) => {
    nav.push({ label: c.name, cat: c.slug, items: SUBITEMS[c.slug] || ["Ver Todos"] });
  });
  nav.push({ label: "Mais Produtos", mega: true });
  nav.push({
    label: "Sobre nós",
    view: "about",
    links: [
      ["Sobre nós", { view: "about" }],
      ["Perguntas Frequentes", { view: "faq" }],
    ],
  });
  return nav;
}

/* ---------- Barra de anúncio ---------- */
export function AnnouncementBar({ onToast, settings }) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  const coupon = settings.coupon || "G2IMPERIO10";
  const msg = settings.announcement || "FRETE GRÁTIS · Cashback · Cupom:";
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
                <button className="g2-ann__coupon" onClick={copy}>
                  {coupon} <em>COPIAR</em>
                </button>
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
export function Header({ cartCount, wishCount, onNav, onSearch, onCart, onMenu, onWish, categories, settings }) {
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
          <button className="g2-iconbtn g2-head__acct" aria-label="Conta">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <em>Conta</em>
          </button>
          <button className="g2-iconbtn g2-head__wish" onClick={onWish} aria-label="Lista de desejos">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 5 5.2 5c2 0 3.3 1.1 4.1 2.3C10.5 6.1 11.8 5 13.8 5 17 5 18.6 8.3 17 11.7 14.5 16.4 12 21 12 21z" />
            </svg>
            {wishCount > 0 && <span className="g2-badgecount g2-badgecount--gold">{wishCount}</span>}
          </button>
          <button className="g2-iconbtn g2-head__cart" onClick={onCart} aria-label="Carrinho">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {cartCount > 0 && <span className="g2-badgecount">{cartCount}</span>}
          </button>
        </div>
      </div>

      <nav className="g2-nav">
        {NAV.map((n, i) => (
          <div className="g2-nav__item" key={i} onMouseEnter={() => setOpen(i)}>
            <button
              className={"g2-nav__link" + (open === i ? " is-open" : "")}
              onClick={() => (n.view ? onNav({ view: n.view }) : n.cat ? onNav({ view: "collection", cat: n.cat }) : n.label === "Coleções" ? onNav({ view: "collection", cat: "promocoes" }) : null)}
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
export function Footer({ onNav, onToast, categories, settings, onAdmin }) {
  const [email, setEmail] = useState("");
  const cols = {
    Categorias: categories.map((c) => c.name),
    "Mais da G2": ["Sobre nós", "Trabalhe conosco", "Blog", "FAQ", "Programa de Afiliados"],
    Parcerias: ["Cashback G2", "Seja um Revendedor", "Influenciadores", "Parceria para Eventos", "Cadastro de Afiliado"],
    Políticas: ["Privacidade", "Trocas e Devoluções", "Entrega", "Cashback", "Promoções", "Termos de Uso"],
  };
  const routeFor = (label) => {
    if (label === "Sobre nós") return { view: "about" };
    if (label === "FAQ") return { view: "faq" };
    const cat = categories.find((c) => c.name === label);
    if (cat) return { view: "collection", cat: cat.slug };
    return { view: "collection", cat: categories[0] ? categories[0].slug : "promocoes" };
  };
  return (
    <footer className="g2-foot">
      <div className="g2-foot__news">
        <div className="g2-foot__news-in">
          <div>
            <h3 className="g2-h2">ENTRE PARA O CLUBE G2</h3>
            <p>Novidades, conteúdos exclusivos e ofertas secretas direto no seu e-mail.</p>
          </div>
          <form
            className="g2-foot__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) {
                onToast("✅ Bem-vindo ao Clube G2!");
                setEmail("");
              }
            }}
          >
            <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Btn variant="gold">ENTRAR PARA O CLUBE</Btn>
          </form>
        </div>
      </div>
      <div className="g2-foot__cols">
        {Object.entries(cols).map(([h, items]) => (
          <div key={h} className="g2-foot__col">
            <h4>{h}</h4>
            <ul>
              {items.map((it) => (
                <li key={it}>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      onNav(routeFor(it));
                    }}
                    href="#"
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="g2-foot__col g2-foot__contact">
          <h4>Contato</h4>
          <ul>
            <li>WhatsApp: {settings.phoneDisplay}</li>
            <li>{settings.email}</li>
            <li>Atendimento: Seg–Sex 9h–18h</li>
          </ul>
          <div className="g2-foot__social">
            {["Instagram", "TikTok", "YouTube", "Facebook", "Pinterest"].map((s) => (
              <a key={s} href="#" onClick={(e) => e.preventDefault()} title={s}>
                {s[0]}
              </a>
            ))}
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
        <p>{settings.storeName} © 2026 — Todos os direitos reservados. CNPJ: XX.XXX.XXX/0001-XX · Estilo com Atitude.</p>
        <a className="g2-foot__adminlink" href="/admin" onClick={(e) => { if (onAdmin) { e.preventDefault(); onAdmin(); } }}>
          Painel do administrador
        </a>
      </div>
    </footer>
  );
}

/* ---------- Barra inferior (mobile) ---------- */
export function BottomBar({ view, cartCount, onNav, onSearch, onKit, onCart }) {
  const Item = ({ icon, label, active, onClick, badge, center }) => (
    <button className={"g2-bb__item" + (active ? " is-active" : "") + (center ? " g2-bb__item--center" : "")} onClick={onClick}>
      <span className="g2-bb__ico">
        {icon}
        {badge > 0 && <em>{badge}</em>}
      </span>
      <span className="g2-bb__lbl">{label}</span>
    </button>
  );
  return (
    <nav className="g2-bb">
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
        label="Kit Rápido"
        center
        onClick={onKit}
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
          </svg>
        }
      />
      <Item
        label="Conta"
        icon={
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        }
      />
      <Item
        label="Carrinho"
        badge={cartCount}
        onClick={onCart}
        icon={
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        }
      />
    </nav>
  );
}
