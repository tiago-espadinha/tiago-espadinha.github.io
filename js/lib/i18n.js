/**
 * Languages. Any text the page shows is either a plain string, the same in
 * every language (a name, a technology), or an object with one string per
 * locale: { en: "Work", pt: "Projetos" }. t() picks the current one and falls
 * back to English when a translation is missing.
 *
 * The inline script in index.html picks the locale before first paint (from
 * ?lang=, then the saved choice, then the browser language) and stores it as
 * <html data-locale>. Keep its list in step with LOCALES.
 */
export const LOCALES = ["en", "pt"];
export const DEFAULT_LOCALE = "en";

/** The locale chosen by index.html, or English. */
export function locale() {
  const chosen = document.documentElement.dataset.locale;
  return LOCALES.includes(chosen) ? chosen : DEFAULT_LOCALE;
}

/**
 * Text in the current locale. `{name}` placeholders are filled from
 * `params`: t({ en: "Hi {name}" }, { name: "Ana" }).
 */
export function t(text, params) {
  return translate(text, locale(), params);
}

/** t() for a given locale, so the CV build can use it outside the browser. */
export function translate(text, lang, params) {
  let value = text;
  if (value && typeof value === "object")
    value = value[lang] ?? value[DEFAULT_LOCALE];
  if (typeof value !== "string") return "";
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, key) => params[key] ?? match);
}

/** The entry at a dotted path ("nav.work") in a nested object. */
export function lookup(strings, path) {
  return path.split(".").reduce((node, key) => node?.[key], strings);
}

/**
 * Translate the static markup in index.html:
 *   data-i18n="nav.work"                        sets the text
 *   data-i18n-attr="aria-label:nav.brand; ..."  sets attributes
 * Text and attributes are set as plain text, never parsed as HTML. A missing
 * key leaves the English already in the markup.
 */
export function translatePage(strings) {
  const resolve = (key) => {
    const entry = lookup(strings, key);
    if (entry === undefined) console.warn(`Missing UI string: ${key}`);
    return entry === undefined ? null : t(entry);
  };

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const text = resolve(node.dataset.i18n);
    if (text !== null) node.textContent = text;
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
    node.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((part) => part.trim());
      const text = resolve(key);
      if (attr && text !== null) node.setAttribute(attr, text);
    });
  });
}

/**
 * Save the choice and reload in the other language. The URL carries the
 * locale so the page can be shared in it. The intro is skipped on the way
 * back in, since the visitor has already seen it.
 */
export function switchLocale(next) {
  try {
    localStorage.setItem("locale", next);
    sessionStorage.setItem("skip-intro", "1");
  } catch {
    // Storage blocked: the ?lang= in the URL still carries the choice.
  }
  const url = new URL(location.href);
  url.searchParams.set("lang", next);
  history.replaceState(history.state, "", url);
  location.reload();
}
