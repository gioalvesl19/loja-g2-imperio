/* G2 IMPÉRIO — páginas de políticas (privacidade, trocas, entrega, etc.) */
import { Placeholder, Btn, WhatsIcon } from "../components/primitives.jsx";
import { POLICIES } from "./policies.js";

export function PolicyPage({ slug, settings, onNav, onWhats }) {
  const policy = POLICIES.find((p) => p.slug === slug) || POLICIES[0];
  return (
    <main className="g2-policy">
      <section className="g2-coll__hero">
        <Placeholder label="" hue={45} ratio="auto" light={24} sat={16} style={{ position: "absolute", inset: 0 }} />
        <div className="g2-coll__hero-in">
          <nav className="g2-crumb">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNav({ view: "home" });
              }}
            >
              Início
            </a>{" "}
            / <span>{policy.title}</span>
          </nav>
          <h1 className="g2-coll__title">{policy.title}</h1>
          <p>{policy.intro}</p>
        </div>
      </section>

      <section className="g2-section g2-policy__body">
        {policy.sections.map(([h, txt], i) => (
          <div className="g2-policy__block" key={i}>
            <h2>{h}</h2>
            <p>{txt}</p>
          </div>
        ))}

        <div className="g2-policy__cta">
          <p>Ficou com alguma dúvida? Fale com a gente.</p>
          <Btn variant="gold" onClick={onWhats}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: ".5em" }}>
              <WhatsIcon /> FALAR NO WHATSAPP
            </span>
          </Btn>
        </div>
      </section>
    </main>
  );
}
