import { ui } from "../../content/ui.js";
import { LOCALES, locale, switchLocale, t } from "../lib/i18n.js";

/**
 * The nav's language switch: a badge with the current language's code. A
 * plain click slides the other code up into the badge (see .lang-switch in
 * css/components/nav.css), then switches (see switchLocale). A modified
 * click opens the page in that language in a new tab through the ?lang= link.
 */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
// Fallback in case transitionend never fires (tab hidden mid-slide).
const SLIDE_MS = 450;

export function initLanguageSwitch() {
  const link = document.getElementById("lang-switch");
  if (!link) return;

  const next = LOCALES.find((tag) => tag !== locale());
  link.href = `?lang=${next}`;
  link.hreflang = next;
  link.setAttribute("aria-label", t(ui.language.switchLabel));

  const nextFace = face("lang-next", ui.language.code[next], next);
  link.replaceChildren(
    face("lang-current", t(ui.language.code), locale()),
    nextFace,
  );
  link.hidden = false;

  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return;
    e.preventDefault();
    if (link.classList.contains("is-switching")) return;
    if (reducedMotion.matches) {
      switchLocale(next);
      return;
    }

    link.classList.add("is-switching");
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      switchLocale(next);
    };
    nextFace.addEventListener("transitionend", go, { once: true });
    setTimeout(go, SLIDE_MS);
  });
}

/** One code in the badge. Decorative: the link is named by aria-label. */
function face(className, text, lang) {
  const span = document.createElement("span");
  span.className = `lang-face ${className}`;
  span.lang = lang;
  span.setAttribute("aria-hidden", "true");
  span.textContent = text;
  return span;
}
