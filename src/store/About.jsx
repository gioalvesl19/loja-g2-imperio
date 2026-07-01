/* G2 IMPÉRIO — página Sobre Nós */
import { useState, useEffect, useRef } from "react";
import { Btn, Placeholder } from "../components/primitives.jsx";

function Counter({ to, suffix = "", decimals = 0, dur = 1400 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf,
      start;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setV(to * ease(p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span ref={ref}>
      {v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function About({ onNav, categories }) {
  const firstCat = categories[0] ? categories[0].slug : "oculos";
  const stats = [
    { to: 10000, suffix: "+", label: "Clientes satisfeitos" },
    { to: 500, suffix: "+", label: "Produtos em catálogo" },
    { to: 4.9, decimals: 1, suffix: "★", label: "Nota média de avaliações" },
    { to: 99, suffix: "%", label: "Taxa de satisfação" },
  ];
  const values = [
    ["QUALIDADE", "Cada peça é selecionada e testada pela nossa curadoria antes de chegar até você.", "M12 2l3 6 6 1-4.5 4 1 6L12 16l-5.5 3 1-6L3 9l6-1z"],
    ["ESTILO ACESSÍVEL", "Acreditamos que todo mundo merece se sentir poderoso — com preço justo.", "M3 12l4-9 4 5 4-7 4 11M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"],
    ["ATENDIMENTO HUMANO", "Você fala direto com um atendente de verdade, do primeiro clique à entrega.", "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  ];
  const timeline = [
    ["2021", "O início", "Nasce a G2 Império, com a missão de democratizar acessórios de qualidade."],
    ["2023", "Primeiros 1.000 pedidos", "A comunidade cresce e o catálogo se expande para 8 categorias."],
    ["2025", "+10 mil clientes", "Programa de cashback e Clube G2 transformam clientes em fãs."],
    ["2026", "Império em expansão", "Novas coleções, parcerias com influenciadores e atendimento premium."],
  ];

  return (
    <main className="g2-about">
      <section className="g2-about__hero">
        <Placeholder label="imagem da marca" hue={42} ratio="auto" light={22} sat={16} style={{ position: "absolute", inset: 0 }} />
        <div className="g2-about__hero-in">
          <span className="g2-banner__kicker">SOBRE A G2 IMPÉRIO</span>
          <h1 className="g2-about__title">
            NASCEU DA PAIXÃO
            <br />
            POR ESTILO
          </h1>
          <p>
            Fundada em 2021, a G2 Império surgiu com um único propósito: democratizar o acesso a produtos de qualidade, com estilo e preço justo. Acreditamos que todo mundo merece se sentir poderoso — seja com um óculos na medida, um relógio marcante, uma bolsa estilosa ou um fone que toca na alma.
          </p>
          <Btn variant="gold" size="lg" onClick={() => onNav({ view: "collection", cat: firstCat })}>
            CONHEÇA NOSSOS PRODUTOS →
          </Btn>
        </div>
      </section>

      <section className="g2-about__stats">
        {stats.map((s) => (
          <div className="g2-about__stat" key={s.label}>
            <strong>
              <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
            </strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      <section className="g2-section">
        <div className="g2-about__lead">
          <h2 className="g2-h2">
            MAIS QUE UMA LOJA,
            <br />
            UM IMPÉRIO DE ESTILO
          </h2>
          <p>
            Reunimos óculos, relógios, bolsas, mochilas, bonés, copos, caixas de som e fones num só lugar — tudo pensado para quem quer atitude no dia a dia sem pesar no bolso. Estilo com Atitude não é só um slogan: é como tratamos cada detalhe, do produto à embalagem.
          </p>
        </div>
        <div className="g2-about__values">
          {values.map(([t, d, path]) => (
            <article className="g2-about__value" key={t}>
              <span className="g2-highlight__ico">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d={path} />
                </svg>
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="g2-about__timeline-wrap">
        <div className="g2-section">
          <div className="g2-section__head">
            <h2 className="g2-h2">NOSSA HISTÓRIA</h2>
          </div>
          <div className="g2-about__timeline">
            {timeline.map(([y, t, d]) => (
              <div className="g2-about__tl" key={y}>
                <div className="g2-about__tl-year">{y}</div>
                <div className="g2-about__tl-dot">
                  <i />
                </div>
                <div className="g2-about__tl-card">
                  <h4>{t}</h4>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="g2-kitpromo" onClick={() => onNav({ view: "collection", cat: "promocoes" })}>
        <Placeholder label="lifestyle escuro" hue={42} ratio="auto" light={22} sat={16} style={{ position: "absolute", inset: 0 }} />
        <div className="g2-kitpromo__in">
          <span className="g2-banner__kicker">FAÇA PARTE</span>
          <h2 className="g2-banner__title">PRONTO PARA VESTIR ATITUDE?</h2>
          <p>Explore nossas coleções e descubra por que mais de 10 mil clientes escolheram a G2 Império.</p>
          <Btn variant="gold" size="lg">
            VER PRODUTOS →
          </Btn>
        </div>
      </section>
    </main>
  );
}
