# Tiago Simões, portfolio

My developer portfolio: a single page in plain HTML, CSS and JavaScript, with no framework and no build step, plus a CV generated from the same content.

| Hero                                                                          | Experience                                                                 | Selected work                                                                   | Phone                                             |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| ![Hero with the name over a flock of paper-plane boids](docs/images/hero.png) | ![Experience timeline beside the toolkit list](docs/images/experience.png) | ![TedDex project row with phone screenshots and links](docs/images/project.png) | ![The hero at phone width](docs/images/phone.png) |

## Features

- **Live hero:** a boids flocking simulation, adapted from my SimLab project, that flees the cursor and grows on click. It pauses off screen and shows a still frame under reduced motion.
- **Name intro:** the TS logo draws itself and turns into the name on first load.
- **Project clips:** each project plays a short muted loop over its screenshot while on screen, and opens larger in an overlay with a scrubbable player.
- **Experience tabs:** work and education share one panel with an animated, keyboard-accessible switch.
- **Contact form:** validated in the page and sent through EmailJS, with the email address as the fallback.
- **CV in two languages:** English and Portuguese PDFs generated from the site's own content through LaTeX, and served from the page.
- **English and Portuguese:** an EN/PT switch in the nav, with the visitor's browser language as the default and the choice remembered.
- **Content in plain files:** projects, jobs, toolkit and contact details are edited in `content/`, without touching markup, with both languages side by side.

## Stack

HTML, CSS and JavaScript ES modules, served as static files. Fonts from Google Fonts and the contact form through EmailJS. The CV is LaTeX built with `latexmk`. The project clips are recorded with Playwright and ffmpeg.

## Engineering highlights

- **Content separate from code:** `content/` holds only data, `js/render/` turns it into DOM, and `js/features/` adds behaviour, so adding a project or reordering jobs is a one-file edit.
- **Motion that respects the visitor:** the flock and the clips pause when not visible, and one stylesheet (`css/effects/reduced-motion.css`) switches every transition off under `prefers-reduced-motion`.
- **Graceful fallbacks:** the hero name is in the HTML before the intro runs, a broken clip falls back to its screenshot, and a failed send points to the email address.
- **Translations that can't fall behind:** `npm run locales` fails when any text is missing a language or the markup uses an unknown key, so new content can't ship in English only.
- **One source for site and CV:** `npm run cv` writes the CV's LaTeX from `content/` and publishes both PDFs the site links to, so the two never disagree.

## Run it

Requires Python 3 (or any static file server) and a current browser. The scripts are ES modules, so serve the folder rather than opening the file:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

| Command                      | What it does                                                    |
| ---------------------------- | --------------------------------------------------------------- |
| `npm install`                | Install the development tools (oxlint, oxfmt)                   |
| `npm run check`              | Lint, check formatting and check both languages are complete    |
| `npm run format`             | Format the code with oxfmt                                      |
| `npm run locales`            | Only the language check                                         |
| `npm run serve`              | Serve the site at http://localhost:8000                         |
| `npm run cv`                 | Build the English and Portuguese CVs and copy them to `assets/` |
| `npm run cv:en` / `cv:pt`    | Build one CV into `cv/build/` without publishing                |
| `npm run cv:clean`           | Remove the CV build files                                       |
| `npm run clips -- [name...]` | Re-record the project clips from the live sites                 |

## Documentation

- [Editing content](docs/CONTENT.md): where each piece of text lives, common edits, and building the CV
- [Architecture](docs/ARCHITECTURE.md): file layout, rendering, motion, integrations and trust boundaries
- [Recording the project clips](docs/RECORDING_CLIPS.md): the recorder script, scenes and troubleshooting

## Licence and credits

No licence has been chosen, so all rights are reserved. The project screenshots and clips show my own projects. Fonts are Bricolage Grotesque and Onest from Google Fonts, under the SIL Open Font License. The CV class is based on the Medium Length Professional CV template by Trey Hunner, from LaTeXTemplates.com.
