/* G2 IMPÉRIO — página de produto (PDP) */
import { useState, useEffect } from "react";
import { brl, discountPct } from "../lib/format.js";
import { stockInfo } from "../lib/store.js";
import { Badge, Btn, Placeholder, ProductCard, Stars, WhatsIcon } from "../components/primitives.jsx";
import { Rail } from "../components/Rail.jsx";

export function ProductPage({ product, products, settings, onNav, onOpenProduct, onAdd, onWish, wishlist, onBuyNow }) {
  const p = product;
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [buyType, setBuyType] = useState("once");
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    setActiveImg(0);
    setColor(0);
    setQty(1);
    setBuyType("once");
    setTab("desc");
    window.scrollTo(0, 0);
  }, [p && p.id]);
  if (!p) return null;

  const info = stockInfo(p);
  const isOut = info.status === "out";
  const stock = Number(p.stock) || 0;
  const discount = buyType === "month" ? 0.1 : buyType === "bi" ? 0.08 : 0;
  const unit = +(p.price * (1 - discount)).toFixed(2);
  const cashback = +((unit * qty * (settings.cashbackPct || 10)) / 100).toFixed(2);
  const pixPrice = +(unit * (1 - (settings.pixDiscountPct || 5) / 100)).toFixed(2);
  const off = discountPct(p.price, p.oldPrice);
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 6);
  const comments = p.comments || [];

  const tabs = {
    desc: (
      <p className="g2-prose">
        {p.desc} A G2 Império seleciona cada peça pensando em durabilidade, acabamento e estilo — para que você se sinta poderoso em qualquer ocasião. Produto testado e aprovado pela nossa curadoria.
      </p>
    ),
    spec: (
      <table className="g2-spectable">
        <tbody>
          {p.specs.map((s, i) => (
            <tr key={i}>
              <th>Destaque {i + 1}</th>
              <td>{s}</td>
            </tr>
          ))}
          <tr>
            <th>Categoria</th>
            <td>{p.catName}</td>
          </tr>
          <tr>
            <th>Garantia</th>
            <td>90 dias contra defeitos de fabricação</td>
          </tr>
          <tr>
            <th>SKU</th>
            <td>
              {String(p.id).toUpperCase()}-{p.slug.slice(0, 6).toUpperCase()}
            </td>
          </tr>
        </tbody>
      </table>
    ),
    care: (
      <ul className="g2-prose g2-prose--list">
        <li>Guarde em local seco e arejado.</li>
        <li>Limpe com flanela macia e levemente úmida.</li>
        <li>Evite contato com produtos químicos abrasivos.</li>
        <li>Mantenha longe de fontes de calor intenso.</li>
      </ul>
    ),
    pol: (
      <p className="g2-prose">
        Você tem até 30 dias para trocar ou devolver o produto. O item deve estar sem uso e na embalagem original. O frete de devolução é por nossa conta em caso de defeito. Reembolso em até 7 dias úteis após o recebimento.
      </p>
    ),
    rev: (
      <div className="g2-pdp__reviews">
        {comments.length === 0 ? (
          <p className="g2-pdp__review-empty">Este produto ainda não tem avaliações. Seja o primeiro a comentar!</p>
        ) : (
          comments.map((c) => (
            <article className="g2-pdp__review" key={c.id}>
              <div className="g2-pdp__review-top">
                <strong>{c.name}</strong>
                <Stars value={c.stars} size={13} />
                {c.date && <time>{c.date}</time>}
              </div>
              <p>"{c.text}"</p>
            </article>
          ))
        )}
      </div>
    ),
  };

  const hasImg = !!p.image;

  return (
    <main className="g2-pdp">
      <nav className="g2-crumb g2-pdp__crumb">
        <a
          onClick={(e) => {
            e.preventDefault();
            onNav({ view: "home" });
          }}
          href="#"
        >
          Início
        </a>{" "}
        /
        <a
          onClick={(e) => {
            e.preventDefault();
            onNav({ view: "collection", cat: p.cat });
          }}
          href="#"
        >
          {" "}
          {p.catName}
        </a>{" "}
        / <span> {p.name}</span>
      </nav>

      <div className="g2-pdp__top">
        <div className="g2-pdp__gallery">
          <div className="g2-pdp__main">
            {(() => {
              const b = isOut ? "out" : p.badge;
              return b ? <Badge kind={b} /> : null;
            })()}
            {hasImg ? (
              <div className="g2-img" style={{ borderRadius: 16, aspectRatio: "1/1" }}>
                <img src={p.image} alt={p.name} />
              </div>
            ) : (
              <Placeholder label={["frente", "ângulo", "detalhe", "em uso"][activeImg]} hue={p.hue} ratio="1/1" round={16} light={92} style={{ height: "100%" }} />
            )}
          </div>
          <div className="g2-pdp__thumbs">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} className={"g2-pdp__thumb" + (i === activeImg ? " is-active" : "")} onClick={() => setActiveImg(i)}>
                {hasImg ? (
                  <div className="g2-img" style={{ aspectRatio: "1/1", borderRadius: 8, opacity: i === activeImg ? 1 : 0.75 }}>
                    <img src={p.image} alt="" />
                  </div>
                ) : (
                  <Placeholder label="" hue={p.hue} ratio="1/1" round={8} light={i === activeImg ? 88 : 93} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="g2-pdp__info">
          <div className="g2-pdp__rating">
            <Stars value={p.rating} size={16} />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setTab("rev");
                document.querySelector(".g2-pdp__tabs")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {Number(p.rating).toFixed(1)} · {p.reviews} avaliações
            </a>
          </div>
          <h1 className="g2-pdp__name">{p.name}</h1>
          <p className="g2-pdp__short">{p.desc}</p>

          {p.specs.length > 0 && (
            <div className="g2-pdp__pills">
              {p.specs.map((s) => (
                <span key={s} className="g2-pill">
                  {s}
                </span>
              ))}
            </div>
          )}

          {p.colors.length > 0 && (
            <div className="g2-pdp__variant">
              <label>
                Cor: <strong>{p.colors[color][0]}</strong>
              </label>
              <div className="g2-pdp__colors">
                {p.colors.map((c, i) => (
                  <button key={i} className={"g2-colorsw" + (i === color ? " is-active" : "")} style={{ background: c[1] }} title={c[0]} onClick={() => setColor(i)} />
                ))}
              </div>
            </div>
          )}

          <div className={"g2-pdp__stock g2-pdp__stock--" + info.status}>
            {info.status === "ok" && "✔ Em estoque — pronta entrega"}
            {info.status === "low" && "🔥 " + info.label}
            {info.status === "out" && "✖ Produto esgotado no momento"}
          </div>

          <div className="g2-pdp__price">
            <div className="g2-pdp__pricerow">
              {p.oldPrice && <s>{brl(p.oldPrice)}</s>}
              <strong>{brl(unit)}</strong>
              {off > 0 && <span className="g2-pdp__off">-{off}%</span>}
            </div>
            <span className="g2-pdp__inst">ou 3x de {brl(unit / 3)} sem juros</span>
            <span className="g2-pdp__pix">
              {brl(pixPrice)} no Pix ({settings.pixDiscountPct || 5}% off)
            </span>
          </div>

          <div className="g2-pdp__buytype">
            {[
              ["once", "Compra única", ""],
              ["month", "Assinatura Mensal", "−10%"],
              ["bi", "Assinatura Bimestral", "−8%"],
            ].map(([v, l, tag]) => (
              <label key={v} className={"g2-buytype" + (buyType === v ? " is-active" : "")}>
                <input type="radio" name="bt" checked={buyType === v} onChange={() => setBuyType(v)} />
                <span>{l}</span>
                {tag && <em>{tag}</em>}
              </label>
            ))}
          </div>

          <div className="g2-pdp__buyrow">
            <QtyStepper value={qty} onChange={setQty} max={stock || undefined} />
            <Btn variant="gold" full disabled={isOut} onClick={() => onAdd(p, qty, p.colors[color] && p.colors[color][0])}>
              {isOut ? "PRODUTO ESGOTADO" : "ADICIONAR AO CARRINHO"}
            </Btn>
          </div>
          <Btn variant="dark" full onClick={() => onBuyNow(p, qty, p.colors[color] && p.colors[color][0])}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: ".5em" }}>
              <WhatsIcon /> COMPRAR NO WHATSAPP
            </span>
          </Btn>
          <button className="g2-pdp__wishbtn" onClick={() => onWish(p)}>
            {wishlist.has(p.id) ? "♥ Na sua lista de desejos" : "♡ Adicionar à lista de desejos"}
          </button>

          <div className="g2-pdp__cashback">
            💰 Você acumulará <strong>{brl(cashback)}</strong> de cashback nesta compra.
          </div>

          <ul className="g2-pdp__benefits">
            <li>🚚 Frete grátis acima de R$ {settings.freeShip}</li>
            <li>🔄 Troca fácil em 30 dias</li>
            <li>🔒 Compra 100% segura</li>
            <li>💰 {settings.cashbackPct}% de cashback na próxima compra</li>
          </ul>
        </div>
      </div>

      <div className="g2-pdp__tabs">
        <div className="g2-pdp__tabbar">
          {[
            ["desc", "Descrição"],
            ["spec", "Especificações"],
            ["care", "Cuidados"],
            ["pol", "Trocas"],
            ["rev", `Avaliações (${comments.length})`],
          ].map(([v, l]) => (
            <button key={v} className={tab === v ? "is-active" : ""} onClick={() => setTab(v)}>
              {l}
            </button>
          ))}
        </div>
        <div className="g2-pdp__tabpanel">{tabs[tab] || tabs.desc}</div>
      </div>

      {related.length > 0 && (
        <section className="g2-section">
          <div className="g2-section__head">
            <h2 className="g2-h2">VOCÊ TAMBÉM VAI GOSTAR</h2>
          </div>
          <Rail>
            {related.map((r) => (
              <div className="g2-rail__cell" key={r.id}>
                <ProductCard p={r} onOpen={onOpenProduct} onAdd={(x) => onAdd(x)} onWish={onWish} wished={wishlist.has(r.id)} />
              </div>
            ))}
          </Rail>
        </section>
      )}
    </main>
  );
}

/* stepper local com limite de estoque */
function QtyStepper({ value, onChange, max }) {
  const atMax = max != null && value >= max;
  return (
    <div className="g2-qty">
      <button onClick={() => onChange(Math.max(1, value - 1))} aria-label="Diminuir">
        −
      </button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={atMax} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}
