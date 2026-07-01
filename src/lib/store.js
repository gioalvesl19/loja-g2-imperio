/* G2 IMPÉRIO — camada de dados (localStorage).
   NENHUM backend/Supabase é usado por enquanto: todo o catálogo e as
   configurações vivem no navegador. O painel /admin escreve aqui e a
   loja lê daqui, com sincronização reativa (e entre abas). */

import { useSyncExternalStore, useMemo } from "react";
import { makeSeed } from "./seed.js";
import { slugify, installment as inst } from "./format.js";

const KEY = "g2_imperio_data_v3";
const CART_KEY = "g2_imperio_cart_v1";

/* ---------------- estado + persistência ---------------- */
let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) {
    console.warn("Falha ao ler dados salvos, usando seed.", e);
  }
  const seed = makeSeed();
  try {
    localStorage.setItem(KEY, JSON.stringify(seed));
  } catch {
    /* ignore quota */
  }
  return seed;
}

/** garante que dados carregados tenham todos os campos esperados */
function normalize(data) {
  const seed = makeSeed();
  const d = { ...seed, ...data };
  d.settings = { ...seed.settings, ...(data.settings || {}) };
  d.categories = Array.isArray(data.categories) ? data.categories : seed.categories;
  d.products = (Array.isArray(data.products) ? data.products : seed.products).map((p) => ({
    oldPrice: null,
    badge: null,
    colors: [],
    specs: [],
    comments: [],
    image: "",
    stock: 0,
    active: true,
    rating: 4.8,
    reviews: 0,
    installments: 3,
    installmentsFree: true,
    pixPct: null,
    ...p,
    slug: p.slug || slugify(p.name),
  }));
  d.kits = Array.isArray(data.kits) ? data.kits : seed.kits;
  d.reviews = Array.isArray(data.reviews) ? data.reviews : seed.reviews;
  d.blog = Array.isArray(data.blog) ? data.blog : seed.blog;
  d.hero = Array.isArray(data.hero) && data.hero.length ? data.hero : seed.hero;
  d.banner = { ...seed.banner, ...(data.banner || {}) };
  d.kitPromo = { ...seed.kitPromo, ...(data.kitPromo || {}) };
  return d;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Não foi possível salvar os dados (quota?).", e);
  }
}

function commit(next) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function getSnapshot() {
  return state;
}

// sincroniza quando outra aba altera os dados
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) {
      try {
        state = normalize(JSON.parse(e.newValue));
        listeners.forEach((l) => l());
      } catch {
        /* ignore */
      }
    }
  });
}

/* ---------------- helpers ---------------- */
const uid = (prefix) =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** junta o produto com os dados da categoria + campos derivados */
export function decorateProduct(p, categories) {
  const c = categories.find((cat) => cat.slug === p.cat);
  const parcelas = Number(p.installments) || 3;
  return {
    ...p,
    catName: c ? c.name : p.catName || "",
    hue: c ? c.hue : p.hue ?? 40,
    installments: parcelas,
    installment: (Number(p.price) || 0) / parcelas,
    slug: p.slug || slugify(p.name),
  };
}

/** estado visual de estoque de um produto */
export function stockInfo(p) {
  const stock = Number(p.stock) || 0;
  if (stock <= 0) return { status: "out", label: "Esgotado" };
  if (stock <= 5) return { status: "low", label: `Últimas ${stock} unidades` };
  return { status: "ok", label: "Em estoque" };
}

/** badge a exibir (esgotado tem prioridade; senão o badge de merchandising;
    senão "últimas unidades" quando o estoque está baixo) */
export function displayBadge(p) {
  const s = Number(p.stock) || 0;
  if (s <= 0) return "out";
  if (p.badge) return p.badge;
  if (s <= 5) return "last";
  return null;
}

/* ---------------- ações (CRUD) ---------------- */
export const db = {
  /* -------- produtos -------- */
  addProduct(data) {
    const id = uid("p");
    const product = {
      id,
      name: data.name || "Novo produto",
      cat: data.cat || (state.categories[0] && state.categories[0].slug) || "",
      price: Number(data.price) || 0,
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      badge: data.badge || null,
      colors: data.colors || [],
      specs: data.specs || [],
      desc: data.desc || "",
      image: data.image || "",
      rating: data.rating != null ? Number(data.rating) : 4.8,
      reviews: data.reviews != null ? Number(data.reviews) : 0,
      stock: data.stock != null ? Number(data.stock) : 0,
      installments: data.installments != null ? Number(data.installments) : 3,
      installmentsFree: data.installmentsFree !== false,
      pixPct: data.pixPct != null && data.pixPct !== "" ? Number(data.pixPct) : null,
      active: data.active !== false,
      comments: data.comments || [],
      slug: slugify(data.name || "novo-produto"),
    };
    commit({ ...state, products: [product, ...state.products] });
    return id;
  },
  updateProduct(id, patch) {
    commit({
      ...state,
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...patch,
              price: patch.price != null ? Number(patch.price) : p.price,
              oldPrice:
                patch.oldPrice != null
                  ? patch.oldPrice
                    ? Number(patch.oldPrice)
                    : null
                  : p.oldPrice,
              stock: patch.stock != null ? Number(patch.stock) : p.stock,
              rating: patch.rating != null ? Number(patch.rating) : p.rating,
              reviews: patch.reviews != null ? Number(patch.reviews) : p.reviews,
              slug: patch.name ? slugify(patch.name) : p.slug,
            }
          : p
      ),
    });
  },
  deleteProduct(id) {
    commit({ ...state, products: state.products.filter((p) => p.id !== id) });
  },
  duplicateProduct(id) {
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    const copy = { ...p, id: uid("p"), name: p.name + " (cópia)", slug: slugify(p.name + " copia") };
    commit({ ...state, products: [copy, ...state.products] });
  },
  setProductActive(id, active) {
    this.updateProduct(id, { active });
  },
  decrementStock(id, qty) {
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    const next = Math.max(0, (Number(p.stock) || 0) - qty);
    this.updateProduct(id, { stock: next });
  },

  /* -------- comentários / avaliações do produto -------- */
  addComment(productId, comment) {
    const c = {
      id: uid("c"),
      name: comment.name || "Cliente G2",
      stars: Number(comment.stars) || 5,
      text: comment.text || "",
      date: comment.date || new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
    };
    commit({
      ...state,
      products: state.products.map((p) =>
        p.id === productId ? { ...p, comments: [...(p.comments || []), c] } : p
      ),
    });
  },
  deleteComment(productId, commentId) {
    commit({
      ...state,
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) }
          : p
      ),
    });
  },

  /* -------- categorias -------- */
  addCategory(data) {
    const slug = slugify(data.slug || data.name);
    if (!slug || state.categories.some((c) => c.slug === slug)) return null;
    const cat = {
      slug,
      name: data.name || slug,
      short: data.short || data.name || slug,
      hue: Number(data.hue) || 40,
    };
    commit({ ...state, categories: [...state.categories, cat] });
    return slug;
  },
  updateCategory(slug, patch) {
    commit({
      ...state,
      categories: state.categories.map((c) =>
        c.slug === slug ? { ...c, ...patch, hue: patch.hue != null ? Number(patch.hue) : c.hue } : c
      ),
    });
  },
  deleteCategory(slug) {
    // não remove se houver produtos usando a categoria
    if (state.products.some((p) => p.cat === slug)) return false;
    commit({ ...state, categories: state.categories.filter((c) => c.slug !== slug) });
    return true;
  },

  /* -------- aparência (capas, banner, kit) -------- */
  setHero(hero) {
    commit({ ...state, hero });
  },
  addHeroSlide() {
    const slide = { id: uid("h"), theme: "dark", kicker: "NOVIDADE", title: "NOVA CAPA", sub: "", ctaLabel: "VER MAIS", ctaCat: state.categories[0] ? state.categories[0].slug : "promocoes", image: "", hue: 42 };
    commit({ ...state, hero: [...state.hero, slide] });
  },
  updateHeroSlide(id, patch) {
    commit({ ...state, hero: state.hero.map((h) => (h.id === id ? { ...h, ...patch } : h)) });
  },
  removeHeroSlide(id) {
    commit({ ...state, hero: state.hero.filter((h) => h.id !== id) });
  },
  setBanner(patch) {
    commit({ ...state, banner: { ...state.banner, ...patch } });
  },
  setKitPromo(patch) {
    commit({ ...state, kitPromo: { ...state.kitPromo, ...patch } });
  },

  /* -------- configurações -------- */
  updateSettings(patch) {
    commit({ ...state, settings: { ...state.settings, ...patch } });
  },

  /* -------- dados globais -------- */
  resetAll() {
    commit(makeSeed());
  },
  exportAll() {
    return JSON.stringify(state, null, 2);
  },
  importAll(json) {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    commit(normalize(parsed));
  },
};

/* ---------------- hooks React ---------------- */
export function useData() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** hook conveniente para a loja: dados já decorados */
export function useStore() {
  const data = useData();
  return useMemo(() => {
    const categories = data.categories;
    const allProducts = data.products.map((p) => decorateProduct(p, categories));
    const products = allProducts.filter((p) => p.active !== false);
    return {
      raw: data,
      settings: data.settings,
      categories,
      products, // apenas ativos (loja)
      allProducts, // todos (admin)
      kits: data.kits,
      reviews: data.reviews,
      blog: data.blog,
      hero: data.hero,
      banner: data.banner,
      kitPromo: data.kitPromo,
      db,
    };
  }, [data]);
}

/* ---------------- carrinho (persistência separada) ---------------- */
export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}
