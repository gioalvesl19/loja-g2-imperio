/* G2 IMPÉRIO — catálogo inicial (seed) da loja.
   Estes dados são carregados uma única vez no localStorage; a partir daí,
   toda a gestão passa a ser feita pelo painel administrativo (/admin). */

import { slugify } from "./format.js";

export const SEED_CATEGORIES = [
  { slug: "oculos", name: "Óculos", short: "Óculos", hue: 38 },
  { slug: "relogios", name: "Relógios", short: "Relógios", hue: 45 },
  { slug: "bolsas-malas", name: "Bolsas & Malas", short: "Bolsas", hue: 25 },
  { slug: "mochilas", name: "Mochilas", short: "Mochilas", hue: 210 },
  { slug: "bones", name: "Bonés & Chapéus", short: "Bonés", hue: 145 },
  { slug: "estojos-lancheiras", name: "Estojos & Lancheiras", short: "Estojos", hue: 300 },
  { slug: "copos-garrafas", name: "Copos & Garrafas", short: "Copos", hue: 190 },
  { slug: "som-fones", name: "Caixas de Som & Fones", short: "Som & Fones", hue: 0 },
];

// Lista bruta dos produtos (design original preservado).
const RAW = [
  // ===== ÓCULOS =====
  { name: "Óculos G2 Retrô Clássico", cat: "oculos", price: 89.9, oldPrice: 119.9, badge: "promo", colors: [["Preto", "#111"], ["Tartaruga", "#6b4a2b"], ["Dourado", "#C9A84C"]], specs: ["UV400", "Leve", "Acetato"], desc: "Linhas atemporais em acetato, com proteção total contra raios UV." },
  { name: "Óculos G2 Sport UV400", cat: "oculos", price: 119.9, colors: [["Preto Fosco", "#1a1a1a"], ["Vermelho", "#b32a2a"], ["Azul", "#2a4bb3"]], specs: ["UV400", "Antiderrapante", "Esportivo"], desc: "Performance e proteção para atividades ao ar livre." },
  { name: "Óculos G2 Aviador Gold", cat: "oculos", price: 149.9, badge: "new", colors: [["Dourado/Verde", "#3b5b3b"], ["Dourado/Cinza", "#777"], ["Prata/Azul", "#3a5a8a"]], specs: ["UV400", "Metal", "Premium"], desc: "O clássico aviador com acabamento dourado de luxo." },
  { name: "Óculos G2 Gatinho Premium", cat: "oculos", price: 99.9, colors: [["Preto", "#111"], ["Rosa", "#d98aa0"], ["Dourado", "#C9A84C"]], specs: ["UV400", "Feminino", "Acetato"], desc: "Elegância feminina com a icônica armação gatinho." },
  { name: "Óculos G2 Wayfarer Black", cat: "oculos", price: 109.9, colors: [["Preto Total", "#0a0a0a"], ["Preto/Dourado", "#2a2410"]], specs: ["UV400", "Unissex", "Acetato"], desc: "O ícone urbano em preto absoluto." },
  { name: "Óculos G2 Oversized Luxo", cat: "oculos", price: 139.9, badge: "new", colors: [["Preto", "#111"], ["Marrom", "#5a3a22"], ["Nude", "#c9a98a"]], specs: ["UV400", "Oversized", "Tendência"], desc: "Statement maximalista para quem não passa despercebido." },
  { name: "Óculos G2 Round Vintage", cat: "oculos", price: 94.9, colors: [["Tartaruga", "#6b4a2b"], ["Preto", "#111"], ["Verde", "#2e4d3a"]], specs: ["UV400", "Vintage", "Metal"], desc: "Redondo retrô com pegada intelectual." },
  { name: "Kit Óculos G2 Misto (3un)", cat: "oculos", price: 249.9, oldPrice: 299.7, badge: "promo", colors: [["Sortido", "#C9A84C"]], specs: ["3 modelos", "UV400", "Kit"], desc: "Três modelos sortidos por um preço imperial." },

  // ===== RELÓGIOS =====
  { name: "Relógio G2 Classic Dourado", cat: "relogios", price: 189.9, badge: "new", colors: [["Couro Marrom", "#5a3a22"]], specs: ["À prova d'água 30m", "Caixa 40mm", "Couro"], desc: "Caixa dourada de 40mm sobre pulseira de couro genuíno." },
  { name: "Relógio G2 Sport Black", cat: "relogios", price: 219.9, colors: [["Preto", "#111"]], specs: ["Cronômetro", "50m", "Borracha"], desc: "Robusto e esportivo, resistente até 50 metros." },
  { name: "Relógio G2 Smartwatch Pro", cat: "relogios", price: 349.9, badge: "new", colors: [["Preto", "#111"], ["Prata", "#bbb"], ["Rosé", "#c98a8a"]], specs: ["SpO2", "Notificações", "Bateria 7 dias"], desc: "Monitore batimentos, passos e notificações com 7 dias de bateria." },
  { name: "Relógio G2 Feminino Rose", cat: "relogios", price: 199.9, colors: [["Rosé", "#c98a8a"]], specs: ["Aço Rosé", "36mm", "Delicado"], desc: "Delicadeza e elegância em rose gold de 36mm." },
  { name: "Relógio G2 Masculino Prata", cat: "relogios", price: 229.9, colors: [["Prata", "#bbb"]], specs: ["Aço Inox", "42mm", "Clássico"], desc: "Aço inox prateado com presença marcante de 42mm." },
  { name: "Relógio G2 Cronógrafo Elite", cat: "relogios", price: 279.9, badge: "new", colors: [["Preto/Dourado", "#2a2410"]], specs: ["Cronógrafo", "Data", "Couro"], desc: "Três subdials e data em caixa preto/dourado de 44mm." },
  { name: "Relógio G2 Digital Militar", cat: "relogios", price: 169.9, colors: [["Verde Militar", "#4a5a3a"]], specs: ["Anti-impacto", "Digital", "Borracha"], desc: "Construído para resistir a qualquer missão." },
  { name: "Kit Relógio G2 + Pulseiras", cat: "relogios", price: 259.9, oldPrice: 299.9, badge: "promo", colors: [["Sortido", "#C9A84C"]], specs: ["3 pulseiras", "Intercambiável", "Kit"], desc: "Um relógio, infinitas combinações." },

  // ===== BOLSAS & MALAS =====
  { name: "Bolsa G2 Tote Premium", cat: "bolsas-malas", price: 149.9, badge: "new", colors: [["Preto", "#111"], ["Marrom", "#5a3a22"], ["Caramelo", "#a06a35"], ["Bege", "#cbb89a"]], specs: ["Couro sintético", "Alça ombro", "Compartimentos"], desc: "Espaçosa e estruturada, com acabamento em couro sintético premium." },
  { name: "Bolsa G2 Crossbody Mini", cat: "bolsas-malas", price: 89.9, colors: [["Preto", "#111"], ["Nude", "#c9a98a"], ["Vinho", "#5a2030"]], specs: ["Tiracolo", "Ajustável", "Compacta"], desc: "O essencial em formato tiracolo ajustável." },
  { name: "Bolsa G2 Shopper Grande", cat: "bolsas-malas", price: 119.9, colors: [["Preto", "#111"], ["Azul Marinho", "#1f2d4a"], ["Verde", "#2e4d3a"]], specs: ["Lona reforçada", "Trabalho", "Resistente"], desc: "Para compras e trabalho — leva tudo com estilo." },
  { name: "Mala G2 Viagem Pequena (P)", cat: "bolsas-malas", price: 249.9, colors: [["Preto", "#111"], ["Cinza", "#888"], ["Azul", "#2a4bb3"], ["Rosa", "#d98aa0"]], specs: ["ABS rígido", '20"', "Bagagem de mão"], desc: "Cabine perfeita — 20 polegadas de durabilidade em ABS." },
  { name: "Mala G2 Viagem Média (M)", cat: "bolsas-malas", price: 319.9, colors: [["Preto", "#111"], ["Cinza", "#888"], ["Vermelho", "#b32a2a"]], specs: ["ABS rígido", '24"', "5-7 dias"], desc: "Ideal para viagens de até uma semana." },
  { name: "Mala G2 Viagem Grande (G)", cat: "bolsas-malas", price: 399.9, badge: "new", colors: [["Preto", "#111"], ["Cinza", "#888"]], specs: ["ABS + TSA Lock", '28"', "Viagens longas"], desc: "Segurança TSA e 28 polegadas para as jornadas mais longas." },
  { name: "Kit Mala G2 (P + G)", cat: "bolsas-malas", price: 589.9, oldPrice: 649.8, badge: "promo", colors: [["Preto", "#111"]], specs: ["Conjunto", "P + G", "Kit"], desc: "Pequena + grande, economia de R$ 59,90." },
  { name: "Necessaire G2 Travel", cat: "bolsas-malas", price: 59.9, colors: [["Preto", "#111"], ["Rosa", "#d98aa0"], ["Azul", "#2a4bb3"]], specs: ["Impermeável", "Neoprene", "Compacta"], desc: "Organização impermeável para a sua rotina." },

  // ===== MOCHILAS =====
  { name: "Mochila G2 Urban Pro", cat: "mochilas", price: 179.9, badge: "new", colors: [["Preto", "#111"], ["Cinza", "#888"], ["Azul", "#2a4bb3"]], specs: ['Notebook 15.6"', "Nylon", "Urbana"], desc: 'Compartimento acolchoado para notebook de até 15.6".' },
  { name: "Mochila G2 Slim Executive", cat: "mochilas", price: 199.9, colors: [["Preto", "#111"], ["Marinho", "#1f2d4a"]], specs: ["Antifurto", "USB", "Executiva"], desc: "Visual executivo com porta USB e proteção antifurto." },
  { name: "Mochila G2 Adventure Outdoor", cat: "mochilas", price: 219.9, colors: [["Verde Militar", "#4a5a3a"], ["Preto", "#111"], ["Caqui", "#9a8a5a"]], specs: ["40L", "Impermeável", "Trilhas"], desc: "40 litros impermeáveis para trilhas e aventuras." },
  { name: "Mochila G2 Escolar Juvenil", cat: "mochilas", price: 129.9, colors: [["Preto", "#111"], ["Azul", "#2a4bb3"], ["Rosa", "#d98aa0"], ["Roxo", "#6a4a9a"]], specs: ["Lancheira", "Reforçada", "Escolar"], desc: "Resistente, com compartimento para lancheira." },
  { name: "Mochila G2 Mini Fashion", cat: "mochilas", price: 99.9, colors: [["Preto", "#111"], ["Rosé", "#c98a8a"], ["Bege", "#cbb89a"]], specs: ["Streetwear", "Couro sint.", "Mini"], desc: "Estilo streetwear em formato compacto." },
  { name: "Mochila G2 Sport Gym", cat: "mochilas", price: 149.9, colors: [["Preto", "#111"], ["Cinza", "#888"], ["Vermelho", "#b32a2a"]], specs: ["Porta-tênis", "Impermeável", "Academia"], desc: "Compartimento ventilado para tênis e treino." },

  // ===== BONÉS =====
  { name: "Boné G2 Classic Snapback", cat: "bones", price: 59.9, badge: "new", colors: [["Preto", "#111"], ["Branco", "#eee"], ["Cinza", "#888"], ["Navy", "#1f2d4a"]], specs: ["Aba reta", "Algodão", "Ajustável"], desc: "Aba reta e ajuste traseiro — o snapback definitivo." },
  { name: "Boné G2 Dad Hat Premium", cat: "bones", price: 69.9, colors: [["Preto", "#111"], ["Bege", "#cbb89a"], ["Verde", "#2e4d3a"], ["Bordô", "#5a2030"]], specs: ["Aba curva", "Twill", "Relaxado"], desc: "Fit relaxado em twill de algodão lavado." },
  { name: "Boné G2 Trucker Mesh", cat: "bones", price: 54.9, colors: [["Preto/Branco", "#444"], ["Preto/Caqui", "#5a5236"]], specs: ["Tela", "Espuma", "Ventilado"], desc: "Frente em espuma e traseira em tela ventilada." },
  { name: "Boné G2 5-Panel Streetwear", cat: "bones", price: 79.9, badge: "new", colors: [["Preto", "#111"], ["Branco", "#eee"], ["Verde", "#2e4d3a"]], specs: ["Ripstop", "Edição limitada", "5-panel"], desc: "Edição limitada em nylon ripstop." },
  { name: "Chapéu G2 Bucket Hat", cat: "bones", price: 69.9, colors: [["Preto", "#111"], ["Bege", "#cbb89a"], ["Azul", "#2a4bb3"], ["Camuflado", "#5a5a3a"]], specs: ["Algodão", "Bucket", "Unissex"], desc: "O bucket que volta sempre — 100% algodão." },
  { name: "Kit Boné G2 Misto (2un)", cat: "bones", price: 99.9, oldPrice: 119.8, badge: "promo", colors: [["Sortido", "#C9A84C"]], specs: ["2 unidades", "À escolha", "Kit"], desc: "Dois bonés à sua escolha por um preço especial." },

  // ===== ESTOJOS & LANCHEIRAS =====
  { name: "Estojo G2 Escolar Duplo", cat: "estojos-lancheiras", price: 39.9, colors: [["Preto", "#111"], ["Azul", "#2a4bb3"], ["Rosa", "#d98aa0"], ["Roxo", "#6a4a9a"]], specs: ["2 zíperes", "EVA", "Impermeável"], desc: "Dois compartimentos impermeáveis para a escola." },
  { name: "Estojo G2 Redondo Grande", cat: "estojos-lancheiras", price: 34.9, colors: [["Preto", "#111"], ["Rosa", "#d98aa0"], ["Bege", "#cbb89a"]], specs: ["30 peças", "Poliéster", "Grande"], desc: "Capacidade para 30 itens." },
  { name: "Estojo G2 Transparente", cat: "estojos-lancheiras", price: 29.9, colors: [["Fumê", "#555"], ["Rosa", "#d98aa0"], ["Azul", "#2a4bb3"]], specs: ["PVC", "Transparente", "Flexível"], desc: "Veja tudo de relance — PVC flexível." },
  { name: "Lancheira G2 Térmica Premium", cat: "estojos-lancheiras", price: 79.9, badge: "new", colors: [["Preto", "#111"], ["Rosa", "#d98aa0"], ["Azul", "#2a4bb3"]], specs: ["Térmica 6h", "Neoprene", "PEVA"], desc: "Mantém a temperatura por até 6 horas." },
  { name: "Lancheira G2 Escolar Infantil", cat: "estojos-lancheiras", price: 59.9, colors: [["Azul", "#2a4bb3"], ["Rosa", "#d98aa0"], ["Amarelo", "#d9b84c"], ["Verde", "#2e4d3a"]], specs: ["Térmica", "Infantil", "Estampada"], desc: "Cores e estampas que as crianças amam." },
  { name: "Kit Estojo + Lancheira G2", cat: "estojos-lancheiras", price: 109.9, oldPrice: 119.8, badge: "promo", colors: [["Sortido", "#C9A84C"]], specs: ["Conjunto", "Coordenado", "Kit"], desc: "Conjunto coordenado para o dia a dia." },

  // ===== COPOS & GARRAFAS =====
  { name: "Garrafa G2 Térmica 500ml", cat: "copos-garrafas", price: 89.9, badge: "new", colors: [["Preto", "#111"], ["Prata", "#bbb"], ["Dourado", "#C9A84C"], ["Rosa", "#d98aa0"]], specs: ["12h frio / 8h quente", "Aço inox", "500ml"], desc: "Dupla parede em aço inox que segura a temperatura." },
  { name: "Garrafa G2 Térmica 1L", cat: "copos-garrafas", price: 129.9, colors: [["Preto", "#111"], ["Verde", "#2e4d3a"], ["Azul", "#2a4bb3"]], specs: ["Tripla parede", "1 litro", "Esportes"], desc: "Um litro de hidratação para academia e esportes." },
  { name: "Copo G2 Stanley Style 900ml", cat: "copos-garrafas", price: 119.9, badge: "new", colors: [["Preto", "#111"], ["Bege", "#cbb89a"], ["Rosa", "#d98aa0"], ["Verde", "#2e4d3a"]], specs: ["Canudo inox", "Alça", "900ml"], desc: "O copo do momento, com canudo de inox e alça." },
  { name: "Copo G2 Transparente Aesthetic", cat: "copos-garrafas", price: 69.9, colors: [["Transparente", "#cfe2ea"], ["Rosa", "#d98aa0"], ["Lilás", "#b39ad9"], ["Azul", "#2a4bb3"]], specs: ["Tritan", "BPA-Free", "700ml"], desc: "Tritan livre de BPA, com alça e canudo." },
  { name: "Garrafa G2 Sports Squeeze", cat: "copos-garrafas", price: 39.9, colors: [["Preto", "#111"], ["Vermelho", "#b32a2a"], ["Azul", "#2a4bb3"]], specs: ["Bico sport", "BPA-Free", "800ml"], desc: "Bico esportivo para hidratar em movimento." },
  { name: "Kit Garrafa + Copo G2", cat: "copos-garrafas", price: 189.9, oldPrice: 209.8, badge: "promo", colors: [["Sortido", "#C9A84C"]], specs: ["Conjunto", "500ml + 900ml", "Kit"], desc: "Garrafa 500ml + copo 900ml em conjunto." },

  // ===== SOM & FONES =====
  { name: "Caixa de Som G2 Bluetooth Portátil", cat: "som-fones", price: 149.9, badge: "new", colors: [["Preto", "#111"], ["Azul", "#2a4bb3"], ["Vermelho", "#b32a2a"]], specs: ["10W RMS", "IPX5", "Bluetooth 5.0"], desc: "10W de potência à prova d'água, com 8h de bateria." },
  { name: "Caixa de Som G2 Mini Pocket", cat: "som-fones", price: 89.9, colors: [["Preto", "#111"], ["Rosa", "#d98aa0"], ["Verde", "#2e4d3a"], ["Laranja", "#FF6B00"]], specs: ["5W", "Mosquetão", "Compacta"], desc: "Ultra compacta com mosquetão de fixação." },
  { name: "Caixa de Som G2 Tower Festa", cat: "som-fones", price: 299.9, badge: "new", colors: [["Preto", "#111"]], specs: ["30W RMS", "LED RGB", "Karaokê"], desc: "30W, LED RGB e entrada para karaokê — a alma da festa." },
  { name: "Fone G2 Bluetooth Over-Ear", cat: "som-fones", price: 179.9, colors: [["Preto", "#111"], ["Branco", "#eee"], ["Vermelho", "#b32a2a"]], specs: ["ANC", "Driver 40mm", "30h"], desc: "Cancelamento de ruído ativo e 30h de autonomia." },
  { name: "Fone G2 In-Ear TWS", cat: "som-fones", price: 129.9, badge: "new", colors: [["Preto", "#111"], ["Branco", "#eee"], ["Rosa", "#d98aa0"]], specs: ["Touch", "IPX4", "Bluetooth 5.3"], desc: "Controle por toque, resistente à água, 24h com o case." },
  { name: "Fone G2 Gamer RGB", cat: "som-fones", price: 149.9, colors: [["Preto RGB", "#1a1a1a"]], specs: ["Driver 50mm", "Microfone", "RGB"], desc: "Imersão total para PC, PS4/5 e Xbox." },
  { name: "Fone G2 Esportivo Sem Fio", cat: "som-fones", price: 99.9, colors: [["Preto", "#111"], ["Azul", "#2a4bb3"], ["Verde", "#2e4d3a"]], specs: ["IPX6", "Gancho", "8h"], desc: "Gancho de orelha e resistência IPX6 para treinar." },
  { name: "Kit Fone G2 TWS + Caixinha", cat: "som-fones", price: 199.9, oldPrice: 219.8, badge: "promo", colors: [["Sortido", "#C9A84C"]], specs: ["TWS + 5W", "Conjunto", "Kit"], desc: "Fone TWS + caixinha de 5W em conjunto." },
];

// Depoimentos de clientes (vira comentário no produto correspondente).
const TESTIMONIALS = [
  { name: "Maria S.", stars: 5, text: "Os óculos são lindos, qualidade incrível! Vale muito a pena, chegou super rápido.", prod: "Óculos G2 Aviador Gold", date: "12 jun 2026" },
  { name: "João P.", stars: 5, text: "Relógio chegou rápido, embalagem caprichada e o produto é ainda mais bonito pessoalmente.", prod: "Relógio G2 Classic Dourado", date: "08 jun 2026" },
  { name: "Ana C.", stars: 5, text: "Amei a mochila, espaçosa e muito bonita. Já é a segunda compra que faço aqui!", prod: "Mochila G2 Urban Pro", date: "02 jun 2026" },
  { name: "Rafael M.", stars: 5, text: "Fone com som absurdo de bom pelo preço. O cancelamento de ruído funciona muito bem.", prod: "Fone G2 Bluetooth Over-Ear", date: "28 mai 2026" },
  { name: "Letícia B.", stars: 4, text: "Bolsa linda e bem feita. Só achei a entrega um pouquinho demorada, mas valeu a pena.", prod: "Bolsa G2 Tote Premium", date: "21 mai 2026" },
  { name: "Carlos E.", stars: 5, text: "Garrafa mantém o gelo o dia inteiro mesmo. Recomendo demais, virou minha companheira.", prod: "Garrafa G2 Térmica 500ml", date: "16 mai 2026" },
];

// Constrói os produtos com campos derivados de forma DETERMINÍSTICA
// (nada de Math.random — assim o seed é estável entre carregamentos).
function buildProducts() {
  return RAW.map((o, i) => {
    const rating = +(4.5 + ((i * 3) % 5) / 10).toFixed(1);
    const reviewsCount = 40 + ((i * 137) % 900);
    // estoque variado, com alguns esgotados e alguns em "últimas unidades"
    let stock = 6 + ((i * 9) % 55);
    if (i % 13 === 6) stock = 0; // esgotado
    else if (i % 7 === 3) stock = 4; // últimas unidades
    const cat = SEED_CATEGORIES.find((c) => c.slug === o.cat);
    const comments = TESTIMONIALS.filter((t) => t.prod === o.name).map((t) => ({
      id: "c" + i + "-" + slugify(t.name),
      name: t.name,
      stars: t.stars,
      text: t.text,
      date: t.date,
    }));
    return {
      id: "p" + (i + 1),
      name: o.name,
      cat: o.cat,
      catName: cat ? cat.name : "",
      hue: cat ? cat.hue : 40,
      price: o.price,
      oldPrice: o.oldPrice || null,
      badge: o.badge || null,
      colors: o.colors || [],
      specs: o.specs || [],
      desc: o.desc || "",
      image: "", // URL de imagem opcional (vazio = placeholder)
      rating,
      reviews: reviewsCount,
      stock,
      active: true,
      comments,
      slug: slugify(o.name),
    };
  });
}

export const SEED_KITS = [
  { id: "k1", name: "Kit G2 Starter", items: "Óculos + Boné + Garrafa", price: 219.9, oldPrice: 249.7 },
  { id: "k2", name: "Kit G2 Premium", items: "Relógio + Bolsa + Fone TWS", price: 449.9, oldPrice: 499.7 },
  { id: "k3", name: "Kit G2 Escola", items: "Mochila + Estojo + Lancheira", price: 249.9, oldPrice: 289.7 },
  { id: "k4", name: "Kit G2 Viagem", items: "Mala M + Mochila + Garrafa Térmica", price: 529.9, oldPrice: 599.7 },
  { id: "k5", name: "Kit G2 Tech", items: "Caixa de Som + Fone TWS + Copo", price: 339.9, oldPrice: 379.7 },
];

export const SEED_REVIEWS = TESTIMONIALS;

export const SEED_BLOG = [
  { tag: "Moda", title: "Como escolher o óculos certo para o seu rosto", date: "28 mai 2026", hue: 38 },
  { tag: "Tecnologia", title: "Os melhores relógios de 2026 por menos de R$ 300", date: "24 mai 2026", hue: 45 },
  { tag: "Moda", title: "Bolsas tendência para o inverno 2026", date: "19 mai 2026", hue: 25 },
  { tag: "Tech", title: "Fone bluetooth ou com fio: qual escolher?", date: "12 mai 2026", hue: 0 },
  { tag: "Viagem", title: "Guia completo de mochilas para viagem", date: "06 mai 2026", hue: 210 },
  { tag: "Lifestyle", title: "Copos e garrafas: hidratação com estilo", date: "01 mai 2026", hue: 190 },
];

export const SEED_SETTINGS = {
  storeName: "G2 IMPÉRIO",
  whatsapp: "5511999990000", // 55 + DDD + número (troque pelo seu WhatsApp Business)
  freeShip: 299,
  cashbackPct: 10,
  pixDiscountPct: 5,
  coupon: "G2IMPERIO10",
  announcement:
    "FRETE GRÁTIS acima de R$ 299  ·  10% de Cashback na próxima compra  ·  Cupom:",
  email: "contato@g2imperio.com.br",
  phoneDisplay: "(11) 9 9999-0000",
  adminPassword: "g2admin", // senha do painel (apenas gate local — troque no painel)
};

export function makeSeed() {
  return {
    version: 1,
    categories: SEED_CATEGORIES.map((c) => ({ ...c })),
    products: buildProducts(),
    kits: SEED_KITS.map((k) => ({ ...k })),
    reviews: SEED_REVIEWS.map((r) => ({ ...r })),
    blog: SEED_BLOG.map((b) => ({ ...b })),
    settings: { ...SEED_SETTINGS },
  };
}
