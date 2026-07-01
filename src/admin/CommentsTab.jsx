/* G2 IMPÉRIO — Admin: avaliações / comentários de todos os produtos */
import { useState } from "react";

export function CommentsTab({ store }) {
  const { allProducts, db } = store;
  const withComments = allProducts.filter((p) => (p.comments || []).length > 0);
  const total = allProducts.reduce((s, p) => s + (p.comments || []).length, 0);

  const [pid, setPid] = useState(allProducts[0] ? allProducts[0].id : "");
  const [name, setName] = useState("");
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  const add = () => {
    if (!pid || !text.trim()) {
      window.alert("Selecione um produto e escreva o comentário.");
      return;
    }
    db.addComment(pid, { name: name.trim() || "Cliente G2", stars: Number(stars), text: text.trim() });
    setName("");
    setText("");
    setStars(5);
  };

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Avaliações</h1>
          <p>{total} comentários em {withComments.length} produto(s).</p>
        </div>
      </div>

      <div className="adm-card">
        <h2>Adicionar avaliação</h2>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Produto</label>
            <select className="adm-select" value={pid} onChange={(e) => setPid(e.target.value)}>
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-grid2">
            <div className="adm-field">
              <label>Cliente</label>
              <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: João P." />
            </div>
            <div className="adm-field">
              <label>Nota</label>
              <select className="adm-select" value={stars} onChange={(e) => setStars(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {"★".repeat(n)} ({n})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="adm-field">
          <label>Comentário</label>
          <textarea className="adm-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva a avaliação do cliente…" />
        </div>
        <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={add}>
          + Publicar avaliação
        </button>
      </div>

      {withComments.length === 0 ? (
        <div className="adm-card">
          <div className="adm-empty">Ainda não há avaliações. Use o formulário acima para adicionar a primeira.</div>
        </div>
      ) : (
        withComments.map((p) => (
          <div className="adm-card" key={p.id}>
            <h2>
              {p.name} <span style={{ fontWeight: 400, color: "var(--g2-muted)", fontSize: ".85rem" }}>· {(p.comments || []).length} avaliações</span>
            </h2>
            {(p.comments || []).map((c) => (
              <div className="adm-reviewitem" key={c.id}>
                <div>
                  <strong>{c.name}</strong> · {"★".repeat(c.stars)}
                  <em style={{ marginLeft: ".4rem" }}>{c.date}</em>
                  <p>"{c.text}"</p>
                </div>
                <button
                  className="adm-iconbtn adm-iconbtn--del"
                  title="Excluir comentário"
                  onClick={() => {
                    if (window.confirm("Excluir este comentário?")) db.deleteComment(p.id, c.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
}
