/* G2 IMPÉRIO — Admin: painel/dashboard */
import { brl } from "../lib/format.js";

export function Dashboard({ store, onGo }) {
  const prods = store.allProducts;
  const active = prods.filter((p) => p.active !== false);
  const out = prods.filter((p) => (Number(p.stock) || 0) <= 0);
  const low = prods.filter((p) => {
    const s = Number(p.stock) || 0;
    return s > 0 && s <= 5;
  });
  const stockValue = prods.reduce((s, p) => s + p.price * (Number(p.stock) || 0), 0);
  const units = prods.reduce((s, p) => s + (Number(p.stock) || 0), 0);
  const commentsCount = prods.reduce((s, p) => s + (p.comments ? p.comments.length : 0), 0);
  const lowList = [...low, ...out].sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0));

  const stats = [
    { label: "Produtos", value: prods.length, sub: `${active.length} ativos` },
    { label: "Categorias", value: store.categories.length },
    { label: "Unidades em estoque", value: units, sub: brl(stockValue) + " em valor", gold: true },
    { label: "Esgotados", value: out.length, warn: out.length > 0 },
    { label: "Últimas unidades", value: low.length },
    { label: "Avaliações", value: commentsCount, sub: "comentários publicados" },
  ];

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Painel</h1>
          <p>Visão geral da loja {store.settings.storeName}.</p>
        </div>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={() => onGo("prod")}>
            + Gerenciar produtos
          </button>
        </div>
      </div>

      <div className="adm-stats">
        {stats.map((s) => (
          <div key={s.label} className={"adm-stat" + (s.gold ? " adm-stat--gold" : "") + (s.warn ? " adm-stat--warn" : "")}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
            {s.sub && <em>{s.sub}</em>}
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h2>Reposição de estoque</h2>
        {lowList.length === 0 ? (
          <div className="adm-empty">Tudo certo! Nenhum produto com estoque baixo. 🎉</div>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {lowList.map((p) => {
                  const s = Number(p.stock) || 0;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="adm-prodcell">
                          <div className="adm-thumb" style={{ background: `hsl(${p.hue} 30% 88%)` }}>
                            {p.image ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                          </div>
                          <div>
                            <strong>{p.name}</strong>
                            <em>{brl(p.price)}</em>
                          </div>
                        </div>
                      </td>
                      <td>{p.catName}</td>
                      <td>
                        <strong>{s}</strong>
                      </td>
                      <td>{s <= 0 ? <span className="adm-tag adm-tag--out">Esgotado</span> : <span className="adm-tag adm-tag--low">Últimas {s}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
