/* G2 IMPÉRIO — camada de dados.
   Fonte de verdade: Supabase (leitura pública, escrita do admin autenticado).
   Fallback: seed local + localStorage (quando o Supabase não está configurado). */

import { useSyncExternalStore, useMemo } from "react";
import { makeSeed } from "./seed.js";
import { slugify, installment as inst } from "./format.js";
import { supabase, hasSupabase } from "./supabase.js";

const KEY = "g2_imperio_data_v3";
const CART_KEY = "g2_imperio_cart_v1";

/* ---------------- estado ---------------- */
let store = {
  data: hasSupabase ? emptyData() : loadLocal(),
  ready: !hasSupabase,
  session: null,
};
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));
const getSnapshot = () => store;

function emptyData() {
  const s = makeSeed();
  return { ...s, products: [], categories: s.categories };
}

/* ---------------- fallback local (sem Supabase) ---------------- */
function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalizeLocal(JSON.parse(raw));
  } catch {}
  const seed = makeSeed();
  try {
    localStorage.setItem(KEY, JSON.stringify(seed));
  } catch {}
  return seed;
}
function normalizeLocal(data) {
  const seed = makeSeed();
  const d = { ...seed, ...data };
  d.settings = { ...seed.settings, ...(data.settings || {}) };
  d.categories = Array.isArray(data.categories) ? data.categories : seed.categories;
  d.products = (Array.isArray(data.products) ? data.products : seed.products).map((p) => ({
    oldPrice: null, badge: null, colors: [], specs: [], comments: [], image: "", stock: 0,
    active: true, rating: 4.8, reviews: 0, installments: 3, installmentsFree: true, pixPct: null,
    ...p,
    images: Array.isArray(p.images) ? p.images : p.image ? [p.image] : [],
    slug: p.slug || slugify(p.name),
  }));
  d.hero = Array.isArray(data.hero) && data.hero.length ? data.hero : seed.hero;
  d.banner = { ...seed.banner, ...(data.banner || {}) };
  d.kitPromo = { ...seed.kitPromo, ...(data.kitPromo || {}) };
  return d;
}
function saveLocal(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage cheio:", e);
  }
}

/* ---------------- mapeamento DB <-> app ---------------- */
function fromDb(r) {
  return {
    id: r.id, slug: r.slug, name: r.name, cat: r.cat,
    price: r.price != null ? Number(r.price) : null,
    oldPrice: r.old_price != null ? Number(r.old_price) : null,
    badge: r.badge, colors: r.colors || [], specs: r.specs || [], desc: r.desc || "",
    images: r.images || [], image: (r.images && r.images[0]) || "",
    rating: r.rating != null ? Number(r.rating) : 4.9,
    reviews: r.reviews || 0, stock: r.stock || 0,
    installments: r.installments || 3, installmentsFree: r.installments_free !== false,
    pixPct: r.pix_pct != null ? Number(r.pix_pct) : null,
    active: r.active !== false, comments: r.comments || [], sort: r.sort || 0,
  };
}
function toDb(p) {
  return {
    id: p.id, slug: p.slug || slugify(p.name), name: p.name || "Produto", cat: p.cat || null,
    price: p.price === "" || p.price == null ? null : Number(p.price),
    old_price: p.oldPrice ? Number(p.oldPrice) : null,
    badge: p.badge || null, colors: p.colors || [], specs: p.specs || [], desc: p.desc || "",
    images: p.images || [], rating: Number(p.rating) || 4.9, reviews: Number(p.reviews) || 0,
    stock: Number(p.stock) || 0, installments: Number(p.installments) || 3,
    installments_free: p.installmentsFree !== false,
    pix_pct: p.pixPct != null && p.pixPct !== "" ? Number(p.pixPct) : null,
    active: p.active !== false, comments: p.comments || [], sort: p.sort || 0,
  };
}

/* ---------------- boot (carrega do Supabase) ---------------- */
async function reload() {
  try {
    const [cats, prods, content] = await Promise.all([
      supabase.from("categories").select("*").order("sort"),
      supabase.from("products").select("*").order("sort"),
      supabase.from("store_content").select("*").eq("id", 1).maybeSingle(),
    ]);
    const seed = makeSeed();
    const c = content.data || {};
    const data = {
      categories: cats.data && cats.data.length ? cats.data.map((x) => ({ slug: x.slug, name: x.name, short: x.short, hue: x.hue })) : seed.categories,
      products: (prods.data || []).map(fromDb),
      kits: seed.kits, reviews: seed.reviews, blog: seed.blog,
      settings: { ...seed.settings, ...(c.settings || {}) },
      hero: c.hero && c.hero.length ? c.hero : seed.hero,
      banner: { ...seed.banner, ...(c.banner || {}) },
      kitPromo: { ...seed.kitPromo, ...(c.kit_promo || {}) },
    };
    store = { ...store, data, ready: true };
    emit();
  } catch (e) {
    console.error("Falha ao carregar do Supabase:", e);
    store = { ...store, ready: true };
    emit();
  }
}
if (hasSupabase) {
  supabase.auth.getSession().then(({ data }) => {
    store = { ...store, session: data.session };
    emit();
  });
  supabase.auth.onAuthStateChange((_e, session) => {
    store = { ...store, session };
    emit();
  });
  reload();
}

/* ---------------- helpers ---------------- */
const uid = (prefix) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function setData(next) {
  store = { ...store, data: next };
  if (!hasSupabase) saveLocal(next);
  emit();
}
function persistContent(d) {
  if (hasSupabase) supabase.from("store_content").upsert({ id: 1, settings: d.settings, hero: d.hero, banner: d.banner, kit_promo: d.kitPromo }).then(({ error }) => error && console.error("store_content:", error.message));
}
function pushProduct(p) {
  if (hasSupabase) supabase.from("products").upsert(toDb(p)).then(({ error }) => error && console.error("produto:", error.message));
}
function delProduct(id) {
  if (hasSupabase) supabase.from("products").delete().eq("id", id).then(({ error }) => error && console.error("del produto:", error.message));
}

export function decorateProduct(p, categories) {
  const c = categories.find((cat) => cat.slug === p.cat);
  const parcelas = Number(p.installments) || 3;
  const images = Array.isArray(p.images) ? p.images : p.image ? [p.image] : [];
  return {
    ...p, images, image: images[0] || "",
    catName: c ? c.name : p.catName || "",
    hue: c ? c.hue : p.hue ?? 40,
    installments: parcelas,
    installment: (Number(p.price) || 0) / parcelas,
    slug: p.slug || slugify(p.name),
  };
}
export function hasPrice(p) {
  return p && p.price != null && Number(p.price) > 0;
}
export function stockInfo(p) {
  const stock = Number(p.stock) || 0;
  if (stock <= 0) return { status: "out", label: "Esgotado" };
  if (stock <= 5) return { status: "low", label: `Últimas ${stock} unidades` };
  return { status: "ok", label: "Em estoque" };
}
export function displayBadge(p) {
  const s = Number(p.stock) || 0;
  if (s <= 0) return "out";
  if (p.badge) return p.badge;
  if (s <= 5) return "last";
  return null;
}

/* ---------------- ações (CRUD) ---------------- */
export const db = {
  /* -------- auth -------- */
  async signIn(email, password) {
    if (!hasSupabase) return { error: null, local: true };
    const { error } = await supabase.auth.signInWithPassword({ email: (email || "").trim(), password });
    return { error };
  },
  async signOut() {
    if (hasSupabase) await supabase.auth.signOut();
  },

  /* -------- produtos -------- */
  addProduct(data) {
    const id = (slugify(data.name || "produto") || "produto") + "-" + Math.random().toString(36).slice(2, 6);
    const product = {
      id, slug: id, name: data.name || "Novo produto",
      cat: data.cat || (store.data.categories[0] && store.data.categories[0].slug) || "",
      price: data.price === "" || data.price == null ? null : Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      badge: data.badge || null, colors: data.colors || [], specs: data.specs || [],
      desc: data.desc || "", images: Array.isArray(data.images) ? data.images : data.image ? [data.image] : [],
      image: "", rating: data.rating != null ? Number(data.rating) : 4.9, reviews: data.reviews != null ? Number(data.reviews) : 0,
      stock: data.stock != null ? Number(data.stock) : 0, installments: data.installments != null ? Number(data.installments) : 3,
      installmentsFree: data.installmentsFree !== false, pixPct: data.pixPct != null && data.pixPct !== "" ? Number(data.pixPct) : null,
      active: data.active !== false, comments: data.comments || [], sort: store.data.products.length,
    };
    setData({ ...store.data, products: [product, ...store.data.products] });
    pushProduct(product);
    return id;
  },
  updateProduct(id, patch) {
    let updated;
    const products = store.data.products.map((p) => {
      if (p.id !== id) return p;
      updated = {
        ...p, ...patch,
        price: patch.price !== undefined ? (patch.price === "" || patch.price == null ? null : Number(patch.price)) : p.price,
        oldPrice: patch.oldPrice !== undefined ? (patch.oldPrice ? Number(patch.oldPrice) : null) : p.oldPrice,
        stock: patch.stock != null ? Number(patch.stock) : p.stock,
        rating: patch.rating != null ? Number(patch.rating) : p.rating,
        reviews: patch.reviews != null ? Number(patch.reviews) : p.reviews,
        image: patch.images != null ? patch.images[0] || "" : p.image,
        slug: patch.name ? slugify(patch.name) : p.slug,
      };
      return updated;
    });
    setData({ ...store.data, products });
    if (updated) pushProduct(updated);
  },
  deleteProduct(id) {
    setData({ ...store.data, products: store.data.products.filter((p) => p.id !== id) });
    delProduct(id);
  },
  duplicateProduct(id) {
    const p = store.data.products.find((x) => x.id === id);
    if (!p) return;
    const nid = slugify(p.name + " copia") + "-" + Math.random().toString(36).slice(2, 6);
    const copy = { ...p, id: nid, slug: nid, name: p.name + " (cópia)" };
    setData({ ...store.data, products: [copy, ...store.data.products] });
    pushProduct(copy);
  },
  setProductActive(id, active) {
    this.updateProduct(id, { active });
  },

  /* -------- comentários -------- */
  addComment(productId, comment) {
    const c = {
      id: uid("c"), name: comment.name || "Cliente G2", stars: Number(comment.stars) || 5,
      text: comment.text || "", date: comment.date || new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
    };
    let updated;
    const products = store.data.products.map((p) => (p.id === productId ? (updated = { ...p, comments: [...(p.comments || []), c] }) : p));
    setData({ ...store.data, products });
    if (updated) pushProduct(updated);
  },
  deleteComment(productId, commentId) {
    let updated;
    const products = store.data.products.map((p) => (p.id === productId ? (updated = { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) }) : p));
    setData({ ...store.data, products });
    if (updated) pushProduct(updated);
  },

  /* -------- categorias -------- */
  addCategory(data) {
    const slug = slugify(data.slug || data.name);
    if (!slug || store.data.categories.some((c) => c.slug === slug)) return null;
    const cat = { slug, name: data.name || slug, short: data.short || data.name || slug, hue: Number(data.hue) || 40 };
    setData({ ...store.data, categories: [...store.data.categories, cat] });
    if (hasSupabase) supabase.from("categories").upsert({ ...cat, sort: store.data.categories.length }).then(({ error }) => error && console.error(error.message));
    return slug;
  },
  updateCategory(slug, patch) {
    let updated;
    const categories = store.data.categories.map((c) => (c.slug === slug ? (updated = { ...c, ...patch, hue: patch.hue != null ? Number(patch.hue) : c.hue }) : c));
    setData({ ...store.data, categories });
    if (updated && hasSupabase) supabase.from("categories").upsert(updated).then(({ error }) => error && console.error(error.message));
  },
  deleteCategory(slug) {
    if (store.data.products.some((p) => p.cat === slug)) return false;
    setData({ ...store.data, categories: store.data.categories.filter((c) => c.slug !== slug) });
    if (hasSupabase) supabase.from("categories").delete().eq("slug", slug).then(({ error }) => error && console.error(error.message));
    return true;
  },

  /* -------- aparência -------- */
  setHero(hero) {
    const d = { ...store.data, hero };
    setData(d);
    persistContent(d);
  },
  addHeroSlide() {
    const slide = { id: uid("h"), theme: "dark", kicker: "NOVIDADE", title: "NOVA CAPA", sub: "", ctaLabel: "VER MAIS", ctaCat: store.data.categories[0] ? store.data.categories[0].slug : "promocoes", image: "", hue: 42 };
    const d = { ...store.data, hero: [...store.data.hero, slide] };
    setData(d);
    persistContent(d);
  },
  updateHeroSlide(id, patch) {
    const d = { ...store.data, hero: store.data.hero.map((h) => (h.id === id ? { ...h, ...patch } : h)) };
    setData(d);
    persistContent(d);
  },
  removeHeroSlide(id) {
    const d = { ...store.data, hero: store.data.hero.filter((h) => h.id !== id) };
    setData(d);
    persistContent(d);
  },
  setBanner(patch) {
    const d = { ...store.data, banner: { ...store.data.banner, ...patch } };
    setData(d);
    persistContent(d);
  },
  setKitPromo(patch) {
    const d = { ...store.data, kitPromo: { ...store.data.kitPromo, ...patch } };
    setData(d);
    persistContent(d);
  },

  /* -------- configurações -------- */
  updateSettings(patch) {
    const d = { ...store.data, settings: { ...store.data.settings, ...patch } };
    setData(d);
    persistContent(d);
  },

  /* -------- dados -------- */
  resetAll() {
    if (!hasSupabase) setData(makeSeed());
  },
  exportAll() {
    return JSON.stringify(store.data, null, 2);
  },
  importAll(json) {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    if (!hasSupabase) setData(normalizeLocal(parsed));
  },
  reload,
};

/* ---------------- hooks ---------------- */
export function useData() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).data;
}
export function useStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const { data, ready, session } = snap;
  return useMemo(() => {
    const categories = data.categories;
    const allProducts = data.products.map((p) => decorateProduct(p, categories));
    const products = allProducts.filter((p) => p.active !== false);
    return {
      raw: data, settings: data.settings, categories,
      products, allProducts, kits: data.kits, reviews: data.reviews, blog: data.blog,
      hero: data.hero, banner: data.banner, kitPromo: data.kitPromo,
      ready, session, isAuthed: hasSupabase ? !!session : true, db,
    };
  }, [data, ready, session]);
}

/* ---------------- carrinho ---------------- */
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
  } catch {}
}
