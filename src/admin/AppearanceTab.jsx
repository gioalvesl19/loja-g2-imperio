/* G2 IMPÉRIO — Admin: aparência da loja (barra de anúncio, capas, banner, kit) */
import { ImageUpload } from "./ImageUpload.jsx";

function CatSelect({ categories, value, onChange }) {
  return (
    <select className="adm-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="promocoes">Promoções (todas as ofertas)</option>
      {categories.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

function ThemeSelect({ value, onChange }) {
  return (
    <select className="adm-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="dark">Escuro</option>
      <option value="gold">Dourado</option>
      <option value="light">Claro</option>
    </select>
  );
}

export function AppearanceTab({ store }) {
  const { hero, banner, kitPromo, categories, settings, db } = store;

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Aparência</h1>
          <p>Personalize a barra de anúncio, as capas do carrossel, o banner e a chamada de kit. As mudanças aparecem na hora na loja.</p>
        </div>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={() => db.addHeroSlide()}>
            + Nova capa
          </button>
        </div>
      </div>

      <div className="adm-hint">
        💡 As imagens são enviadas por <b>anexo (arquivo do seu dispositivo)</b> e ficam salvas no navegador. Deixe a imagem vazia para usar o fundo padrão (listrado).
      </div>

      {/* Barra de anúncio */}
      <div className="adm-card">
        <h2>Barra de anúncio (topo do site)</h2>
        <label className="adm-switch" style={{ marginBottom: "1rem" }}>
          <input type="checkbox" checked={settings.announcementEnabled !== false} onChange={(e) => db.updateSettings({ announcementEnabled: e.target.checked })} />
          <i />
          {settings.announcementEnabled !== false ? "Exibindo a barra" : "Barra oculta"}
        </label>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Texto da barra</label>
            <input className="adm-input" value={settings.announcement || ""} onChange={(e) => db.updateSettings({ announcement: e.target.value })} placeholder="FRETE GRÁTIS acima de R$ 299 · Cupom:" />
          </div>
          <div className="adm-field">
            <label>Cupom (botão copiável)</label>
            <input className="adm-input" value={settings.coupon || ""} onChange={(e) => db.updateSettings({ coupon: e.target.value.toUpperCase() })} placeholder="G2IMPERIO10 (vazio = sem cupom)" />
          </div>
        </div>
      </div>

      {/* Capas */}
      <div className="adm-card">
        <h2>Capas do carrossel principal ({hero.length})</h2>
        {hero.length === 0 && <div className="adm-empty">Nenhuma capa. Clique em "Nova capa".</div>}
        {hero.map((s, i) => (
          <fieldset className="adm-fieldset" key={s.id}>
            <legend>Capa {i + 1}</legend>
            <div className="adm-grid2">
              <div className="adm-field">
                <label>Texto pequeno (kicker)</label>
                <input className="adm-input" value={s.kicker} onChange={(e) => db.updateHeroSlide(s.id, { kicker: e.target.value })} />
              </div>
              <div className="adm-field">
                <label>Botão (texto)</label>
                <input className="adm-input" value={s.ctaLabel} onChange={(e) => db.updateHeroSlide(s.id, { ctaLabel: e.target.value })} />
              </div>
            </div>
            <div className="adm-field">
              <label>Título</label>
              <input className="adm-input" value={s.title} onChange={(e) => db.updateHeroSlide(s.id, { title: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Subtítulo</label>
              <input className="adm-input" value={s.sub} onChange={(e) => db.updateHeroSlide(s.id, { sub: e.target.value })} />
            </div>
            <div className="adm-grid2">
              <div className="adm-field">
                <label>Leva para</label>
                <CatSelect categories={categories} value={s.ctaCat} onChange={(v) => db.updateHeroSlide(s.id, { ctaCat: v })} />
              </div>
              <div className="adm-field">
                <label>Tema</label>
                <ThemeSelect value={s.theme} onChange={(v) => db.updateHeroSlide(s.id, { theme: v })} />
              </div>
            </div>
            <div className="adm-field">
              <label>Imagem da capa</label>
              <ImageUpload value={s.image} onChange={(v) => db.updateHeroSlide(s.id, { image: v })} aspect="16 / 9" />
            </div>
            <div>
              <button className="g2-btn g2-btn--ghost g2-btn--sm" style={{ color: "#b32a2a", borderColor: "#e6b3b3" }} onClick={() => { if (window.confirm("Remover esta capa?")) db.removeHeroSlide(s.id); }}>
                Remover capa
              </button>
            </div>
          </fieldset>
        ))}
      </div>

      {/* Banner */}
      <div className="adm-card">
        <h2>Banner promocional (meio da página)</h2>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Texto pequeno (kicker)</label>
            <input className="adm-input" value={banner.kicker} onChange={(e) => db.setBanner({ kicker: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Botão (texto)</label>
            <input className="adm-input" value={banner.ctaLabel} onChange={(e) => db.setBanner({ ctaLabel: e.target.value })} />
          </div>
        </div>
        <div className="adm-field">
          <label>Título</label>
          <input className="adm-input" value={banner.title} onChange={(e) => db.setBanner({ title: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Subtítulo</label>
          <input className="adm-input" value={banner.sub} onChange={(e) => db.setBanner({ sub: e.target.value })} />
        </div>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Leva para</label>
            <CatSelect categories={categories} value={banner.cat} onChange={(v) => db.setBanner({ cat: v })} />
          </div>
          <div className="adm-field">
            <label>Tema</label>
            <ThemeSelect value={banner.theme} onChange={(v) => db.setBanner({ theme: v })} />
          </div>
        </div>
        <div className="adm-field">
          <label>Imagem do banner</label>
          <ImageUpload value={banner.image} onChange={(v) => db.setBanner({ image: v })} aspect="16 / 7" />
        </div>
      </div>

      {/* Kit promo */}
      <div className="adm-card">
        <h2>Chamada do "Monte seu kit"</h2>
        <div className="adm-grid2">
          <div className="adm-field">
            <label>Texto pequeno (kicker)</label>
            <input className="adm-input" value={kitPromo.kicker} onChange={(e) => db.setKitPromo({ kicker: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Botão (texto)</label>
            <input className="adm-input" value={kitPromo.ctaLabel} onChange={(e) => db.setKitPromo({ ctaLabel: e.target.value })} />
          </div>
        </div>
        <div className="adm-field">
          <label>Título</label>
          <input className="adm-input" value={kitPromo.title} onChange={(e) => db.setKitPromo({ title: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Subtítulo</label>
          <textarea className="adm-textarea" style={{ minHeight: 70 }} value={kitPromo.sub} onChange={(e) => db.setKitPromo({ sub: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Imagem da chamada</label>
          <ImageUpload value={kitPromo.image} onChange={(v) => db.setKitPromo({ image: v })} aspect="16 / 7" />
        </div>
      </div>
    </>
  );
}
