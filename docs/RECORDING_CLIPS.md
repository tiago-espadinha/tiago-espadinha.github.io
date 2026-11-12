# Recording the project clips

Each project card on the page can play a short muted clip of the project in use. The clips live in `assets/projects/<name>.mp4` and are listed as `clip` in `content/projects.js`. They are recorded from the live sites by one script, `scripts/record-clips.mjs`, so a clip can be redone at any time, the same way, in about half a minute.

## What a clip has to be

|           | Target                                       | Why                                                                                                                                   |
| --------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Size      | 1920×1200                                    | The clip viewer is up to 1100 CSS px wide, about 2200 real pixels on a retina screen. Anything much smaller looks soft when expanded. |
| Shape     | 16:10                                        | The shape of the slots on the page. Other shapes get cropped in the card and letterboxed in the viewer.                               |
| Length    | 12 to 20 s                                   | One task, start to finish. It loops, so it should not end on a loading state.                                                         |
| Format    | H.264 MP4, `yuv420p`, `+faststart`, no audio | Plays in every browser, and can start before the whole file has arrived.                                                              |
| File size | about 2 to 4 MB                              | The page sets `preload="none"`, so a clip downloads only when it starts playing.                                                      |

The screenshots next to each clip (`*.webp`) are its poster, the still shown before it plays. A clip should start on roughly the same view as its poster, in the same theme, so the switch is not jarring.

## Quick start

You need Node 20.11 or later and ffmpeg on the `PATH`.

```bash
npm install --no-save playwright   # into node_modules/, which git ignores
npx playwright install chromium    # the browser Playwright drives

node scripts/record-clips.mjs              # all four clips
node scripts/record-clips.mjs nova simlab  # only some: teddex nova medflow simlab
```

Each clip prints a line such as `nova: 321 frames, 15.1s -> assets/projects/nova.mp4`. The new files replace the old ones in place, so check them before committing (see [Checking a clip](#checking-a-clip)).

To use a browser that is already installed instead of Playwright's download:

```bash
CHROME=/path/to/chrome node scripts/record-clips.mjs
```

## How it works

```
live site ──► headless Chromium ──► screencast frames (JPEG + timestamp) ──► ffmpeg ──► .mp4
              driven by a scene       pauses cut out                         30 fps, H.264
```

1. **A scene drives the site.** Playwright opens the live URL in a headless Chromium with a set viewport and device pixel ratio, then plays the project's scene: glide to the search box, type, click a tab, scroll.
2. **Chrome hands over every frame.** Rather than filming the screen, the script asks Chrome for its own screencast (`Page.startScreencast`). Each time the page repaints, Chrome sends that frame as a high-quality JPEG at full device resolution, with the moment it was painted. Nothing is scaled down and nothing is dropped.
3. **Slow parts are cut out.** Page loads and slow network searches are wrapped in `visit()` or `cut()`. While one runs, the recorder ignores frames and later removes that stretch of time, so the clip jumps straight to the loaded page.
4. **ffmpeg re-times and encodes.** The frames are written to a temporary folder with a list that says how long each one stays on screen (the gap to the next frame's timestamp). ffmpeg turns that into a constant 30 fps, scales or pads to 1920×1200, and encodes H.264.

A headless browser draws no mouse pointer, so the script injects a small amber dot that follows the mouse and shrinks a little on each click. It is the site's accent colour, and it shows the viewer where the action is.

## The scenes

Every clip is one entry in the `scenes` object at the top of the script:

```js
nova: {
  url: "https://nova-stream-theta.vercel.app/",
  viewport: { width: 1280, height: 800 }, // CSS pixels the site lays out at
  scale: 1.5,                             // device pixel ratio: 1280×1.5 = 1920 wide
  async run(s) {
    await s.click("#site-search");
    await s.type("dune");
    await s.page.keyboard.press("Enter");
    await loaded(s);                      // cuts the wait for search results
    await s.hold(1400);
    // ...
  },
},
```

| Field         | Meaning                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `url`         | Where recording starts. The page loads and settles (network idle plus 0.8 s) before the first frame.         |
| `viewport`    | The window size in CSS pixels. This decides which layout the site uses (desktop, tablet, phone).             |
| `scale`       | Device pixel ratio. `viewport × scale` is the size of the captured frames.                                   |
| `colorScheme` | Optional, `"dark"` by default. Set it to match the project's screenshots (TedDex uses `"light"`).            |
| `crf`         | Optional, overrides the global `CRF` for this clip (SimLab uses 23, see [Tuning](#tuning-quality-and-size)). |
| `run(s)`      | The steps, using the helpers below.                                                                          |

### Helpers

| Helper                           | What it does                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `s.glide(x, y, ms = 650)`        | Moves the pointer to a point with an ease-in-out curve. Timed by the clock, so it takes `ms` even on a slow page.                       |
| `s.click(target)`                | Waits for the element, scrolls it into view, glides to it and clicks. `target` is a CSS selector or a Playwright locator.               |
| `s.click(null, x, y)`            | Glides to a point and clicks there (for a canvas).                                                                                      |
| `s.type(text)`                   | Types one key at a time, 110 to 180 ms apart, like a person.                                                                            |
| `s.scroll(dy, ms = 900)`         | Wheels by `dy` pixels with easing (negative scrolls up). Scrolls whatever is under the pointer, so glide there first.                   |
| `s.drag([x1, y1], [x2, y2], ms)` | Presses at the first point, glides to the second, releases.                                                                             |
| `s.hold(ms)`                     | Waits while recording, to let the viewer take in a screen.                                                                              |
| `s.visit(url)`                   | Loads another page with the load cut from the clip. Used by SimLab to move between simulations.                                         |
| `s.cut(fn, keep)`                | Runs `fn` (a slow wait) with all but its first `keep` ms cut. `loaded()` uses it to show Nova's spinner for a moment and skip the rest. |
| `s.page`                         | The Playwright page, for anything else (`s.page.keyboard.press("Enter")`, `s.page.getByRole(...)`).                                     |

Prefer selectors a redesign is unlikely to break: roles and names (`getByRole("button", { name: "Moves" })`), labels, placeholders, `href`s. Pick coordinates (for canvases) by taking a screenshot at the scene's viewport.

### Pacing

- A click needs about 0.4 s of travel before it and about 1 to 1.5 s of `hold()` after, or the change is gone before the eye finds it.
- Hold longest on the screen that says most about the project, such as the results grid or the dashboard.
- Aim for 12 to 20 s in total. The script prints the length; trim `hold()`s if it runs long.
- End on a calm, loaded screen. The clip loops back to its first frame.

## Phone-sized projects

TedDex is a phone app, so its scene uses a phone viewport (`384×640`) at `scale: 3` (frames 1152×1920). The script notices that the viewport is taller than it is wide, scales the frames to 1200 px high, and centres them on a 1920×1200 frame filled with `--color-ink-raised` (`#20244a`, the viewer's panel colour). That keeps every clip 16:10 for the page layout.

## Tuning quality and size

`CRF` (Constant Rate Factor) at the top of the script sets the quality of the H.264 encode. Lower means sharper and larger; each step of 6 roughly doubles or halves the file.

| CRF | Use                                                                                       |
| --- | ----------------------------------------------------------------------------------------- |
| 18  | Near lossless. Only for very static UIs.                                                  |
| 20  | The default. Text stays crisp.                                                            |
| 23  | Full-frame motion (simulations, video), where 20 doubles the file without a visible gain. |

`SIZE` sets the output size, and `quality: 92` in `startRecorder` sets the JPEG quality of the captured frames. Neither should need changing.

## Adding a clip for a new project

1. Add a scene named after the clip file, such as `myapp` for `assets/projects/myapp.mp4`.
2. Run `node scripts/record-clips.mjs myapp`.
3. In `content/projects.js`, set the project's `clip` to `"assets/projects/myapp.mp4"`.
4. Check it in the viewer (below). To show only screenshots, set `clip: null`; the card then pans or scrolls the screenshot on hover instead.

## Checking a clip

Watch the whole loop at full size, either in a player or on the site:

```bash
python3 -m http.server 8000   # then open http://localhost:8000 and click the clip
```

Look for:

- **Sharp small text** in the expanded viewer. Zoom the browser to 200% to imitate a retina screen.
- **No loading screens**: spinners, empty grids, error toasts. Live APIs are sometimes slow or down (Nova's game source can time out). If one shows, record that clip again later.
- **A matching start**: the first frame should look like the poster screenshot.
- **Size and length** with `ffprobe -v error -show_entries format=duration,size -of compact assets/projects/<name>.mp4`.

A contact sheet shows the whole clip on one image, one tile every 2 s:

```bash
ffmpeg -i assets/projects/nova.mp4 -vf "fps=1/2,scale=400:-1,tile=5x3" -frames:v 1 sheet.png
```

## Troubleshooting

| Problem                                          | Likely cause and fix                                                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot find package 'playwright'`               | Run `npm install --no-save playwright` in the repo root.                                                                                                         |
| `Executable doesn't exist`                       | Run `npx playwright install chromium`, or point `CHROME` at an installed Chrome.                                                                                 |
| A step times out after 15 s                      | The site changed and the selector no longer matches. Open the site at the scene's viewport and update the selector.                                              |
| `no frames were captured`                        | The page never painted. Check that the URL loads in a normal browser.                                                                                            |
| The clip is much longer than its steps add up to | A wait is not wrapped in `cut()` or `visit()`, or the site was slow. Wrap the wait, or record again.                                                             |
| The clip shows a white flash between pages       | Load the new page with `s.visit(url)`, not `s.page.goto(url)`.                                                                                                   |
| A canvas runs below 60 fps in the clip           | Headless Chrome renders on the CPU. The recorder keeps every frame it gets, so motion is still smooth, but a lighter scene (fewer bodies, a smaller grid) helps. |

## Recording by hand

When a project cannot be scripted (it needs a login, or a real device), record it yourself and encode it to the same spec:

1. Set the browser window to 1280×800 (DevTools device mode works) on a retina screen, or larger on a standard one.
2. Record that area only, with OBS or the system screen recorder, at 30 or 60 fps. Hide the real pointer if the recorder allows it.
3. Encode it:

```bash
ffmpeg -i input.mov \
  -vf "scale=1920:1200:flags=lanczos,fps=30,format=yuv420p" \
  -c:v libx264 -preset slow -crf 20 -profile:v high -movflags +faststart -an \
  assets/projects/<name>.mp4
```

Add `-ss 2 -to 18` before `-i` to trim. For a portrait phone recording, use `scale=-2:1200:flags=lanczos,pad=1920:1200:(ow-iw)/2:0:color=#20244a` in place of the `scale=…` part.
