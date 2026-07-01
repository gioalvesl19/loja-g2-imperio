/* G2 IMPÉRIO — carrossel horizontal com setas */
import { useRef } from "react";

export function Rail({ children, className }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };
  return (
    <div className="g2-rail">
      <button className="g2-rail__arrow g2-rail__arrow--prev" onClick={() => scroll(-1)} aria-label="Anterior">
        ‹
      </button>
      <div className={"g2-rail__track " + (className || "")} ref={ref}>
        {children}
      </div>
      <button className="g2-rail__arrow g2-rail__arrow--next" onClick={() => scroll(1)} aria-label="Próximo">
        ›
      </button>
    </div>
  );
}
