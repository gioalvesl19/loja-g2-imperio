# G2 IMPÉRIO — Loja Online 👑

Loja de e-commerce completa (óculos, relógios, bolsas & malas, mochilas, bonés, estojos & lancheiras, copos & garrafas, caixas de som & fones) com **painel administrativo completo** e **checkout via WhatsApp**.

Construída em **React + Vite**. Todo o catálogo é gerenciado pelo painel e salvo no navegador (**localStorage**) — **sem backend/Supabase** por enquanto. Os dados podem ser exportados em JSON a qualquer momento para migração futura.

---

## 🚀 Como rodar

```bash
npm install       # instala dependências
npm run dev       # ambiente de desenvolvimento (http://localhost:5173)
npm run build     # gera a versão de produção em /dist
npm run preview   # pré-visualiza a build de produção
```

## 🔗 Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Loja (vitrine, catálogo, produto, carrinho, sobre, FAQ) |
| `/admin` | Painel do administrador (senha padrão: **`g2admin`**) |

> A senha do painel pode ser alterada em **Admin → Configurações**. É uma proteção **local** (não é autenticação de servidor) — quando o Supabase for conectado, a autenticação migra para lá.

---

## 🛍️ Loja (storefront)

- **Vitrine** com hero rotativo, categorias, marquees de benefícios, vitrines por categoria, avaliações, blog e montador de kit.
- **Catálogo** com filtros (ordenação, faixa de preço, promoção, lançamento, em estoque).
- **Página do produto (PDP)** com galeria, cores, seletor de quantidade (limitado ao estoque), assinatura, cashback, abas (descrição, especificações, cuidados, trocas e **avaliações**).
- **Carrinho** lateral com barra de frete grátis, cross-sell, cashback e **checkout via WhatsApp**.
- **Busca**, **lista de desejos**, **menu mobile** e **barra inferior mobile**.
- Indicadores de **estoque**: "Últimas X unidades" e "Esgotado" (com botão desabilitado).

## 🛠️ Painel administrativo (`/admin`)

Tudo o que foi pedido, completo:

- **Painel/Dashboard** — nº de produtos, categorias, unidades e valor em estoque, esgotados, últimas unidades, avaliações e lista de **reposição de estoque**.
- **Produtos** — CRUD completo com busca e filtros. Para cada produto:
  - Nome, categoria, **descrição/legenda**
  - **Preço**, **preço "De" (desconto)** com cálculo automático de %
  - **Estoque** (unidades)
  - **Selo** (Promoção / Lançamento)
  - **Cores** (nome + cor, ilimitadas)
  - **Especificações/legendas** (tags)
  - **Comentários/avaliações** de clientes (nome, nota, texto)
  - **Nota média** e **nº de avaliações**
  - **Imagem** (URL opcional; usa placeholder se vazio)
  - **Ativo/Inativo**, além de **duplicar** e **excluir**
- **Categorias** — CRUD com cor (matiz), rótulo curto e slug; exclusão protegida quando há produtos vinculados.
- **Avaliações** — visão consolidada de todos os comentários, com adição/remoção.
- **Configurações** — nome da loja, WhatsApp, e-mail, telefone, frete grátis, % de cashback, % de desconto no Pix, cupom, barra de anúncio e senha do painel.
- **Backup** — exportar/importar JSON e restaurar catálogo inicial.

Todas as alterações do painel refletem **na hora** na loja (mesmo entre abas abertas).

---

## 🧱 Estrutura

```
src/
├─ main.jsx                # entrada + roteador loja/admin
├─ styles.css              # design system completo (loja + admin)
├─ lib/
│  ├─ format.js            # brl, slug, whatsapp, desconto…
│  ├─ seed.js              # catálogo inicial (56 produtos, 8 categorias)
│  └─ store.js             # camada de dados localStorage (reativa) + CRUD
├─ components/             # primitivos, layout e carrossel
├─ store/                  # páginas da loja (Home, Collection, Produto, Sobre, FAQ, Overlays)
└─ admin/                  # painel (Dashboard, Produtos, Categorias, Avaliações, Configurações)
```

## ⚙️ Configuração importante

Antes de usar em produção, ajuste em **Admin → Configurações**:

- **WhatsApp**: número no formato `55` + DDD + número (ex.: `5511999990000`). É o número que recebe os pedidos.
- **E-mail, telefone, frete grátis, cashback, cupom** e demais regras comerciais.

## 🗺️ Próximos passos (Supabase)

O projeto está pronto para receber um backend. A camada `src/lib/store.js` isola toda a leitura/escrita de dados — basta substituir as funções de `localStorage` por chamadas ao Supabase, mantendo a mesma interface (`db.addProduct`, `db.updateProduct`, etc.). O botão **Exportar JSON** já entrega os dados prontos para seed.

---

© 2026 G2 Império — Estilo com Atitude.
