/* G2 IMPÉRIO — Admin: gestão de produtos (CRUD completo) */
import { useState, useMemo } from "react";
import { brl, discountPct } from "../lib/format.js";

/* ============ Aba de produtos ============ */
export function ProductsTab({ store }) {
  const { allProducts, categories, db } = store;
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState(null); // produto em edição
  const [creating, setCreating] = useState(false);

  const list = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (catFilter !== "all" && p.cat !== catFilter) return false;
      const stock = Number(p.stock) || 0;
      if (statusFilter === "active" && p.active === false) return false;
      if (statusFilter === "inactive" && p.active !== false) return false;
      if (statusFilter === "out" && stock > 0) return false;
      if (statusFilter === "low" && !(stock > 0 && stock <= 5)) return false;
      if (nq && !p.name.toLowerCase().includes(nq)) return false;
      return true;
    });
  }, [allProducts, q, catFilter, statusFilter]);

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Produtos</h1>
          <p>{allProducts.length} produtos no catálogo · {list.length} exibidos</p>
        </div>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={() => setCreating(true)}>
            + Novo produto
          </button>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input placeholder="Buscar produto pelo nome…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="adm-select" style={{ width: "auto" }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="adm-select" style={{ width: "auto" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="low">Últimas unidades</option>
          <option value="out">Esgotados</option>
        </select>
      </div>

      <div className="adm-tablewrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="adm-empty">Nenhum produto encontrado com esses filtros.</div>
                </td>
              </tr>
            )}
            {list.map((p) => {
              const stock = Number(p.stock) || 0;
              const off = discountPct(p.price, p.oldPrice);
              return (
                <tr key={p.id}>
                  <td>
                    <div className="adm-prodcell">
                      <div className="adm-thumb" style={{ background: `hsl(${p.hue} 30% 88%)` }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                      </div>
                      <div>
                        <strong>{p.name}</strong>
                        <em>{(p.colors || []).length} cor(es) · {(p.comments || []).length} avaliações</em>
                      </div>
                    </div>
                  </td>
                  <td>{p.catName}</td>
                  <td>
                    <strong>{brl(p.price)}</strong>
                    {p.oldPrice ? (
                      <div>
                        <s style={{ fontSize: ".78rem" }}>{brl(p.oldPrice)}</s> {off > 0 && <span className="adm-tag adm-tag--promo">-{off}%</span>}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <strong>{stock}</strong>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem" }}>
                      {p.active === false ? <span className="adm-tag adm-tag--off">Inativo</span> : <span className="adm-tag adm-tag--on">Ativo</span>}
                      {stock <= 0 && <span className="adm-tag adm-tag--out">Esgotado</span>}
                      {stock > 0 && stock <= 5 && <span className="adm-tag adm-tag--low">Últimas {stock}</span>}
                      {p.badge === "promo" && <span className="adm-tag adm-tag--promo">Promoção</span>}
                      {p.badge === "new" && <span className="adm-tag adm-tag--new">Lançamento</span>}
                    </div>
                  </td>
                  <td>
                    <div className="adm-rowbtns">
                      <button className="adm-iconbtn" title="Editar" onClick={() => setEditing(p)}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                      <button className="adm-iconbtn" title={p.active === false ? "Ativar" : "Desativar"} onClick={() => db.setProductActive(p.id, p.active === false)}>
                        {p.active === false ? (
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.9 17.9A10.4 10.4 0 0112 20C5 20 1 12 1 12a19 19 0 015.1-6M9.9 4.2A10.4 10.4 0 0112 4c7 0 11 8 11 8a19 19 0 01-2.2 3.2M1 1l22 22" />
                          </svg>
                        )}
                      </button>
                      <button className="adm-iconbtn" title="Duplicar" onClick={() => db.duplicateProduct(p.id)}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="11" height="11" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      </button>
                      <button
                        className="adm-iconbtn adm-iconbtn--del"
                        title="Excluir"
                        onClick={() => {
                          if (window.confirm(`Excluir "${p.name}"? Esta ação não pode ser desfeita.`)) db.deleteProduct(p.id);
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductForm
          product={editing}
          categories={categories}
          db={db}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </>
  );
}

/* ============ Formulário do produto ============ */
function emptyForm(categories) {
  return {
    name: "",
    cat: categories[0] ? categories[0].slug : "",
    desc: "",
    price: "",
    oldPrice: "",
    stock: "0",
    badge: "",
    image: "",
    active: true,
    rating: "4.8",
    reviews: "0",
    colors: [],
    specs: [],
    comments: [],
  };
}

function ProductForm({ product, categories, db, onClose }) {
  const [f, setF] = useState(() => {
    if (!product) return emptyForm(categories);
    return {
      name: product.name || "",
      cat: product.cat || (categories[0] ? categories[0].slug : ""),
      desc: product.desc || "",
      price: String(product.price ?? ""),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      stock: String(product.stock ?? 0),
      badge: product.badge || "",
      image: product.image || "",
      active: product.active !== false,
      rating: String(product.rating ?? "4.8"),
      reviews: String(product.reviews ?? 0),
      colors: (product.colors || []).map(([name, hex]) => ({ name, hex })),
      specs: [...(product.specs || [])],
      comments: [...(product.comments || [])],
    };
  });

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const off = discountPct(Number(f.price) || 0, Number(f.oldPrice) || 0);

  // cores
  const [cName, setCName] = useState("");
  const [cHex, setCHex] = useState("#111111");
  const addColor = () => {
    const name = cName.trim() || "Cor";
    set("colors", [...f.colors, { name, hex: cHex }]);
    setCName("");
  };
  const rmColor = (i) => set("colors", f.colors.filter((_, idx) => idx !== i));

  // especificações / legendas
  const [spec, setSpec] = useState("");
  const addSpec = () => {
    const s = spec.trim();
    if (!s) return;
    set("specs", [...f.specs, s]);
    setSpec("");
  };
  const rmSpec = (i) => set("specs", f.specs.filter((_, idx) => idx !== i));

  // comentários
  const [cm, setCm] = useState({ name: "", stars: 5, text: "" });
  const addComment = () => {
    if (!cm.text.trim()) return;
    const c = {
      id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      name: cm.name.trim() || "Cliente G2",
      stars: Number(cm.stars) || 5,
      text: cm.text.trim(),
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
    };
    set("comments", [...f.comments, c]);
    setCm({ name: "", stars: 5, text: "" });
  };
  const rmComment = (id) => set("comments", f.comments.filter((c) => c.id !== id));

  const save = () => {
    if (!f.name.trim()) {
      window.alert("Informe o nome do produto.");
      return;
    }
    const payload = {
      name: f.name.trim(),
      cat: f.cat,
      desc: f.desc.trim(),
      price: Number(f.price) || 0,
      oldPrice: f.oldPrice ? Number(f.oldPrice) : null,
      stock: Number(f.stock) || 0,
      badge: f.badge || null,
      image: f.image.trim(),
      active: f.active,
      rating: Number(f.rating) || 0,
      reviews: Number(f.reviews) || 0,
      colors: f.colors.map((c) => [c.name, c.hex]),
      specs: f.specs,
      comments: f.comments,
    };
    if (product) db.updateProduct(product.id, payload);
    else db.addProduct(payload);
    onClose();
  };

  return (
    <div className="adm-modal" onClick={onClose}>
      <div className="adm-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal__head">
          <h2>{product ? "Editar produto" : "Novo produto"}</h2>
          <button className="g2-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="adm-modal__body">
          {/* Dados básicos */}
          <fieldset className="adm-fieldset">
            <legend>Dados básicos</legend>
            <div className="adm-field">
              <label>Nome do produto *</label>
              <input className="adm-input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex.: Óculos G2 Aviador Gold" />
            </div>
            <div className="adm-grid2">
              <div className="adm-field">
                <label>Categoria</label>
                <select className="adm-select" value={f.cat} onChange={(e) => set("cat", e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label>Selo / destaque</label>
                <select className="adm-select" value={f.badge} onChange={(e) => set("badge", e.target.value)}>
                  <option value="">Nenhum</option>
                  <option value="promo">Promoção</option>
                  <option value="new">Lançamento</option>
                </select>
              </div>
            </div>
            <div className="adm-field">
              <label>Descrição / legenda</label>
              <textarea className="adm-textarea" value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Descreva o produto (aparece na página do produto)." />
            </div>
            <label className="adm-switch">
              <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} />
              <i />
              {f.active ? "Ativo (visível na loja)" : "Inativo (oculto na loja)"}
            </label>
          </fieldset>

          {/* Preço e estoque */}
          <fieldset className="adm-fieldset">
            <legend>Preço, desconto e estoque</legend>
            <div className="adm-grid3">
              <div className="adm-field">
                <label>Preço (R$) *</label>
                <input className="adm-input" type="number" min="0" step="0.01" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="0,00" />
              </div>
              <div className="adm-field">
                <label>Preço "De" (opcional)</label>
                <input className="adm-input" type="number" min="0" step="0.01" value={f.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} placeholder="preço cheio" />
                <small>{off > 0 ? `Desconto de ${off}% aplicado.` : "Preço antes do desconto."}</small>
              </div>
              <div className="adm-field">
                <label>Estoque (unidades)</label>
                <input className="adm-input" type="number" min="0" step="1" value={f.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
                <small>0 = esgotado · 1 a 5 = "últimas unidades".</small>
              </div>
            </div>
          </fieldset>

          {/* Imagem e avaliações */}
          <fieldset className="adm-fieldset">
            <legend>Imagem e avaliação</legend>
            <div className="adm-field">
              <label>URL da imagem (opcional)</label>
              <input className="adm-input" value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="https://… (deixe vazio para usar o placeholder)" />
              {f.image ? (
                <div style={{ marginTop: ".5rem", width: 90, height: 90, borderRadius: 8, overflow: "hidden", border: "1px solid var(--g2-border)" }}>
                  <img src={f.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.opacity = ".2")} />
                </div>
              ) : null}
            </div>
            <div className="adm-grid2">
              <div className="adm-field">
                <label>Nota média (0 a 5)</label>
                <input className="adm-input" type="number" min="0" max="5" step="0.1" value={f.rating} onChange={(e) => set("rating", e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Nº de avaliações</label>
                <input className="adm-input" type="number" min="0" step="1" value={f.reviews} onChange={(e) => set("reviews", e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Cores */}
          <fieldset className="adm-fieldset">
            <legend>Cores disponíveis</legend>
            <div className="adm-chips">
              {f.colors.length === 0 && <small style={{ color: "var(--g2-muted)" }}>Nenhuma cor adicionada.</small>}
              {f.colors.map((c, i) => (
                <span className="adm-chip" key={i}>
                  <span className="adm-chip__sw" style={{ background: c.hex }} />
                  {c.name}
                  <button onClick={() => rmColor(i)} aria-label="Remover cor">
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="adm-addrow">
              <input className="adm-input" style={{ flex: 1, minWidth: 140 }} placeholder="Nome da cor (ex.: Preto)" value={cName} onChange={(e) => setCName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} />
              <input type="color" value={cHex} onChange={(e) => setCHex(e.target.value)} />
              <button className="g2-btn g2-btn--ghost g2-btn--sm" onClick={addColor} type="button">
                + Cor
              </button>
            </div>
          </fieldset>

          {/* Especificações / legendas */}
          <fieldset className="adm-fieldset">
            <legend>Especificações / legendas (tags)</legend>
            <div className="adm-chips">
              {f.specs.length === 0 && <small style={{ color: "var(--g2-muted)" }}>Nenhuma legenda adicionada.</small>}
              {f.specs.map((s, i) => (
                <span className="adm-chip adm-chip--spec" key={i}>
                  {s}
                  <button onClick={() => rmSpec(i)} aria-label="Remover">
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="adm-addrow">
              <input className="adm-input" style={{ flex: 1, minWidth: 140 }} placeholder="Ex.: UV400, Impermeável, 500ml…" value={spec} onChange={(e) => setSpec(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())} />
              <button className="g2-btn g2-btn--ghost g2-btn--sm" onClick={addSpec} type="button">
                + Legenda
              </button>
            </div>
          </fieldset>

          {/* Comentários */}
          <fieldset className="adm-fieldset">
            <legend>Comentários / avaliações de clientes</legend>
            {f.comments.length === 0 && <small style={{ color: "var(--g2-muted)" }}>Nenhum comentário ainda.</small>}
            {f.comments.map((c) => (
              <div className="adm-reviewitem" key={c.id}>
                <div>
                  <strong>{c.name}</strong> · {"★".repeat(c.stars)}
                  <em style={{ marginLeft: ".4rem" }}>{c.date}</em>
                  <p>"{c.text}"</p>
                </div>
                <button className="adm-iconbtn adm-iconbtn--del" onClick={() => rmComment(c.id)} title="Remover">
                  ✕
                </button>
              </div>
            ))}
            <div className="adm-grid2" style={{ marginTop: ".8rem" }}>
              <div className="adm-field" style={{ margin: 0 }}>
                <label>Nome do cliente</label>
                <input className="adm-input" value={cm.name} onChange={(e) => setCm({ ...cm, name: e.target.value })} placeholder="Ex.: Maria S." />
              </div>
              <div className="adm-field" style={{ margin: 0 }}>
                <label>Nota</label>
                <select className="adm-select" value={cm.stars} onChange={(e) => setCm({ ...cm, stars: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {"★".repeat(n)} ({n})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="adm-field" style={{ marginTop: ".8rem", marginBottom: 0 }}>
              <label>Comentário</label>
              <textarea className="adm-textarea" style={{ minHeight: 60 }} value={cm.text} onChange={(e) => setCm({ ...cm, text: e.target.value })} placeholder="O que o cliente achou do produto…" />
            </div>
            <div style={{ marginTop: ".7rem" }}>
              <button className="g2-btn g2-btn--ghost g2-btn--sm" type="button" onClick={addComment}>
                + Adicionar comentário
              </button>
            </div>
          </fieldset>
        </div>
        <div className="adm-modal__foot">
          <button className="g2-btn g2-btn--ghost g2-btn--sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={save}>
            {product ? "Salvar alterações" : "Criar produto"}
          </button>
        </div>
      </div>
    </div>
  );
}
