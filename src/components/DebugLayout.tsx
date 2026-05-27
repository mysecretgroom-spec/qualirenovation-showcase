import { useEffect, useState } from "react";

/**
 * Debug layout overlay.
 * Activate by adding `?debug=layout` to the URL (or pressing Alt+D).
 * - Adds colored outlines on every element (different color per tag).
 * - Shows a fixed badge with the hovered element's tag, classes and size.
 * - Highlights elements that have white/transparent backgrounds AND take real space,
 *   which helps locate "blank zones".
 */
const STYLE_ID = "__debug-layout-style";

const css = `
  /* Outline every element */
  body.debug-layout * { outline: 1px solid rgba(255,0,0,0.25) !important; }
  body.debug-layout main { outline: 2px solid #2563eb !important; }
  body.debug-layout header { outline: 2px solid #16a34a !important; }
  body.debug-layout footer { outline: 2px solid #ca8a04 !important; }
  body.debug-layout section { outline: 2px dashed #db2777 !important; }
  body.debug-layout aside { outline: 2px solid #9333ea !important; }
  body.debug-layout nav { outline: 2px solid #0891b2 !important; }
  body.debug-layout div { outline: 1px solid rgba(59,130,246,0.4) !important; }

  /* Tag label badges on sections */
  body.debug-layout section::before,
  body.debug-layout main::before,
  body.debug-layout header::before,
  body.debug-layout footer::before,
  body.debug-layout aside::before,
  body.debug-layout nav::before {
    content: attr(data-debug-tag);
    position: absolute;
    z-index: 99999;
    background: rgba(0,0,0,0.85);
    color: #fff;
    padding: 2px 6px;
    font: 11px/1 monospace;
    border-radius: 3px;
    margin-top: -1px;
    pointer-events: none;
  }

  /* Mark "blank" wide elements: visible, large, no background image, white-ish bg */
  body.debug-layout [data-debug-blank="true"] {
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 0, 0, 0.08) 0 10px,
      rgba(255, 200, 0, 0.12) 10px 20px
    ) !important;
    outline: 3px solid #dc2626 !important;
  }

  #debug-layout-hud {
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 999999;
    background: rgba(0,0,0,0.9);
    color: #fff;
    padding: 8px 12px;
    font: 12px/1.4 monospace;
    border-radius: 6px;
    max-width: 360px;
    pointer-events: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  #debug-layout-hud .k { color: #93c5fd; }
  #debug-layout-hud .warn { color: #fca5a5; }
`;

function isLikelyBlank(el: Element): boolean {
  const rect = (el as HTMLElement).getBoundingClientRect();
  if (rect.width < 80 || rect.height < 80) return false;
  const style = window.getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none") return false;
  if (style.backgroundImage && style.backgroundImage !== "none") return false;
  const bg = style.backgroundColor;
  // detect white-ish backgrounds
  const m = bg.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
  const [r, g, b, a = 1] = parts;
  if (a < 0.5) return false;
  if (r > 240 && g > 240 && b > 240) {
    // and has (almost) no text content
    const text = (el.textContent || "").trim();
    if (text.length < 5) return true;
  }
  return false;
}

const DebugLayout = () => {
  const [enabled, setEnabled] = useState(false);
  const [hud, setHud] = useState<string>("Survolez un élément…");

  // Read ?debug=layout
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("debug") === "layout") setEnabled(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "d") {
        setEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("debug-layout");
      document.getElementById(STYLE_ID)?.remove();
      return;
    }
    document.body.classList.add("debug-layout");
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Tag landmark elements + scan for blank zones
    const scan = () => {
      document.querySelectorAll("section,main,header,footer,aside,nav").forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const cls = el.className && typeof el.className === "string"
          ? "." + el.className.split(/\s+/).slice(0, 2).join(".")
          : "";
        el.setAttribute("data-debug-tag", `${tag}${id}${cls}`);
      });
      document.querySelectorAll("body *").forEach((el) => {
        if (isLikelyBlank(el)) el.setAttribute("data-debug-blank", "true");
        else el.removeAttribute("data-debug-blank");
      });
    };
    scan();
    const interval = window.setInterval(scan, 1500);

    const onMove = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el || !el.getBoundingClientRect) return;
      const r = el.getBoundingClientRect();
      const cls = typeof el.className === "string" ? el.className : "";
      const blank = el.getAttribute("data-debug-blank") === "true";
      setHud(
        `<span class="k">tag</span> ${el.tagName.toLowerCase()}` +
          (el.id ? `  <span class="k">id</span> ${el.id}` : "") +
          `<br/><span class="k">cls</span> ${cls.slice(0, 80) || "—"}` +
          `<br/><span class="k">size</span> ${Math.round(r.width)}×${Math.round(r.height)} @ ${Math.round(r.left)},${Math.round(r.top)}` +
          (blank ? `<br/><span class="warn">⚠ zone blanche détectée</span>` : "")
      );
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      id="debug-layout-hud"
      dangerouslySetInnerHTML={{ __html: `<strong>DEBUG LAYOUT</strong> (Alt+D pour quitter)<br/>${hud}` }}
    />
  );
};

export default DebugLayout;