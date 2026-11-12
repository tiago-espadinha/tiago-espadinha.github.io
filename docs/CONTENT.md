# Editing content

Everything the page says lives in two places: `content/` for the site and `cv/` for the PDF CV. Neither needs a build step for the site to pick it up, except the CV PDF.

## Site content

| File | What it holds |
| --- | --- |
| `content/projects.js` | Selected work: one entry per project, shown in array order |
| `content/experience.js` | `work` and `education`, the two tabs of the Experience section |
| `content/toolkit.js` | The Toolkit list beside Experience |
| `content/contact.js` | Email, profile links, the contact form ids and the CV path |
| `index.html` | The hero name and lede, the page title and the share preview text |

Each file starts with a comment that describes its fields.

### Common edits

- **Reorder:** move the entry inside its array. The page follows array order everywhere.
- **Hide something for now:** comment the entry out. Nothing else references it.
- **Add a job or a degree:** copy an entry in `content/experience.js` and put it first, so the newest stays on top.
- **Add a project:**
  1. Put screenshots in `assets/projects/` as `.webp`. One desktop shot for `layout: "wide"`, two phone shots for `layout: "phones"`.
  2. Copy an entry in `content/projects.js` and give it a unique `id`.
  3. Optionally record a clip (see [Recording the project clips](RECORDING_CLIPS.md)) and set `clip`, or set `clip: null` to show the screenshots only.
- **Add a profile link:** add an entry to `links` in `content/contact.js`. Its `icon` must be a name from `js/lib/icons.js`; add an SVG there if needed.
- **Add a nav link:** add an `<li>` to `.nav-links` in `index.html` that points at a section id. The nav indicator picks it up on its own.

Check the result with a local server (see the README), at phone width too.

## CV

The CV is LaTeX in `cv/`, in English (`cv-en.tex`) and Portuguese (`cv-pt.tex`). The header (name, phone, links) and page setup are shared in `cv/preamble.tex`, and the visual style is in `cv/resume.cls`.

```bash
cd cv
make          # builds both and copies them to assets/cv.pdf and assets/cv-pt.pdf
make en       # builds one language into cv/build/ without publishing
make clean    # removes cv/build/
```

It needs a TeX distribution with `latexmk` and `pdflatex` (TeX Live, for example). Commit the updated `assets/cv*.pdf` with the `.tex` change, since the site serves the PDF as a static file.

Sections use the `rSection` environment and entries use `\entry{title}{dates}{description}`. Keep each language to one page: run `make` and check the page count after an edit.

When the site and the CV describe the same job or project, update both: the site's `content/` and the CV's `.tex` files are separate on purpose, because the CV carries details the site doesn't (phone, dissertation, workshops) and comes in two languages.
