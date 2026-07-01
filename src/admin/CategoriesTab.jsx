/* G2 IMPÉRIO — Admin: gestão de categorias */
import { useState } from "react";
import { slugify } from "../lib/format.js";

export function CategoriesTab({ store }) {
  const { categories, allProducts, db } = store;
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const countFor = (slug) => allProducts.filter((p) => p.cat === slug).length;

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Categorias</h1>
          <p>{categories.length} categorias · organize o catálogo da loja.</p>
        </div>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={() => setCreating(true)}>
            + Nova categoria
          </button>
        </div>
      </div>

      <div className="adm-hint">
        A cor (matiz) define o tom dos placeholders e destaques da categoria na loja. Uma categoria só pode ser excluída quando não houver produtos vinculados a ela.
      </div>

      <div className="adm-tablewrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Cor</th>
              <th>Nome</th>
              <th>Identificador (slug)</th>
              <th>Rótulo curto</th>
              <th>Produtos</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug}>
                <td>
                  <span style={{ display: "inline-block", width: 24, height: 24, borderRadius: 99, background: `hsl(${c.hue} 55% 55%)`, border: "1px solid var(--g2-border)" }} />
                </td>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>
                  <code style={{ fontSize: ".82rem", color: "var(--g2-muted)" }}>{c.slug}</code>
                </td>
                <td>{c.short}</td>
                <td>
                  <strong>{countFor(c.slug)}</strong>
                </td>
                <td>
                  <div className="adm-rowbtns">
                    <button className="adm-iconbtn" title="Editar" onClick={() => setEditing(c)}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      className="adm-iconbtn adm-iconbtn--del"
                      title="Excluir"
                      onClick={() => {
                        const n = countFor(c.slug);
                        if (n > 0) {
                          window.alert(`Não é possível excluir "${c.name}": há ${n} produto(s) nesta categoria. Mova-os antes de excluir.`);
                          return;
                        }
                        if (window.confirm(`Excluir a categoria "${c.name}"?`)) db.deleteCategory(c.slug);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && <CategoryForm category={editing} db={db} existing={categories} onClose={() => { setEditing(null); setCreating(false); }} />}
    </>
  );
}

function CategoryForm({ category, db, existing, onClose }) {
  const [name, setName] = useState(category ? category.name : "");
  const [short, setShort] = useState(category ? category.short : "");
  const [slug, setSlug] = useState(category ? category.slug : "");
  const [hue, setHue] = useState(category ? category.hue : 40);
  const isNew = !category;

  const save = () => {
    if (!name.trim()) {
      window.alert("Informe o nome da categoria.");
      return;
    }
    if (isNew) {
      const finalSlug = slugify(slug || name);
      if (existing.some((c) => c.slug === finalSlug)) {
        window.alert("Já existe uma categoria com esse identificador.");
        return;
      }
      db.addCategory({ name: name.trim(), short: short.trim() || name.trim(), slug: finalSlug, hue: Number(hue) });
    } else {
      db.updateCategory(category.slug, { name: name.trim(), short: short.trim() || name.trim(), hue: Number(hue) });
    }
    onClose();
  };

  return (
    <div className="adm-modal" onClick={onClose}>
      <div className="adm-modal__panel" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal__head">
          <h2>{isNew ? "Nova categoria" : "Editar categoria"}</h2>
          <button className="g2-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="adm-modal__body">
          <div className="adm-field">
            <label>Nome *</label>
            <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Óculos" />
          </div>
          <div className="adm-grid2">
            <div className="adm-field">
              <label>Rótulo curto</label>
              <input className="adm-input" value={short} onChange={(e) => setShort(e.target.value)} placeholder="Ex.: Óculos" />
            </div>
            <div className="adm-field">
              <label>Identificador (slug)</label>
              <input className="adm-input" value={isNew ? slug : category.slug} disabled={!isNew} onChange={(e) => setSlug(e.target.value)} placeholder="gerado do nome" />
              {isNew && <small>Deixe vazio para gerar automaticamente.</small>}
            </div>
          </div>
          <div className="adm-field">
            <label>Cor (matiz {hue}°)</label>
            <div className="adm-row">
              <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(Number(e.target.value))} style={{ flex: 1, accentColor: `hsl(${hue} 55% 50%)` }} />
              <span style={{ width: 34, height: 34, borderRadius: 99, background: `hsl(${hue} 55% 55%)`, border: "1px solid var(--g2-border)", flexShrink: 0 }} />
            </div>
          </div>
        </div>
        <div className="adm-modal__foot">
          <button className="g2-btn g2-btn--ghost g2-btn--sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={save}>
            {isNew ? "Criar categoria" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
