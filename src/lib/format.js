/* G2 IMPÉRIO — utilitários de formatação e helpers */

const DIACRITICS = /[̀-ͯ]/g;

export const brl = (n) =>
  "R$ " + (Number(n) || 0).toFixed(2).replace(".", ",");

/** slug amigável a partir de um texto */
export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** normaliza para busca (sem acento, minúsculo) */
export const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "");

/** abre o WhatsApp com uma mensagem pré-preenchida */
export const openWhats = (phone, msg) => {
  const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank", "noopener");
};

/** parcela em 3x */
export const installment = (price) => (Number(price) || 0) / 3;

/** desconto percentual entre preço antigo e atual */
export const discountPct = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
};
