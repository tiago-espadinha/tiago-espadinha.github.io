#!/usr/bin/env node
/**
 * Records the project clips in assets/projects/*.mp4 from the live sites.
 *
 *   npm install --no-save playwright && npx playwright install chromium
 *   node scripts/record-clips.mjs            # every clip
 *   node scripts/record-clips.mjs nova       # only some: teddex nova medflow simlab
 *
 * Needs ffmpeg on the PATH. Set CHROME=/path/to/chrome to use another browser.
 *
 * How it works: Playwright drives a headless Chromium through one short use
 * case per project (the scenes below). Chrome's own screencast hands over every
 * painted frame as a sharp JPEG at the device pixel ratio, with its timestamp,
 * so the frames are re-timed exactly and encoded to a 30 fps H.264 file at
 * 1920x1200 (16:10, the shape of the slots on the page). Page loads between
 * steps are cut out with pause() / resume(). A small amber dot stands in for
 * the cursor, which headless Chrome does not draw.
 *
 * To change a clip, edit its scene: glide() moves the dot, click() glides then
 * clicks, type() types at a human pace, scroll() wheels smoothly, hold() waits,
 * cut() leaves a slow network wait out of the clip.
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const OUT_DIR = resolve(import.meta.dirname, "../assets/projects");
const SIZE = {
  width: 1920,
  height: 1200,
};
const BACKDROP = "#20244a"; // --color-ink-raised, around the phone-sized clip
const CRF = 20; // lower is sharper and larger; 18 to 23 is the useful range

const scenes = {
  teddex: {
    url: "https://teddex.vercel.app/",
    // A phone viewport at 3x, placed in the middle of the 16:10 frame.
    viewport: {
      width: 384,
      height: 640,
    },
    scale: 3,
    colorScheme: "light", // matches its screenshots
    async run(s) {
      await s.click('input[aria-label="Search Pokémon"]');
      await s.type("char");
      await s.hold(900);
      await s.click('a.mon-card[href="/pokemon/6"]');
      await s.hold(1600);
      await s.glide(192, 420);
      await s.scroll(520);
      await s.hold(1200);
      await s.scroll(-520);
      await s.hold(400);
      await s.click(
        s.page
          .getByRole("tab", {
            name: "Moves",
          })
          .or(
            s.page.getByRole("button", {
              name: "Moves",
              exact: true,
            }),
          )
          .first(),
      );
      await s.hold(900);
      await s.scroll(420);
      await s.hold(1500);
    },
  },

  nova: {
    url: "https://nova-stream-theta.vercel.app/",
    viewport: {
      width: 1280,
      height: 800,
    },
    scale: 1.5,
    async run(s) {
      await s.click("#site-search");
      await s.type("dune");
      await s.page.keyboard.press("Enter");
      await loaded(s);
      await s.hold(1400);
      for (const tab of ["Movies", "Books", "Music"]) {
        await s.click(
          s.page
            .getByRole("button", {
              name: tab,
              exact: true,
            })
            .first(),
        );
        await loaded(s);
        await s.hold(1600);
      }
      await s.glide(640, 520);
      await s.scroll(300);
      await s.hold(1200);
    },
  },

  medflow: {
    url: "https://med-flow-amber.vercel.app/",
    viewport: {
      width: 1280,
      height: 800,
    },
    scale: 1.5,
    async run(s) {
      await s.hold(500);
      await s.click(s.page.locator("button.role-card", { hasText: "Doctor" }));
      await s.hold(400);
      await s.click('input[placeholder="e.g. Sam Rivera"]');
      await s.type("Sam Rivera");
      await s.hold(300);
      await s.click(
        s.page.getByRole("button", {
          name: "Enter workspace",
        }),
      );
      await s.hold(2400);
      await s.glide(760, 330);
      await s.hold(1200);
      await s.click(
        s.page
          .getByRole("link", {
            name: "Admissions",
          })
          .first(),
      );
      await s.hold(1500);
      await s.glide(900, 520, 900);
      await s.glide(900, 600, 600);
      await s.hold(1500);
    },
  },

  simlab: {
    url: "https://simlab.vercel.app/cloth/",
    viewport: {
      width: 1280,
      height: 800,
    },
    scale: 1.5,
    crf: 23, // busy full-frame motion; 20 would double the file for little gain
    async run(s) {
      await s.hold(500);
      await s.drag([700, 200], [980, 520], 1200);
      await s.hold(1200);

      await s.visit("https://simlab.vercel.app/ripple/");
      await s.click(null, 820, 300);
      await s.drag([700, 450], [1000, 500], 800);
      await s.hold(1200);

      await s.visit("https://simlab.vercel.app/n-body/");
      await s.drag([620, 640], [760, 560], 500);
      await s.hold(2000);

      await s.visit("https://simlab.vercel.app/reaction-diffusion/");
      await s.hold(2400);
    },
  },
};

/** Nova Stream: show the spinner for a moment, then cut the rest of the wait. */
async function loaded(s) {
  await s.cut(async () => {
    await s.hold(300);
    await s.page
      .getByText(/Searching live databases/i)
      .first()
      .waitFor({
        state: "hidden",
        timeout: 20000,
      })
      .catch(() => {});
    await s.hold(400); // let the cards fade in
  }, 350);
}

/* ---------- Cursor dot, injected into every page ---------- */

const CURSOR_SCRIPT = `(() => {
  const css = "position:fixed;z-index:2147483647;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;" +
    "border-radius:50%;background:#ffb454;box-shadow:0 0 0 2px rgba(255,255,255,.85),0 2px 8px rgba(0,0,0,.35);" +
    "pointer-events:none;transition:transform .15s ease;";
  const place = (dot, x, y) => (dot.style.translate = x + "px " + y + "px");
  const add = () => {
    const dot = document.createElement("div");
    dot.style.cssText = css;
    const last = JSON.parse(sessionStorage.getItem("__dot") || "null");
    if (last) place(dot, last[0], last[1]); else dot.style.opacity = "0";
    document.documentElement.appendChild(dot);
    addEventListener("mousemove", (e) => {
      dot.style.opacity = "1";
      place(dot, e.clientX, e.clientY);
      sessionStorage.setItem("__dot", JSON.stringify([e.clientX, e.clientY]));
    }, true);
    addEventListener("mousedown", () => (dot.style.transform = "scale(.7)"), true);
    addEventListener("mouseup", () => (dot.style.transform = ""), true);
  };
  if (document.documentElement) add(); else addEventListener("DOMContentLoaded", add);
})();`;

/* ---------- Recorder: Chrome screencast frames, re-timed ---------- */

async function startRecorder(page, dir, maxSize) {
  const cdp = await page.context().newCDPSession(page);
  const frames = []; // { file, t } with t in seconds, pauses removed
  let paused = false;
  let pausedFor = 0;
  let pausedAt = 0;
  let n = 0;

  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
    if (paused) return;
    const file = join(dir, `f${String(n++).padStart(5, "0")}.jpg`);
    writeFileSync(file, Buffer.from(data, "base64"));
    frames.push({
      file,
      t: metadata.timestamp - pausedFor,
    });
  });

  const start = () =>
    cdp.send("Page.startScreencast", {
      format: "jpeg",
      quality: 92,
      ...maxSize,
      everyNthFrame: 1,
    });
  await start();

  return {
    pause() {
      paused = true;
      pausedAt = Date.now() / 1000;
    },
    async resume() {
      // Restarting asks Chrome for a fresh frame even if nothing is moving.
      await cdp.send("Page.stopScreencast");
      pausedFor += Date.now() / 1000 - pausedAt;
      paused = false;
      await start();
    },
    async stop() {
      const end = Date.now() / 1000 - pausedFor;
      await cdp.send("Page.stopScreencast");
      return { frames, end };
    },
  };
}

function encode({ frames, end }, dir, out, fit, crf) {
  if (frames.length < 2) throw new Error("no frames were captured");
  const lines = ["ffconcat version 1.0"];
  frames.forEach((f, i) => {
    const next = frames[i + 1]?.t ?? end;
    lines.push(
      `file '${f.file}'`,
      `duration ${Math.max(next - f.t, 0.001).toFixed(4)}`,
    );
  });
  lines.push(`file '${frames.at(-1).file}'`); // the concat demuxer drops the last duration otherwise
  const list = join(dir, "frames.txt");
  writeFileSync(list, lines.join("\n"));

  const { width: W, height: H } = SIZE;
  const vf = [
    "fps=30",
    fit === "pad"
      ? `scale=-2:${H}:flags=lanczos,pad=${W}:${H}:(ow-iw)/2:0:color=${BACKDROP}`
      : `scale=${W}:${H}:flags=lanczos`,
    "format=yuv420p",
  ].join(",");

  execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      list,
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      String(crf),
      "-profile:v",
      "high",
      "-movflags",
      "+faststart",
      "-an",
      out,
    ],
    { stdio: "inherit" },
  );
}

/* ---------- Scene helpers ---------- */

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function makeStage(page, rec) {
  let x = page.viewportSize().width / 2;
  let y = page.viewportSize().height * 0.6;
  const wait = (ms) => page.waitForTimeout(ms);

  const s = {
    page,
    hold: wait,
    // Movement is timed by the clock, not by step count, so a page that is
    // slow to respond (a busy canvas) still moves at the intended speed.
    async glide(tx, ty, ms = 650) {
      const [sx, sy] = [x, y];
      const t0 = Date.now();
      for (let u = 0; u < 1;) {
        u = Math.min((Date.now() - t0) / ms, 1);
        const k = ease(u);
        await page.mouse.move(sx + (tx - sx) * k, sy + (ty - sy) * k);
        await wait(16);
      }
      [x, y] = [tx, ty];
    },
    /** Glide to a selector or locator (or to x, y when target is null) and click it. */
    async click(target, px, py) {
      if (target) {
        const loc =
          typeof target === "string" ? page.locator(target).first() : target;
        await loc.waitFor({
          state: "visible",
          timeout: 15000,
        });
        await loc.scrollIntoViewIfNeeded();
        const box = await loc.boundingBox();
        px = box.x + Math.min(box.width / 2, 60);
        py = box.y + box.height / 2;
      }
      await s.glide(px, py);
      await wait(150);
      await page.mouse.down();
      await wait(90);
      await page.mouse.up();
    },
    async type(text) {
      for (const ch of text) {
        await page.keyboard.type(ch);
        await wait(110 + Math.random() * 70);
      }
    },
    async scroll(dy, ms = 900) {
      const t0 = Date.now();
      let done = 0;
      for (let u = 0; u < 1;) {
        u = Math.min((Date.now() - t0) / ms, 1);
        const to = dy * ease(u);
        await page.mouse.wheel(0, to - done);
        done = to;
        await wait(16);
      }
    },
    async drag(from, to, ms = 800) {
      await s.glide(...from);
      await page.mouse.down();
      await s.glide(...to, ms);
      await page.mouse.up();
    },
    /** Run a slow step (a network wait) with all but its first `keep` ms cut. */
    async cut(fn, keep = 0) {
      await wait(keep);
      rec.pause();
      await fn();
      await rec.resume();
    },
    /** Load another page with the load itself cut from the clip. */
    async visit(url) {
      rec.pause();
      await page.goto(url, {
        waitUntil: "networkidle",
      });
      await page.mouse.move(x, y); // put the dot back where it was
      await wait(400);
      await rec.resume();
    },
  };
  return s;
}

/* ---------- Main ---------- */

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(scenes);
const unknown = names.filter((n) => !scenes[n]);
if (unknown.length) {
  console.error(
    `Unknown clip: ${unknown.join(", ")}. Known: ${Object.keys(scenes).join(", ")}`,
  );
  process.exit(1);
}

const browser = await chromium.launch(
  process.env.CHROME
    ? {
        executablePath: process.env.CHROME,
      }
    : {},
);
try {
  for (const name of names) {
    const scene = scenes[name];
    const dir = mkdtempSync(join(tmpdir(), `clip-${name}-`));
    const context = await browser.newContext({
      viewport: scene.viewport,
      deviceScaleFactor: scene.scale,
      colorScheme: scene.colorScheme ?? "dark",
      reducedMotion: "no-preference",
    });
    await context.addInitScript(CURSOR_SCRIPT);
    const page = await context.newPage();
    await page.goto(scene.url, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(800); // let entrance animations finish before recording

    const pixels = {
      maxWidth: Math.round(scene.viewport.width * scene.scale),
      maxHeight: Math.round(scene.viewport.height * scene.scale),
    };
    const rec = await startRecorder(page, dir, pixels);
    const started = Date.now();
    await scene.run(makeStage(page, rec));
    const result = await rec.stop();
    await context.close();

    const out = join(OUT_DIR, `${name}.mp4`);
    const fit =
      scene.viewport.width / scene.viewport.height < 1 ? "pad" : "fill";
    encode(result, dir, out, fit, scene.crf ?? CRF);
    rmSync(dir, {
      recursive: true,
      force: true,
    });
    const secs = (result.end - result.frames[0].t).toFixed(1);
    console.log(
      `${name}: ${result.frames.length} frames, ${secs}s -> ${out} (took ${((Date.now() - started) / 1000).toFixed(0)}s)`,
    );
  }
} finally {
  await browser.close();
}
