/* G2 IMPÉRIO — conteúdo das páginas de políticas (simples e editável no código) */

export const POLICIES = [
  {
    slug: "privacidade",
    title: "Política de Privacidade",
    intro: "Sua privacidade é prioridade para a G2 Império. Saiba como tratamos seus dados.",
    sections: [
      ["Quais dados coletamos", "Coletamos apenas as informações necessárias para atender e entregar seus pedidos: nome, contato (WhatsApp/e-mail) e endereço de entrega, além de dados de navegação para melhorar a loja."],
      ["Como usamos seus dados", "Usamos seus dados exclusivamente para processar pedidos, prestar atendimento, enviar atualizações da sua compra e, com o seu consentimento, novidades e promoções."],
      ["Compartilhamento", "Não vendemos seus dados. Compartilhamos apenas o essencial com parceiros de pagamento e logística para concluir a entrega do seu pedido."],
      ["Seus direitos", "Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo nosso WhatsApp."],
    ],
  },
  {
    slug: "trocas-devolucoes",
    title: "Trocas e Devoluções",
    intro: "Comprou e não ficou 100% satisfeito? A troca é fácil e sem complicação.",
    sections: [
      ["Prazo", "Você tem até 30 dias corridos, a contar do recebimento, para solicitar troca ou devolução."],
      ["Condições", "O produto deve estar sem uso, com a etiqueta e na embalagem original, acompanhado do comprovante de compra."],
      ["Produtos com defeito", "Em caso de defeito de fabricação, o frete de devolução é por nossa conta e você escolhe entre troca ou reembolso."],
      ["Como solicitar", "Fale com a gente pelo WhatsApp informando o número do pedido. Nosso time orienta todo o processo."],
    ],
  },
  {
    slug: "entrega",
    title: "Política de Entrega",
    intro: "Enviamos para todo o Brasil com rapidez e segurança.",
    sections: [
      ["Prazos", "O prazo varia de 5 a 15 dias úteis conforme a região e o método escolhido (PAC, SEDEX ou transportadora)."],
      ["Frete grátis", "Frete grátis para pedidos acima de R$ 299. Abaixo disso, o valor é calculado pelo seu CEP."],
      ["Rastreamento", "Assim que o pedido é enviado, você recebe o código de rastreio pelo WhatsApp para acompanhar tudo."],
      ["Retirada", "Também é possível retirar na nossa loja em Anápolis-GO — combine pelo WhatsApp."],
    ],
  },
  {
    slug: "cashback",
    title: "Programa de Cashback",
    intro: "A cada compra, parte do valor volta pra você.",
    sections: [
      ["Como funciona", "Você acumula um percentual do valor pago como crédito G2 para usar em compras futuras."],
      ["Validade", "O crédito é válido por 90 dias a partir da data da compra."],
      ["Como usar", "Informe ao nosso atendimento no momento da compra para aplicar o seu saldo de cashback."],
    ],
  },
  {
    slug: "promocoes",
    title: "Promoções",
    intro: "Ofertas, cupons e condições especiais da G2 Império.",
    sections: [
      ["Cupons", "Cupons de desconto podem ser aplicados na finalização via WhatsApp. Confira o cupom em destaque no topo do site."],
      ["Descontos", "Produtos em promoção exibem o preço antigo e o percentual de desconto. As promoções são por tempo limitado ou enquanto durarem os estoques."],
      ["Kits e Combos", "Monte seu kit e ganhe descontos progressivos: quanto mais itens, maior o desconto."],
    ],
  },
  {
    slug: "termos-de-uso",
    title: "Termos de Uso",
    intro: "Condições gerais de uso da loja G2 Império.",
    sections: [
      ["Uso do site", "Ao navegar e comprar na G2 Império, você concorda com estes termos e com a nossa Política de Privacidade."],
      ["Preços e disponibilidade", "Preços e disponibilidade podem mudar sem aviso prévio. Confirmamos os valores no atendimento antes de concluir o pedido."],
      ["Pagamentos", "Os pedidos são finalizados via WhatsApp com um atendente, que envia o link ou os dados de pagamento seguros."],
      ["Contato", "Dúvidas sobre estes termos? Fale com a gente pelo WhatsApp ou visite nossa loja em Anápolis-GO."],
    ],
  },
];

export const POLICY_LINKS = POLICIES.map((p) => ({ slug: p.slug, label: p.title.replace("Política de ", "").replace("Programa de ", "") }));
