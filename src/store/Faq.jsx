/* G2 IMPÉRIO — página FAQ */
import { useState } from "react";
import { Btn, Placeholder, WhatsIcon } from "../components/primitives.jsx";

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className={"g2-faq__item" + (open ? " is-open" : "")}>
      <button className="g2-faq__q" onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <i className="g2-faq__chev" aria-hidden="true">
          +
        </i>
      </button>
      <div className="g2-faq__a">
        <div>
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

const FAQ_GROUPS = [
  {
    title: "Pedidos & Entrega",
    items: [
      ["Como faço meu pedido?", "É simples: escolha o produto e toque em “Consultar/Comprar no WhatsApp”. Você fala direto com um atendente, que confirma valor, disponibilidade e formas de pagamento e finaliza tudo por lá."],
      ["Como funciona o frete e o prazo?", "Enviamos para todo o Brasil. O valor do frete e o prazo são combinados com o atendente pelo WhatsApp, de acordo com o seu endereço."],
      ["Como acompanho meu pedido?", "Assim que o pedido é enviado, você recebe o código de rastreio pelo WhatsApp e a gente acompanha a entrega com você por lá."],
    ],
  },
  {
    title: "Pagamento",
    items: [
      ["Quais formas de pagamento são aceitas?", "Cartão de crédito e débito (Visa, Mastercard, Elo, Amex), Pix e boleto. No Pix costumamos ter desconto à vista — confirme com o atendente."],
      ["Dá para parcelar?", "Sim! As condições de parcelamento são combinadas com o atendente pelo WhatsApp no momento da compra."],
      ["Meus dados de pagamento estão seguros?", "Sim. Todo o pedido é finalizado com um atendente pelo WhatsApp, que envia um link ou dados de pagamento seguros — nunca pedimos senhas ou dados sensíveis por mensagem."],
    ],
  },
  {
    title: "Trocas & Garantia",
    items: [
      ["Posso trocar ou devolver um produto?", "Sim, você tem 30 dias para trocar ou devolver. O item deve estar sem uso e na embalagem original. Em caso de defeito, o frete de devolução é por nossa conta."],
      ["O produto tem garantia?", "Todos os produtos têm 90 dias de garantia contra defeitos de fabricação, além da garantia legal prevista no Código de Defesa do Consumidor."],
      ["Como falo com o atendimento?", "Pelo WhatsApp! É só tocar no botão de WhatsApp em qualquer página. Atendemos de segunda a sexta, das 9h às 18h."],
    ],
  },
];

export function Faq({ onNav, onWhats, settings }) {
  const [open, setOpen] = useState("0-0");
  return (
    <main className="g2-faqpage">
      <section className="g2-faqpage__hero">
        <Placeholder label="suporte ao cliente" hue={45} ratio="auto" light={24} sat={18} style={{ position: "absolute", inset: 0 }} />
        <div className="g2-faqpage__hero-in">
          <span className="g2-banner__kicker">CENTRAL DE AJUDA</span>
          <h1 className="g2-about__title">
            PERGUNTAS
            <br />
            FREQUENTES
          </h1>
          <p>Tudo o que você precisa saber sobre pedidos, pagamento, entrega, trocas e garantia. Não achou sua dúvida? Fale com a gente.</p>
        </div>
      </section>

      <section className="g2-section g2-faqpage__body">
        <div className="g2-faqpage__groups">
          {FAQ_GROUPS.map((g, gi) => (
            <div className="g2-faq__group" key={gi}>
              <h2 className="g2-faq__grouptitle">{g.title}</h2>
              <div className="g2-faq__list">
                {g.items.map(([q, a], i) => {
                  const id = gi + "-" + i;
                  return <FaqItem key={id} q={q} a={a} open={open === id} onToggle={() => setOpen(open === id ? null : id)} />;
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="g2-faqpage__help">
          <div className="g2-faqpage__helpcard">
            <h3>Ainda com dúvidas?</h3>
            <p>Nosso time atende de Seg a Sex, das 9h às 18h. Resposta rápida, gente de verdade.</p>
            <Btn variant="gold" full onClick={onWhats}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".5em" }}>
                <WhatsIcon /> FALAR NO WHATSAPP
              </span>
            </Btn>
            {settings.instagram && (
              <a className="g2-faqpage__mail" href={settings.instagram} target="_blank" rel="noopener noreferrer">
                @g2_imperio no Instagram
              </a>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
