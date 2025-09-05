import { useLayoutEffect } from "react";

/** 把 elRef 的宽/高写到 target 上的 CSS 变量（默认写到它的父元素） */
export function useSizeVars(
  elRef,
  { wVar = "--a-w", hVar = "--a-h" } = {},
  targetRef
) {
  useLayoutEffect(() => {
    const el = elRef.current;
    const target = (targetRef?.current) || el?.parentElement;
    if (!el || !target) return;

    const set = (w, h) => {
      if (wVar) target.style.setProperty(wVar, `${w}px`);
      if (hVar) target.style.setProperty(hVar, `${h}px`);
    };

    const measure = () => {
      const rect = el.getBoundingClientRect(); // 含边框的可视尺寸，更直观
      set(rect.width, rect.height);
    };

    const ro = new ResizeObserver(() => measure());
    measure();          // 初次测量
    ro.observe(el);

    // 视口变化也可能引起换行 → 尺寸变化
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [elRef, targetRef, wVar, hVar]);
}
