# Architecture

A static single page with no build step. `index.html` holds the page skeleton and hero copy; `js/main.js` renders the rest of the sections from the content modules in `content/`, then attaches behaviour to the rendered DOM. Styles are plain CSS files joined by `css/main.css`. The CV is a separate LaTeX project in `cv/` whose output PDF is committed to `assets/`.

```text
content/*.js ──> js/render/*  ──> DOM ──> js/features/*
                  (build markup)          (motion, media, form)
cv/*.tex ── make ──> assets/cv.pdf ──> linked from content/contact.js
```

## Stack and runtime

- Language and framework: HTML, CSS and JavaScript ES modules. No framework.
- Runtime: any current browser. Served as static files.
- Package manager: none for the site. `scripts/record-clips.mjs` uses Node, Playwright and ffmpeg, installed only when re-recording clips.
- Entry points: `index.html`, `js/main.js`, `css/main.css`, `cv/Makefile`.

## Layout

```text
index.html             page skeleton, hero copy, meta tags
content/               what the page says, one module per section
js/
  main.js              renders content, then starts features
  render/              build DOM from content: projects, experience, contact, chrome
  features/            behaviour: flock, intro, nav, tabs, media, form
  lib/                 shared helpers: dom.js, icons.js
css/
  main.css             import order (tokens, base, layout, components, effects)
  base/                tokens, reset, focus and skip link
  layout/              body, containers, sections, headings, split grid
  components/          one file per component, in page order
  effects/             entrance animations and the reduced-motion overrides
assets/                logo, project screenshots and clips, CV PDFs
cv/                    LaTeX CV sources and Makefile
scripts/               clip recorder
```

Rule of thumb: content changes touch `content/` only; new markup goes in `js/render/`; new interaction goes in `js/features/`; a new component gets its own CSS file and an import in `css/main.css`.

## Rendering and behaviour

`main.js` runs two passes on `DOMContentLoaded`:

1. **Render.** Each `js/render/` module empties its mount point (an element with a known id in `index.html`) and rebuilds it from content. Text is set with `textContent`, never parsed as HTML.
2. **Behaviour.** `js/features/` modules find the rendered elements by class or role and add listeners. `media.js` must run after the projects render; the others only need the static skeleton.

The hero name stays in `index.html` so it shows without JavaScript and for search engines. An inline script in `<head>` hides it before first paint while the intro animation runs, with a timeout that shows it anyway if the script never loads.

## Motion

- The hero flock (`features/flock.js`) is a boids simulation on a canvas with a fixed timestep. It pauses when the hero is off screen or the tab is hidden, and draws one still frame under `prefers-reduced-motion`.
- Project clips (`features/media.js`) load on first play, play only while on screen, and fall back to the screenshot if the file fails. A shared `<dialog>` shows a clip larger with a small custom player.
- `css/effects/reduced-motion.css` turns every transition off in one place for visitors who ask for reduced motion.

## Integrations

| Integration  | Purpose                       | Auth and validation                                                             | Failure behaviour                                                                             |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| EmailJS      | Sends the contact form        | Public ids in `content/contact.js`; fields validated in the page before sending | The SDK loads on first send; on load or send failure the form shows the email address instead |
| Google Fonts | Bricolage Grotesque and Onest | None                                                                            | Falls back to the system sans-serif                                                           |

## Trust boundaries

The only visitor input is the contact form. It is validated in the page and sent to EmailJS, which applies its own rate limits; nothing is stored or rendered back into the page. The EmailJS ids are public by design. Content modules are trusted repository files, rendered as text.

## Configuration

No environment variables. Everything configurable is in `content/contact.js` (form ids, CV path, links).

## Testing

Not automated. Before publishing, serve the folder, check desktop and phone widths, check with reduced motion on, and watch the console for errors. `cv/Makefile` fails on any LaTeX error.
