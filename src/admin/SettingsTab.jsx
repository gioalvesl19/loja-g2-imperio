/* G2 IMPÉRIO — Admin: configurações da loja + backup dos dados */
import { useState, useRef } from "react";

export function SettingsTab({ store }) {
  const { settings, db } = store;
  const [f, setF] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => {
    setF((s) => ({ ...s, [k]: v }));
    setSaved(false);
  };

  const save = () => {
    db.updateSettings({
      ...f,
      freeShip: Number(f.freeShip) || 0,
      cashbackPct: Number(f.cashbackPct) || 0,
      pixDiscountPct: Number(f.pixDiscountPct) || 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const exportJson = () => {
    const blob = new Blob([db.exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "g2-imperio-dados.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        db.importAll(String(reader.result));
        window.alert("Dados importados com sucesso!");
      } catch (err) {
        window.alert("Arquivo inválido: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Configurações</h1>
          <p>Dados de contato, regras comerciais e backup da loja.</p>
        </div>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={save}>
            {saved ? "✓ Salvo!" : "Salvar alterações"}
          </button>
        </div>
      </div>

      <div className="adm-card">
        <h2>Identidade & contato</h2>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Nome da loja</label>
            <input className="adm-input" value={f.storeName} onChange={(e) => set("storeName", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Instagram (URL)</label>
            <input className="adm-input" value={f.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://www.instagram.com/g2_imperio/" />
          </div>
        </div>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>WhatsApp 1 — números (55 + DDD + número)</label>
            <input className="adm-input" value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="5562992175676" />
            <small>Recebe os pedidos do checkout e dos botões.</small>
          </div>
          <div className="adm-field">
            <label>WhatsApp 1 — exibição</label>
            <input className="adm-input" value={f.whatsappDisplay} onChange={(e) => set("whatsappDisplay", e.target.value)} placeholder="(62) 99217-5676" />
          </div>
        </div>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>WhatsApp 2 — números (opcional)</label>
            <input className="adm-input" value={f.whatsapp2} onChange={(e) => set("whatsapp2", e.target.value.replace(/\D/g, ""))} placeholder="5562992120122" />
          </div>
          <div className="adm-field">
            <label>WhatsApp 2 — exibição</label>
            <input className="adm-input" value={f.whatsapp2Display} onChange={(e) => set("whatsapp2Display", e.target.value)} placeholder="(62) 99212-0122" />
          </div>
        </div>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Endereço da loja</label>
            <textarea className="adm-textarea" style={{ minHeight: 80 }} value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Rua..., Bairro, Cidade - UF, CEP" />
            <small>Uma linha por parte do endereço.</small>
          </div>
          <div className="adm-field">
            <label>Link do mapa</label>
            <input className="adm-input" value={f.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://maps.apple.com/..." />
          </div>
        </div>
      </div>

      <div className="adm-card">
        <h2>Regras comerciais</h2>
        <div className="adm-grid3">
          <div className="adm-field">
            <label>Frete grátis a partir de (R$)</label>
            <input className="adm-input" type="number" min="0" step="1" value={f.freeShip} onChange={(e) => set("freeShip", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Cashback (%)</label>
            <input className="adm-input" type="number" min="0" max="100" step="1" value={f.cashbackPct} onChange={(e) => set("cashbackPct", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Desconto no Pix (%)</label>
            <input className="adm-input" type="number" min="0" max="100" step="1" value={f.pixDiscountPct} onChange={(e) => set("pixDiscountPct", e.target.value)} />
          </div>
        </div>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Cupom de destaque</label>
            <input className="adm-input" value={f.coupon} onChange={(e) => set("coupon", e.target.value.toUpperCase())} />
          </div>
        </div>
        <div className="adm-field">
          <label>Texto da barra de anúncio</label>
          <input className="adm-input" value={f.announcement} onChange={(e) => set("announcement", e.target.value)} />
        </div>
      </div>

      <div className="adm-card">
        <h2>Segurança do painel</h2>
        <div className="adm-field" style={{ maxWidth: 340 }}>
          <label>Senha do administrador</label>
          <input className="adm-input" value={f.adminPassword} onChange={(e) => set("adminPassword", e.target.value)} />
          <small>Proteção local do painel /admin. Lembre-se de clicar em "Salvar alterações".</small>
        </div>
        <div className="adm-note">
          ⚠️ Esta senha protege o painel apenas no navegador (não é uma autenticação de servidor). Quando o backend (Supabase) for conectado, a autenticação passará a ser feita lá.
        </div>
      </div>

      <div className="adm-card">
        <h2>Backup & dados</h2>
        <p style={{ color: "var(--g2-muted)", fontSize: ".9rem", marginTop: 0 }}>
          Todo o catálogo é salvo no seu navegador (localStorage). Exporte um arquivo JSON para fazer backup ou para migrar os dados para o Supabase futuramente.
        </p>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--dark g2-btn--sm" onClick={exportJson}>
            ⬇ Exportar dados (JSON)
          </button>
          <button className="g2-btn g2-btn--ghost g2-btn--sm" onClick={() => fileRef.current && fileRef.current.click()}>
            ⬆ Importar dados (JSON)
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={importFile} />
          <button
            className="g2-btn g2-btn--ghost g2-btn--sm"
            style={{ color: "#b32a2a", borderColor: "#e6b3b3" }}
            onClick={() => {
              if (window.confirm("Restaurar o catálogo inicial? Todas as suas alterações serão perdidas.")) db.resetAll();
            }}
          >
            ↺ Restaurar catálogo inicial
          </button>
        </div>
      </div>
    </>
  );
}
