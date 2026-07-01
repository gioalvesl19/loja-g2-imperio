/* G2 IMPÉRIO — ponto de entrada + roteador loja/admin */
import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { StoreApp } from "./store/StoreApp.jsx";
import { AdminApp } from "./admin/AdminApp.jsx";

function isAdminPath(pathname) {
  return pathname.replace(/\/+$/, "").toLowerCase().endsWith("/admin");
}

function Root() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  if (isAdminPath(path)) {
    return <AdminApp onExit={() => navigate("/")} />;
  }
  return <StoreApp onAdmin={() => navigate("/admin")} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
