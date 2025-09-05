// src/components/ImageViewer.jsx
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./ImageViewer.css";

export default function openImageViewer({
  images = [],
  startIndex = 0,
  loop = true,
} = {}) {
  if (!Array.isArray(images) || images.length === 0) {
    // 没图直接返回
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);

    const close = (result = null) => {
      root.unmount();
      host.remove();
      resolve(result);
    };

    function Modal() {
      const [idx, setIdx] = useState(
        Math.min(Math.max(0, startIndex | 0), images.length - 1)
      );

      const prev = () => {
        setIdx((i) => (i > 0 ? i - 1 : loop ? images.length - 1 : 0));
      };
      const next = () => {
        setIdx((i) => (i < images.length - 1 ? i + 1 : loop ? 0 : i));
      };

      useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden"; // 锁滚动

        const onKey = (e) => {
          if (e.key === "Escape") close(idx);
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        };
        document.addEventListener("keydown", onKey);

        return () => {
          document.body.style.overflow = prevOverflow;
          document.removeEventListener("keydown", onKey);
        };
      }, [idx]);

      // 预加载相邻图片（简单优化）
      useEffect(() => {
        const preload = (url) => {
          if (!url) return;
          const img = new Image();
          img.src = url;
        };
        preload(images[idx - 1]);
        preload(images[idx + 1]);
      }, [idx]);

      return (
        <div
          className="iv-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => close(idx)}
        >
          <div className="iv-frame" onClick={(e) => e.stopPropagation()}>
            <img
              className="iv-img"
              src={images[idx]}
              alt={`Image ${idx + 1}`}
              draggable={false}
            />

            <button
              className="iv-close"
              onClick={() => close(idx)}
              aria-label="Close"
            >
              ×
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="iv-nav iv-prev"
                  onClick={prev}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  className="iv-nav iv-next"
                  onClick={next}
                  aria-label="Next"
                >
                  ›
                </button>
                <div className="iv-counter">
                  {idx + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    root.render(<Modal />);
  });
}
