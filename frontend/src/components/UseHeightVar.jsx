import { useLayoutEffect } from "react";

/** 把 elRef 当前高度写入 target 上的 CSS 变量（默认写到它的父元素） */
export function useHeightVar(elRef, varName = "--a-h", targetRef) {
  useLayoutEffect(() => {
    const el = elRef.current;
    const target = (targetRef?.current) || el?.parentElement;
    if (!el || !target) return;

    const update = (h) => target.style.setProperty(varName, `${h}px`);
    const ro = new ResizeObserver(([entry]) => {
      update(entry.contentRect.height);
    });

    // 初次 & 监听
    update(el.getBoundingClientRect().height);
    ro.observe(el);

    // 视口变化也触发一次（字体/换行可能变高）
    const onResize = () => update(el.getBoundingClientRect().height);
    window.addEventListener("resize", onResize);

    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [elRef, varName, targetRef]);
}
