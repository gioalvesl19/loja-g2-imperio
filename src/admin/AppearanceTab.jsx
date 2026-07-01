/* G2 IMPÉRIO — Admin: aparência da loja (capas, banner, kit) */

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

function ImagePreview({ url }) {
  if (!url) return null;
  return (
    <div style={{ marginTop: ".5rem", width: "100%", maxWidth: 260, aspectRatio: "16/7", borderRadius: 8, overflow: "hidden", border: "1px solid var(--g2-border)", background: "var(--g2-surface)" }}>
      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.opacity = ".2")} />
    </div>
  );
}

export function AppearanceTab({ store }) {
  const { hero, banner, kitPromo, categories, db } = store;

  return (
    <>
      <div className="adm-topbar">
        <div>
          <h1>Aparência</h1>
          <p>Personalize as capas do carrossel, o banner promocional e a chamada de kit. As mudanças aparecem na hora na loja.</p>
        </div>
        <div className="adm-actions">
          <button className="g2-btn g2-btn--gold g2-btn--sm" onClick={() => db.addHeroSlide()}>
            + Nova capa
          </button>
        </div>
      </div>

      <div className="adm-hint">
        💡 Deixe o campo de imagem vazio para usar o fundo padrão (listrado). Cole a URL de uma foto (ex.: link direto de uma imagem) para usar suas próprias fotos nas capas, banners e produtos.
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
            <div className="adm-grid3">
              <div className="adm-field">
                <label>Leva para</label>
                <CatSelect categories={categories} value={s.ctaCat} onChange={(v) => db.updateHeroSlide(s.id, { ctaCat: v })} />
              </div>
              <div className="adm-field">
                <label>Tema</label>
                <ThemeSelect value={s.theme} onChange={(v) => db.updateHeroSlide(s.id, { theme: v })} />
              </div>
              <div className="adm-field">
                <label>Imagem (URL)</label>
                <input className="adm-input" value={s.image} onChange={(e) => db.updateHeroSlide(s.id, { image: e.target.value })} placeholder="https://…" />
              </div>
            </div>
            <ImagePreview url={s.image} />
            <div style={{ marginTop: ".8rem" }}>
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
        <div className="adm-grid3">
          <div className="adm-field">
            <label>Leva para</label>
            <CatSelect categories={categories} value={banner.cat} onChange={(v) => db.setBanner({ cat: v })} />
          </div>
          <div className="adm-field">
            <label>Tema</label>
            <ThemeSelect value={banner.theme} onChange={(v) => db.setBanner({ theme: v })} />
          </div>
          <div className="adm-field">
            <label>Imagem (URL)</label>
            <input className="adm-input" value={banner.image} onChange={(e) => db.setBanner({ image: e.target.value })} placeholder="https://…" />
          </div>
        </div>
        <ImagePreview url={banner.image} />
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
          <label>Imagem (URL)</label>
          <input className="adm-input" value={kitPromo.image} onChange={(e) => db.setKitPromo({ image: e.target.value })} placeholder="https://…" />
        </div>
        <ImagePreview url={kitPromo.image} />
      </div>
    </>
  );
}
