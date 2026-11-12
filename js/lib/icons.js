/** Inline SVG icons, 24x24, one outline style, drawn in the current text colour. */
const STROKE =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  // A paper plane, pointed like the boids in the hero.
  mail: `<svg ${STROKE}><path d="M21.5 2.5 15 21l-4.5-7.5L3 9z"/><path d="M21.5 2.5l-11 11"/></svg>`,
  github: `<svg ${STROKE}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  linkedin: `<svg ${STROKE}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  download: `<svg ${STROKE}><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>`,
  arrowUp: `<svg ${STROKE}><path d="M12 19V5m-6 6 6-6 6 6"/></svg>`,
  arrowDown: `<svg ${STROKE}><path d="M12 5v14m-6-6 6 6 6-6"/></svg>`,
  check: `<svg ${STROKE}><path d="M5 12.5 10 17.5 19 7"/></svg>`,
  alert: `<svg ${STROKE}><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>`,
  arrowUpRight: `<svg ${STROKE}><path d="M7 17 17 7M8 7h9v9"/></svg>`,
  expand: `<svg ${STROKE}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`,
  close: `<svg ${STROKE}><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  // Solid, so they read at a glance over a moving clip.
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5a.8.8 0 0 0-1.2.7z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>`,
};

/** Returns the icon as an element. It is decorative: label the link itself. */
export function icon(name) {
  const wrap = document.createElement("span");
  wrap.className = "icon";
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = ICONS[name] ?? "";
  return wrap;
}
