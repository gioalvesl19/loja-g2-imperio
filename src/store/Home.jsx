/* G2 IMPÉRIO — página inicial */
import { useState, useEffect } from "react";
import { Btn, Placeholder, ProductCard, Stars } from "../components/primitives.jsx";
import { Rail } from "../components/Rail.jsx";

/* ---------- Carrossel do topo (capas editáveis no admin) ---------- */
function heroVariant(theme) {
  return theme === "gold" || theme === "light" ? "dark" : "accent";
}

function Hero({ slides, onNav }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, i, n]);
  useEffect(() => {
    if (i >= n) setI(0);
  }, [n, i]);
  if (n === 0) return null;
  return (
    <section className="g2-hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="g2-hero__track" style={{ transform: `translateX(${-i * 100}%)` }}>
        {slides.map((s, k) => (
          <div className={"g2-hero__slide g2-hero__slide--" + s.theme} key={s.id || k}>
            <div className="g2-hero__txt">
              <span className="g2-hero__kicker">{s.kicker}</span>
              <h2 className="g2-hero__title">{s.title}</h2>
              {s.sub && <p className="g2-hero__sub">{s.sub}</p>}
              <Btn variant={heroVariant(s.theme)} size="lg" onClick={() => onNav({ view: "collection", cat: s.ctaCat || "promocoes" })}>
                {s.ctaLabel} →
              </Btn>
            </div>
            <div className="g2-hero__media">
              {s.image ? (
                <div className="g2-img" style={{ height: "100%" }}>
                  <img src={s.image} alt={s.title} />
                </div>
              ) : (
                <Placeholder label="capa" hue={s.hue} ratio="auto" light={s.theme === "light" ? 90 : 30} sat={s.theme === "gold" ? 30 : 14} style={{ height: "100%" }} />
              )}
            </div>
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button className="g2-hero__nav g2-hero__nav--prev" onClick={() => setI((i - 1 + n) % n)} aria-label="Anterior">
            ‹
          </button>
          <button className="g2-hero__nav g2-hero__nav--next" onClick={() => setI((i + 1) % n)} aria-label="Próximo">
            ›
          </button>
          <div className="g2-hero__dots">
            {slides.map((_, k) => (
              <button key={k} className={k === i ? "is-on" : ""} onClick={() => setI(k)} aria-label={"Slide " + (k + 1)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function CategoryStrip({ categories, onNav }) {
  return (
    <section className="g2-section g2-cats">
      <Rail className="g2-cats__track">
        {categories.map((c) => (
          <button key={c.slug} className="g2-cats__item" onClick={() => onNav({ view: "collection", cat: c.slug })}>
            <Placeholder label={c.short.toLowerCase()} hue={c.hue} ratio="1 / 1" round={18} light={93} />
            <span style={{ color: `hsl(${c.hue} 45% 40%)` }}>{c.name}</span>
          </button>
        ))}
      </Rail>
    </section>
  );
}

function BenefitsMarquee({ settings }) {
  const items = [
    `🚚 Frete grátis acima de R$ ${settings.freeShip}`,
    "💳 Parcele em até 12x",
    "🔄 Troca fácil em 30 dias",
    "🔒 Compra 100% segura",
    "⭐ +10.000 clientes satisfeitos",
  ];
  return (
    <section className="g2-benmarq">
      <div className="g2-benmarq__track">
        {[0, 1].map((g) => (
          <div className="g2-benmarq__group" key={g}>
            {items.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase({ title, sub, cat, products, onNav, onOpenProduct, onAdd, onWish, wishlist }) {
  const list = products.filter((p) => p.cat === cat).slice(0, 6);
  if (list.length === 0) return null;
  return (
    <section className="g2-section">
      <div className="g2-section__head">
        <div>
          <h2 className="g2-h2">{title}</h2>
          <p className="g2-section__sub">{sub}</p>
        </div>
        <button className="g2-link" onClick={() => onNav({ view: "collection", cat })}>
          Ver todos →
        </button>
      </div>
      <Rail>
        {list.map((p) => (
          <div className="g2-rail__cell" key={p.id}>
            <ProductCard p={p} onOpen={onOpenProduct} onAdd={onAdd} onWish={onWish} wished={wishlist.has(p.id)} />
          </div>
        ))}
      </Rail>
    </section>
  );
}

function Banner({ banner, onNav }) {
  const theme = banner.theme || "dark";
  return (
    <section className={"g2-banner g2-banner--" + theme} onClick={() => onNav({ view: "collection", cat: banner.cat || "promocoes" })}>
      {banner.image ? (
        <div className="g2-img" style={{ position: "absolute", inset: 0 }}>
          <img src={banner.image} alt={banner.title} />
        </div>
      ) : (
        <Placeholder label="banner" hue={banner.hue || 42} ratio="auto" light={theme === "light" ? 88 : 26} sat={16} style={{ position: "absolute", inset: 0 }} />
      )}
      <div className="g2-banner__in">
        {banner.kicker && <span className="g2-banner__kicker">{banner.kicker}</span>}
        <h2 className="g2-banner__title">{banner.title}</h2>
        {banner.sub && <p>{banner.sub}</p>}
        <Btn variant={theme === "gold" ? "dark" : "gold"} size="lg">
          {banner.ctaLabel} →
        </Btn>
      </div>
    </section>
  );
}

function ReviewsSection({ reviews }) {
  const dist = [
    ["⭐⭐⭐⭐⭐", 92],
    ["⭐⭐⭐⭐", 6],
    ["⭐⭐⭐", 2],
  ];
  return (
    <section className="g2-section g2-reviews">
      <div className="g2-reviews__head">
        <div className="g2-reviews__score">
          <strong>4.9</strong>
          <Stars value={5} size={20} />
          <span>baseado em 9.200+ avaliações</span>
        </div>
        <div className="g2-reviews__dist">
          {dist.map(([s, pct]) => (
            <div className="g2-reviews__row" key={s}>
              <i>{s}</i>
              <div className="g2-reviews__bar">
                <span style={{ width: pct + "%" }} />
              </div>
              <b>{pct}%</b>
            </div>
          ))}
        </div>
      </div>
      <Rail>
        {reviews.map((r, i) => (
          <div className="g2-rail__cell g2-rail__cell--review" key={i}>
            <article className="g2-review">
              <div className="g2-review__top">
                <Stars value={r.stars} size={14} />
                <span className="g2-review__verified">✓ Compra verificada</span>
              </div>
              <p>"{r.text}"</p>
              <div className="g2-review__foot">
                <Placeholder label="" hue={40} ratio="1/1" round={8} light={90} style={{ width: 42, height: 42 }} />
                <div>
                  <strong>{r.name}</strong>
                  <em>{r.prod}</em>
                </div>
              </div>
            </article>
          </div>
        ))}
      </Rail>
    </section>
  );
}

function Highlights({ settings }) {
  const items = [
    ["ENTREGA RÁPIDA", "Frete expresso para todo o Brasil", "M3 6h14M5 6l1 11h12l1-11"],
    ["COMPRA SEGURA", "Criptografia SSL, seus dados protegidos", "M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z"],
    ["TROCA FÁCIL", "30 dias para troca sem complicação", "M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0 1 15-2M20 14a8 8 0 0 1-15 2"],
    ["PARCELE SUA COMPRA", "Em até 12x no cartão de crédito", "M12 1v22M5 7h9a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h10"],
    ["QUALIDADE GARANTIDA", "Produtos selecionados e testados", "M12 2l3 6 6 1-4.5 4 1 6L12 16l-5.5 3 1-6L3 9l6-1z"],
    ["EMBALAGEM ESPECIAL", "Produtos embalados com cuidado", "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7"],
  ];
  return (
    <section className="g2-section g2-highlights">
      <div className="g2-highlights__grid">
        {items.map(([t, d, path]) => (
          <div className="g2-highlight" key={t}>
            <span className="g2-highlight__ico">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d={path} />
              </svg>
            </span>
            <div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogSection({ blog }) {
  return (
    <section className="g2-section">
      <div className="g2-section__head">
        <div>
          <h2 className="g2-h2">DICAS & TENDÊNCIAS</h2>
          <p className="g2-section__sub">Conteúdos para você curtir.</p>
        </div>
        <button className="g2-link">Ver tudo →</button>
      </div>
      <Rail>
        {blog.map((b, i) => (
          <div className="g2-rail__cell g2-rail__cell--blog" key={i}>
            <article className="g2-blog">
              <Placeholder label="thumbnail" hue={b.hue} ratio="16 / 10" round={12} light={92} />
              <span className="g2-blog__tag" style={{ color: `hsl(${b.hue} 45% 38%)` }}>
                {b.tag}
              </span>
              <h3>{b.title}</h3>
              <time>{b.date}</time>
            </article>
          </div>
        ))}
      </Rail>
    </section>
  );
}

function KitPromo({ data, onKit }) {
  return (
    <section className="g2-kitpromo" onClick={onKit}>
      {data.image ? (
        <div className="g2-img" style={{ position: "absolute", inset: 0 }}>
          <img src={data.image} alt={data.title} />
        </div>
      ) : (
        <Placeholder label="lifestyle escuro" hue={42} ratio="auto" light={22} sat={16} style={{ position: "absolute", inset: 0 }} />
      )}
      <div className="g2-kitpromo__in">
        <span className="g2-banner__kicker">{data.kicker}</span>
        <h2 className="g2-banner__title">{data.title}</h2>
        <p>{data.sub}</p>
        <Btn variant="gold" size="lg">
          {data.ctaLabel}
        </Btn>
      </div>
    </section>
  );
}

export function Home({ products, categories, reviews, blog, settings, hero, banner, kitPromo, onNav, onOpenProduct, onAdd, onWish, wishlist, onKit }) {
  const share = { products, onNav, onOpenProduct, onAdd, onWish, wishlist };
  const showcaseCats = categories.slice(0, 3);
  return (
    <main className="g2-home">
      <Hero slides={hero} onNav={onNav} />
      <CategoryStrip categories={categories} onNav={onNav} />
      <BenefitsMarquee settings={settings} />
      {showcaseCats[0] && <Showcase title={showcaseCats[0].name.toUpperCase()} sub="Seleção especial da G2 Império." cat={showcaseCats[0].slug} {...share} />}
      {showcaseCats[1] && <Showcase title={showcaseCats[1].name.toUpperCase()} sub="Os favoritos da categoria." cat={showcaseCats[1].slug} {...share} />}
      <KitPromo data={kitPromo} onKit={onKit} />
      {showcaseCats[2] && <Showcase title={showcaseCats[2].name.toUpperCase()} sub="Destaques que você vai amar." cat={showcaseCats[2].slug} {...share} />}
      <Banner banner={banner} onNav={onNav} />
      <ReviewsSection reviews={reviews} />
      <Highlights settings={settings} />
      <BlogSection blog={blog} />
    </main>
  );
}
