# Editing content

Everything the page and the CV say lives in `content/`. The site reads it directly with no build step; the CV PDF is built from it with `npm run cv` (see [CV](#cv)).

## Site content

| File                    | What it holds                                                         |
| ----------------------- | --------------------------------------------------------------------- |
| `content/projects.js`   | Selected work: one entry per project, shown in array order            |
| `content/experience.js` | `work` and `education`, the two tabs of the Experience section        |
| `content/toolkit.js`    | The Toolkit list beside Experience                                    |
| `content/contact.js`    | Email, profile links, the contact form ids and the CV path            |
| `content/ui.js`         | Interface text: nav, hero lede, headings, labels, form messages       |
| `content/cv.js`         | What only the CV shows: phone, extra skills, workshops, its headings  |
| `index.html`            | The page skeleton and the hero name; its English text is the fallback |

Each file starts with a comment that describes its fields.

## Languages

The site is in English and Portuguese (European). A visitor gets `?lang=` from the URL first, then the language they last picked with the EN/PT switch in the nav, then their browser language, and English otherwise. Links like `/?lang=pt` share the page in one language.

Every piece of text that needs translating is written in both languages side by side:

```js
summary: {
  en: "One search box for films, series, music, books and games.",
  pt: "Uma só pesquisa para filmes, séries, música, livros e jogos.",
},
```

Names that read the same in both (project titles, technologies, handles) stay plain strings. Which fields need `{ en, pt }` is listed in each file's header comment. Interface text that the HTML shows is in `content/ui.js` and linked from the markup with `data-i18n="nav.work"` (text) or `data-i18n-attr="aria-label: nav.brand"` (attributes).

### Keeping both languages up to date

When you add or change text, write the Portuguese next to the English in the same edit, then run:

```bash
npm run locales
```

It fails, naming the exact path, when an entry is missing a language, when a field that must be translated is a plain string, when the languages use different `{placeholders}`, when the HTML or a script uses a UI key that `content/ui.js` doesn't have, or when a CV PDF is missing. It also runs as part of `npm run check`. If a translation is missing at runtime anyway, the page shows the English rather than nothing.

To add a third language, add its code to `LOCALES` in `js/lib/i18n.js` and to the list in the inline script in `index.html`, then run `npm run locales`: it lists every entry that needs the new language.

### Common edits

- **Reorder:** move the entry inside its array. The page follows array order everywhere.
- **Hide something for now:** comment the entry out. Nothing else references it.
- **Add a job or a degree:** copy an entry in `content/experience.js` and put it first, so the newest stays on top. Set `to: null` while it's ongoing. Then run `npm run cv`, since the CV lists it too.
- **Add a project:**
  1. Put screenshots in `assets/projects/` as `.webp`. One desktop shot for `layout: "wide"`, two phone shots for `layout: "phones"`.
  2. Copy an entry in `content/projects.js`, give it a unique `id`, and write the text fields in both languages.
  3. Optionally record a clip (see [Recording the project clips](RECORDING_CLIPS.md)) and set `clip`, or set `clip: null` to show the screenshots only.
- **Add a profile link:** add an entry to `links` in `content/contact.js`. Its `icon` must be a name from `js/lib/icons.js`; add an SVG there if needed.
- **Add a nav link:** add an `<li>` to `.nav-links` in `index.html` that points at a section id. The nav indicator picks it up on its own.

Check the result with a local server (see the README), at phone width too.

## CV

The CV is built from the same content as the site, so the two can't disagree. `scripts/build-cv.mjs` reads `content/` and writes the LaTeX for each language into `cv/build/`, and LaTeX turns it into a PDF:

| CV section | Comes from                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Header     | `content/cv.js` (name, phone, city) and `content/contact.js` (email, GitHub)                   |
| Experience | `work` in `content/experience.js`                                                              |
| Projects   | `content/projects.js`, in site order, title linked to `liveUrl`                                |
| Education  | `education` in `content/experience.js`                                                         |
| Skills     | Toolkit groups in `content/toolkit.js` without `onCv: false`, then `skills` in `content/cv.js` |
| Workshops  | `workshops` in `content/cv.js`                                                                 |

The CV reuses the site's text unless an entry has a `cv: { en, pt }` field, which replaces it on the CV only (projects use this for their shorter one-line blurbs, and can set `cvStack` for fewer tags). CV text can use `*italic*`, `**bold**` and a blank line for a new paragraph. Anything only the CV shows goes in `content/cv.js`.

```bash
npm run cv        # builds both and copies them to assets/tiago_simoes-cv_en.pdf and _pt.pdf
npm run cv:en     # builds one language into cv/build/ without publishing
npm run cv:clean  # removes cv/build/
```

It needs Node and a TeX distribution with `latexmk` and `pdflatex` (TeX Live, for example). Commit the updated `assets/tiago_simoes-cv_*.pdf` with the content change, since the site serves the PDF as a static file. The page setup and the `\entry` layout are in `cv/preamble.tex`, and the visual style is in `cv/resume.cls`.

Keep each language to one page: run `npm run cv` and check the page count after an edit. The LaTeX log line `Output written on ... (1 page ...)` shows it.
