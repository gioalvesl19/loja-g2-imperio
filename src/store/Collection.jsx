/* G2 IMPÉRIO — página de coleção / categoria */
import { useState } from "react";
import { brl } from "../lib/format.js";
import { Btn, Placeholder, ProductCard } from "../components/primitives.jsx";

export function Collection({ cat, title, products, categories, onNav, onOpenProduct, onAdd, onWish, wishlist }) {
  const catMeta = categories.find((c) => c.slug === cat);
  const isPromo = cat === "promocoes";
  const base = isPromo ? products.filter((p) => p.badge === "promo" || p.oldPrice) : products.filter((p) => p.cat === cat);

  const [sort, setSort] = useState("rel");
  const [maxPrice, setMaxPrice] = useState(700);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  let list = base.filter((p) => p.price <= maxPrice);
  if (onlyPromo) list = list.filter((p) => p.badge === "promo" || p.oldPrice);
  if (onlyNew) list = list.filter((p) => p.badge === "new");
  if (inStock) list = list.filter((p) => (Number(p.stock) || 0) > 0);
  list = [...list].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "new") return (b.badge === "new") - (a.badge === "new");
    if (sort === "sold") return b.reviews - a.reviews;
    return 0;
  });

  const heroTitle = title || (isPromo ? "PROMOÇÕES" : catMeta ? catMeta.name.toUpperCase() : "COLEÇÃO");
  const heroSub = isPromo ? "Descontos imperiais de 15% a 30% em itens selecionados." : catMeta ? "A linha completa " + catMeta.name + " da G2 Império." : "";
  const hue = isPromo ? 24 : catMeta ? catMeta.hue : 42;

  const Filters = (
    <aside className="g2-filters">
      <div className="g2-filters__block">
        <h4>Ordenar por</h4>
        {[
          ["rel", "Relevância"],
          ["low", "Menor preço"],
          ["high", "Maior preço"],
          ["new", "Lançamentos"],
          ["sold", "Mais vendidos"],
        ].map(([v, l]) => (
          <label key={v} className="g2-radio">
            <input type="radio" name="sort" checked={sort === v} onChange={() => setSort(v)} />
            <span>{l}</span>
          </label>
        ))}
      </div>
      <div className="g2-filters__block">
        <h4>Faixa de preço</h4>
        <input type="range" className="g2-range" min="30" max="700" step="10" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
        <div className="g2-filters__pricelbl">
          Até <strong>{brl(maxPrice)}</strong>
        </div>
      </div>
      <div className="g2-filters__block">
        <h4>Disponibilidade</h4>
        <label className="g2-check">
          <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} />
          <span>Em promoção</span>
        </label>
        <label className="g2-check">
          <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />
          <span>Lançamentos</span>
        </label>
        <label className="g2-check">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          <span>Somente em estoque</span>
        </label>
      </div>
      <div className="g2-filters__block">
        <h4>Cor</h4>
        <div className="g2-filters__swatches">
          {["#111", "#C9A84C", "#b32a2a", "#2a4bb3", "#2e4d3a", "#d98aa0", "#cbb89a", "#eee"].map((c) => (
            <span key={c} className="g2-swatch" style={{ background: c }} title={c} />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <main className="g2-coll">
      <div className="g2-coll__hero">
        <Placeholder label={(catMeta ? catMeta.short.toLowerCase() : "promoções") + " — banner"} hue={hue} ratio="auto" light={24} sat={16} style={{ position: "absolute", inset: 0 }} />
        <div className="g2-coll__hero-in">
          <nav className="g2-crumb">
            <a
              onClick={(e) => {
                e.preventDefault();
                onNav({ view: "home" });
              }}
              href="#"
            >
              Início
            </a>{" "}
            / <span>{heroTitle}</span>
          </nav>
          <h1 className="g2-coll__title">{heroTitle}</h1>
          <p>{heroSub}</p>
        </div>
      </div>

      <div className="g2-coll__body">
        <div className="g2-coll__sidebar">{Filters}</div>

        <div className="g2-coll__main">
          <div className="g2-coll__bar">
            <button className="g2-coll__filterbtn" onClick={() => setFiltersOpen(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5h18M6 12h12M10 19h4" />
              </svg>{" "}
              Filtros
            </button>
            <span className="g2-coll__count">{list.length} produtos</span>
            <select className="g2-coll__sortsel" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rel">Relevância</option>
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
              <option value="new">Lançamentos</option>
              <option value="sold">Mais vendidos</option>
            </select>
          </div>
          {list.length === 0 ? (
            <div className="g2-coll__empty">Nenhum produto encontrado com esses filtros.</div>
          ) : (
            <div className="g2-grid">
              {list.map((p) => (
                <ProductCard key={p.id} p={p} onOpen={onOpenProduct} onAdd={onAdd} onWish={onWish} wished={wishlist.has(p.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="g2-overlay is-open" onClick={() => setFiltersOpen(false)}>
          <div className="g2-filterdrawer" onClick={(e) => e.stopPropagation()}>
            <div className="g2-drawer__head">
              <h3>FILTROS</h3>
              <button className="g2-x" onClick={() => setFiltersOpen(false)}>
                ✕
              </button>
            </div>
            <div className="g2-filterdrawer__body">{Filters}</div>
            <div className="g2-drawer__foot">
              <Btn variant="dark" full onClick={() => setFiltersOpen(false)}>
                VER {list.length} PRODUTOS
              </Btn>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
