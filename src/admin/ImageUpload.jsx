/* G2 IMPÉRIO — Admin: upload de imagem por ANEXO (arquivo).
   A imagem é redimensionada/comprimida no navegador e salva como data URL
   (base64) no localStorage. Quando o Supabase for conectado, basta trocar o
   destino do arquivo — a interface (onChange recebendo a "fonte" da imagem)
   permanece a mesma. */
import { useRef, useState } from "react";

const MAX_DIM = 900; // maior lado da imagem (px)
const QUALITY = 0.82; // qualidade JPEG

export function ImageUpload({ value, onChange, aspect = "1 / 1" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const process = (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      window.alert("Selecione um arquivo de imagem (JPG, PNG, WEBP…).");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w >= h && w > MAX_DIM) {
          h = Math.round((h * MAX_DIM) / w);
          w = MAX_DIM;
        } else if (h > w && h > MAX_DIM) {
          w = Math.round((w * MAX_DIM) / h);
          h = MAX_DIM;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let out;
        try {
          out = canvas.toDataURL("image/jpeg", QUALITY);
        } catch {
          out = reader.result;
        }
        onChange(out);
        setBusy(false);
      };
      img.onerror = () => {
        setBusy(false);
        window.alert("Não foi possível carregar a imagem.");
      };
      img.src = reader.result;
    };
    reader.onerror = () => setBusy(false);
    reader.readAsDataURL(file);
  };

  const onInput = (e) => {
    const f = e.target.files && e.target.files[0];
    process(f);
    e.target.value = "";
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    process(f);
  };

  return (
    <div className="adm-upload">
      {value ? (
        <div className="adm-upload__preview" style={{ aspectRatio: aspect }}>
          <img src={value} alt="Pré-visualização" />
          <button type="button" className="adm-upload__rm" onClick={() => onChange("")} title="Remover imagem">
            ✕
          </button>
        </div>
      ) : (
        <button type="button" className="adm-upload__drop" onClick={() => inputRef.current && inputRef.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          <span>{busy ? "Processando imagem…" : "Clique para enviar uma imagem"}</span>
          <em>ou arraste o arquivo aqui · JPG, PNG, WEBP</em>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onInput} />
      {value && (
        <button type="button" className="g2-btn g2-btn--ghost g2-btn--sm" onClick={() => inputRef.current && inputRef.current.click()} style={{ marginTop: ".6rem" }}>
          Trocar imagem
        </button>
      )}
    </div>
  );
}

/* Galeria com várias imagens (a primeira é a capa). */
export function MultiImageUpload({ images = [], onChange }) {
  const list = Array.isArray(images) ? images : [];
  const add = (src) => src && onChange([...list, src]);
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const makeCover = (i) => {
    const arr = [...list];
    const [x] = arr.splice(i, 1);
    arr.unshift(x);
    onChange(arr);
  };
  return (
    <div>
      {list.length > 0 && (
        <div className="adm-gallery">
          {list.map((src, i) => (
            <div className="adm-gallery__item" key={i}>
              <img src={src} alt={"Imagem " + (i + 1)} />
              {i === 0 && <span className="adm-gallery__cover">Capa</span>}
              <button type="button" className="adm-gallery__rm" onClick={() => removeAt(i)} title="Remover">
                ✕
              </button>
              {i !== 0 && (
                <button type="button" className="adm-gallery__mk" onClick={() => makeCover(i)} title="Definir como capa">
                  ★ capa
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <ImageUpload value="" onChange={add} aspect="1 / 1" />
      <small style={{ color: "var(--g2-muted)", display: "block", marginTop: ".5rem" }}>
        {list.length > 0 ? `${list.length} imagem(ns). A primeira é a capa — passe o mouse para definir outra.` : "Nenhuma imagem — envie a primeira acima."}
      </small>
    </div>
  );
}
