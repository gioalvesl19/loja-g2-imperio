/* G2 IMPÉRIO — entrada + roteador (loja / admin / produto por URL) */
import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { useStore } from "./lib/store.js";
import { StoreApp } from "./store/StoreApp.jsx";
import { AdminApp } from "./admin/AdminApp.jsx";

function parsePath(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  if (clean.toLowerCase().endsWith("/admin")) return { kind: "admin", slug: null };
  const m = clean.match(/\/produto\/([^/]+)$/i);
  if (m) return { kind: "store", slug: decodeURIComponent(m[1]) };
  return { kind: "store", slug: null };
}

function Loading() {
  return (
    <div className="g2-boot">
      <div className="g2-boot__logo">
        <svg viewBox="0 0 32 24" width="34" height="26" aria-hidden="true">
          <path d="M2 22h28l-2.5-15-7 7-4.5-11-4.5 11-7-7L2 22z" fill="currentColor" />
        </svg>
        <span>G2 IMPÉRIO</span>
      </div>
      <div className="g2-boot__bar"><span /></div>
    </div>
  );
}

function Root() {
  const { ready } = useStore();
  const [route, setRoute] = useState(() => parsePath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to) => {
    window.history.pushState({}, "", to);
    setRoute(parsePath(to));
    window.scrollTo(0, 0);
  }, []);

  if (route.kind === "admin") {
    return <AdminApp onExit={() => navigate("/")} />;
  }
  if (!ready) return <Loading />;
  return <StoreApp productSlug={route.slug} onAdmin={() => navigate("/admin")} navigate={navigate} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
