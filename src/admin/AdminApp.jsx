/* G2 IMPÉRIO — painel administrativo (localStorage, sem backend) */
import { useState } from "react";
import { useStore } from "../lib/store.js";
import { Dashboard } from "./Dashboard.jsx";
import { ProductsTab } from "./ProductsTab.jsx";
import { CategoriesTab } from "./CategoriesTab.jsx";
import { AppearanceTab } from "./AppearanceTab.jsx";
import { CommentsTab } from "./CommentsTab.jsx";
import { SettingsTab } from "./SettingsTab.jsx";

const AUTH_KEY = "g2_admin_auth";

const ICONS = {
  dash: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  prod: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4",
  cat: "M4 5h16M4 12h16M4 19h16",
  appear: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  rev: "M12 2l3 6 6 1-4.5 4 1 6L12 16l-5.5 3 1-6L3 9l6-1z",
  set: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2V21a2 2 0 11-4 0v-.1A1.7 1.7 0 004.6 19l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00-1.2-2.9H0a2 2 0 110-4h.1A1.7 1.7 0 001.3 4.6l-.1-.1A2 2 0 114 1.7l.1.1a1.7 1.7 0 001.9.3H6a1.7 1.7 0 001-1.5V0a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V6a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
};

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Login({ onOk, expected, storeName }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pwd === expected) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onOk();
    } else {
      setErr(true);
    }
  };
  return (
    <div className="adm-login">
      <form className="adm-login__card" onSubmit={submit}>
        <div className="adm-login__logo">
          <svg viewBox="0 0 32 24" width="30" height="22" aria-hidden="true">
            <path d="M2 22h28l-2.5-15-7 7-4.5-11-4.5 11-7-7L2 22z" fill="currentColor" />
          </svg>
          <span>{storeName}</span>
        </div>
        <h1>Painel do Administrador</h1>
        <p>Digite a senha para acessar a gestão da loja.</p>
        <div className="adm-field">
          <input
            className="adm-input"
            type="password"
            autoFocus
            placeholder="Senha"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setErr(false);
            }}
          />
        </div>
        {err && <div className="adm-login__err">Senha incorreta. Tente novamente.</div>}
        <button className="g2-btn g2-btn--gold g2-btn--full g2-btn--lg" type="submit">
          Entrar
        </button>
        <p style={{ fontSize: ".78rem" }}>Senha padrão: <b>g2admin</b> (altere em Configurações).</p>
      </form>
    </div>
  );
}

export function AdminApp({ onExit }) {
  const store = useStore();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [tab, setTab] = useState("dash");
  const [sideOpen, setSideOpen] = useState(false);

  if (!authed) {
    return <Login onOk={() => setAuthed(true)} expected={store.settings.adminPassword || "g2admin"} storeName={store.settings.storeName} />;
  }

  const NAV = [
    ["dash", "Painel", ICONS.dash],
    ["prod", "Produtos", ICONS.prod],
    ["cat", "Categorias", ICONS.cat],
    ["appear", "Aparência", ICONS.appear],
    ["rev", "Avaliações", ICONS.rev],
    ["set", "Configurações", ICONS.set],
  ];

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  const go = (t) => {
    setTab(t);
    setSideOpen(false);
  };

  return (
    <div className="adm">
      <div className={"adm-backdrop" + (sideOpen ? " is-open" : "")} onClick={() => setSideOpen(false)} />
      <div className="adm-shell">
        <aside className={"adm-side" + (sideOpen ? " is-open" : "")}>
          <div className="adm-side__logo">
            <svg viewBox="0 0 32 24" width="24" height="18" aria-hidden="true">
              <path d="M2 22h28l-2.5-15-7 7-4.5-11-4.5 11-7-7L2 22z" fill="currentColor" />
            </svg>
            <span>{store.settings.storeName}</span>
          </div>
          <nav className="adm-side__nav">
            {NAV.map(([key, label, d]) => (
              <button key={key} className={"adm-side__link" + (tab === key ? " is-active" : "")} onClick={() => go(key)}>
                <Icon d={d} />
                {label}
              </button>
            ))}
          </nav>
          <div className="adm-side__foot">
            <a href="/" onClick={(e) => { if (onExit) { e.preventDefault(); onExit(); } }}>
              ← Ver a loja
            </a>
            <button onClick={logout}>Sair do painel</button>
          </div>
        </aside>

        <main className="adm-main">
          <div className="adm-mobbar">
            <button onClick={() => setSideOpen(true)} aria-label="Menu">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            <strong>{store.settings.storeName} · Admin</strong>
          </div>

          {tab === "dash" && <Dashboard store={store} onGo={go} />}
          {tab === "prod" && <ProductsTab store={store} />}
          {tab === "cat" && <CategoriesTab store={store} />}
          {tab === "appear" && <AppearanceTab store={store} />}
          {tab === "rev" && <CommentsTab store={store} />}
          {tab === "set" && <SettingsTab store={store} />}
        </main>
      </div>
    </div>
  );
}
