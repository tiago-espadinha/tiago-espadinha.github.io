import { ui } from "../../content/ui.js";
import { t } from "../lib/i18n.js";
import { icon } from "../lib/icons.js";

/**
 * Project media. A project with a clip (content/projects.js `clip`) plays it muted and
 * looping while it is on screen, over the screenshot that acts as its poster.
 * Clicking the clip opens it larger in an overlay, with the project's links.
 * A project without one lets the visitor look around the screenshot on hover.
 * Either way the shot tilts slightly under the cursor.
 */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function initProjectMedia() {
  const shots = [...document.querySelectorAll(".project-shot")];
  trackAmbientPointer(shots);
  shots.forEach((shot) => {
    trackPointer(shot);
    const video = shot.querySelector("video");
    if (video) setupClip(shot, video);
    else setupPan(shot);
  });
}

function setupClip(shot, video) {
  // Under reduced motion the clip stays on its poster screenshot.
  const autoplay = () => {
    if (!reducedMotion.matches) video.play().catch(() => {});
  };

  video.addEventListener("playing", () => {
    shot.classList.add("has-frame"); // reveal the video over the poster
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) autoplay();
      else video.pause();
    },
    { threshold: 0.6 },
  );
  observer.observe(shot);
  shot.addEventListener("pointerenter", autoplay);

  // The whole shot is one button that opens the clip in the overlay.
  const title =
    shot.closest(".project")?.querySelector("h3")?.textContent ?? "";
  const expand = document.createElement("button");
  expand.type = "button";
  expand.className = "shot-expand";
  expand.setAttribute("aria-label", t(ui.work.expandClip, { title }));
  const badge = document.createElement("span");
  badge.className = "shot-expand-icon";
  badge.appendChild(icon("expand"));
  expand.appendChild(badge);
  expand.addEventListener("click", () => openViewer(shot, video, title));
  shot.appendChild(expand);

  // A missing or broken file falls back to the screenshot.
  video.addEventListener(
    "error",
    () => {
      observer.disconnect();
      shot.removeEventListener("pointerenter", autoplay);
      video.remove();
      expand.remove();
      shot.classList.remove("has-frame");
      setupPan(shot);
    },
    { once: true },
  );
}

/**
 * One shared <dialog> shows a clip larger, with a small custom player: click
 * the clip to pause or play, drag the line under it to scrub. The clips have
 * no sound and never need full screen, so there are no other controls. The
 * native dialog handles Esc, focus trapping and returning focus to the clip
 * that opened it.
 */
let viewer;

function getViewer() {
  if (viewer) return viewer;

  const dialog = document.createElement("dialog");
  dialog.className = "clip-viewer";
  dialog.innerHTML = `
    <div class="clip-viewer-panel">
      <div class="clip-viewer-stage">
        <video class="clip-viewer-video" muted loop playsinline></video>
        <button type="button" class="clip-viewer-toggle"></button>
        <span class="clip-viewer-flash" aria-hidden="true"></span>
      </div>
      <input class="clip-viewer-progress" type="range" min="0" max="1" step="any" value="0" />
      <div class="clip-viewer-bar">
        <h3 class="clip-viewer-title"></h3>
        <div class="clip-viewer-links"></div>
      </div>
    </div>`;

  dialog
    .querySelector(".clip-viewer-progress")
    .setAttribute("aria-label", t(ui.work.clipPosition));

  const close = document.createElement("button");
  close.type = "button";
  close.className = "clip-viewer-close";
  close.setAttribute("aria-label", t(ui.work.close));
  close.appendChild(icon("close"));
  close.addEventListener("click", () => dialog.dismiss());
  // Inside the stage, so it rides along with the clip as it swings in and
  // out. First in the stage, so the dialog still focuses it on open.
  dialog.querySelector(".clip-viewer-stage").prepend(close);

  // A click on the dimmed backdrop (the dialog itself, outside the panel) closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.dismiss();
  });
  // Esc swings the clip back too. If the browser will not let Esc be held
  // (no click since opening), the dialog just closes and "close" tidies up.
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    dialog.dismiss();
  });

  const video = dialog.querySelector("video");
  const toggle = dialog.querySelector(".clip-viewer-toggle");
  const flash = dialog.querySelector(".clip-viewer-flash");
  const progress = dialog.querySelector(".clip-viewer-progress");

  // Play / pause, with a centred icon that fades out after a moment.
  let flashTimer;
  const showFlash = (name, hold = false) => {
    flash.replaceChildren(icon(name));
    flash.classList.add("is-shown");
    clearTimeout(flashTimer);
    if (!hold)
      flashTimer = setTimeout(() => flash.classList.remove("is-shown"), 700);
  };
  const syncToggle = () => {
    toggle.setAttribute(
      "aria-label",
      t(video.paused ? ui.work.play : ui.work.pause),
    );
  };
  toggle.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
      showFlash("play");
    } else {
      video.pause();
      showFlash("pause");
    }
  });
  video.addEventListener("play", syncToggle);
  video.addEventListener("pause", syncToggle);

  // Progress line: follows the clip every frame, and seeks when dragged.
  let scrubbing = false;
  let frame;
  const paint = () => {
    progress.style.setProperty(
      "--p",
      `${(progress.value / (progress.max || 1)) * 100}%`,
    );
  };
  const follow = () => {
    if (!scrubbing && video.duration) {
      progress.value = video.currentTime;
      paint();
    }
    frame = requestAnimationFrame(follow);
  };
  video.addEventListener("loadedmetadata", () => {
    progress.max = video.duration;
    paint();
  });
  progress.addEventListener("pointerdown", () => (scrubbing = true));
  progress.addEventListener("pointerup", () => (scrubbing = false));
  progress.addEventListener("input", () => {
    video.currentTime = Number(progress.value);
    paint();
  });
  // Arrow keys step a twentieth of the clip rather than a sliver of a second.
  progress.addEventListener("keydown", (e) => {
    const dir = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
    }[e.key];
    if (!dir || !video.duration) return;
    e.preventDefault();
    const time =
      (video.currentTime + (dir * video.duration) / 20 + video.duration) %
      video.duration;
    video.currentTime = time;
    progress.value = time;
    paint();
  });

  const swing = createSwing(dialog);
  dialog.swingIn = swing.open;
  dialog.dismiss = swing.dismiss;

  dialog.addEventListener("close", () => {
    swing.reset();
    cancelAnimationFrame(frame);
    clearTimeout(flashTimer);
    flash.classList.remove("is-shown");
    video.pause();
    video.removeAttribute("src");
    video.load();
    progress.value = 0;
    paint();
    document.documentElement.classList.remove("has-viewer");
  });

  dialog.startFollowing = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(follow);
  };
  dialog.showFlash = showFlash;
  dialog.syncToggle = syncToggle;

  document.body.appendChild(dialog);
  viewer = dialog;
  return dialog;
}

function openViewer(shot, inlineVideo, title) {
  const dialog = getViewer();
  const video = dialog.querySelector("video");

  dialog.setAttribute("aria-label", t(ui.work.viewerLabel, { title }));
  dialog.querySelector(".clip-viewer-title").textContent = title;
  video.src = inlineVideo.currentSrc || inlineVideo.src;
  video.setAttribute(
    "aria-label",
    inlineVideo.getAttribute("aria-label") ?? "",
  );

  // Reuse the project's own live and code links.
  const links = dialog.querySelector(".clip-viewer-links");
  links.innerHTML = "";
  const row = shot.closest(".project")?.querySelector(".link-row");
  if (row) links.appendChild(row.cloneNode(true));

  document.documentElement.classList.add("has-viewer");
  dialog.showModal();
  dialog.swingIn(shot, inlineVideo);
  dialog.startFollowing();
  // Pick up where the inline clip was. Under reduced motion, wait for a
  // click, and keep the play icon up until then so it is clear how.
  video.currentTime = inlineVideo.currentTime || 0;
  if (reducedMotion.matches) dialog.showFlash("play", true);
  else video.play().catch(() => {});
  dialog.syncToggle();
}

/**
 * The clip swings between its place on the page and the overlay like a card
 * turned in a hand. One number, the progress p (0 = in the page, 100 = in the
 * overlay), drives everything: the travel, the scale, and a rotation about a
 * point well below the clip. Because the tilt and the arc come from that one
 * rotation, they cannot drift apart. The rotation is zero at both ends, so the
 * clip is level when it leaves and when it lands. A spring moves p, so the
 * clip lands a touch past flat and settles. The idea is from bencho.dev's card stack.
 */
// Per frame: k pulls toward the target, d is the share of velocity kept.
// Damping ratio = -ln(d) / (2 * sqrt(k)). Soft enough that the swing across
// half the screen reads as a swing, not a jump.
const OPEN_SPRING = {
  k: 0.05,
  d: 0.765,
}; // ratio ~0.6: lands a touch past flat
const CLOSE_SPRING = {
  k: 0.045,
  d: 0.712,
}; // ~0.8: drops into its slot without bouncing out
const PIVOT_REACH = 1.25; // pivot sits this many clip heights below the clip
const MAX_TILT = 14; // degrees, for a clip at the edge of the viewport
const RADIUS = 14; // px, matches --radius

function createSwing(dialog) {
  const panel = dialog.querySelector(".clip-viewer-panel");
  const stage = dialog.querySelector(".clip-viewer-stage");
  const video = dialog.querySelector("video");

  let shot = null;
  let inlineVideo = null;
  let geo = null;
  let p = 0;
  let v = 0;
  let raf = 0;
  let leaving = false;

  /* Where the stage has to start so it sits over the shot, measured with the
     panel at rest. The rotation's own sideways and downward travel is taken
     off the straight-line offset, so p = 0 lands exactly on the shot. */
  function measure() {
    panel.style.transform = "none";
    panel.style.clipPath = "none";
    const to = stage.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    const from = shot.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const tilt = Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, (dx / window.innerWidth) * 2.5 * MAX_TILT),
    );
    panel.style.transformOrigin = `${to.left - box.left + to.width / 2}px ${to.top - box.top + to.height / 2}px`;
    geo = {
      scale: Math.min(from.width / to.width, from.height / to.height),
      tilt,
      pivot: to.height * PIVOT_REACH,
      x: dx,
      y: dy,
      below: box.height - to.height, // progress line and title bar
    };
  }

  function paint() {
    const u = p / 100;
    const q = 1 - u;
    const s = geo.scale + (1 - geo.scale) * u;
    // The tilt peaks mid-swing and is zero at both ends, so the clip leaves
    // and lands level with the page. The rotation's own offset vanishes with
    // it, which is what bends the straight path into an arc. A spring
    // overshoot past either end tips it slightly the other way, then settles.
    const angle = Math.sin(Math.PI * q) * geo.tilt;
    panel.style.transform =
      `translate(${q * geo.x}px, ${q * geo.y}px) ` +
      `translate(0, ${geo.pivot}px) rotate(${angle}deg) translate(0, ${-geo.pivot}px) ` +
      `scale(${s})`;
    // The title bar and controls only show near the end of the swing; before
    // that the panel is cropped to the clip, with the shot's corner radius.
    const chrome = Math.max(0, Math.min(1, (u - 0.6) / 0.4));
    panel.style.clipPath = `inset(0 0 ${(1 - chrome) * geo.below}px 0 round ${RADIUS / s}px)`;
    dialog.style.setProperty("--chrome", chrome);
  }

  function springTo(target, { k, d }, onRest) {
    cancelAnimationFrame(raf);
    let prev = 0;
    const tick = (now) => {
      // Frames, not ms: damping is raised to dt so a dropped frame loses the
      // same energy as the two it replaced.
      const dt = prev ? Math.min(Math.max((now - prev) / 16.67, 0), 2.5) : 1;
      prev = now;
      v += (target - p) * k * dt;
      v *= Math.pow(d, dt);
      p += v * dt;
      if (Math.abs(target - p) < 0.02 && Math.abs(v) < 0.02) {
        p = target;
        v = 0;
        raf = 0;
        paint();
        onRest();
        return;
      }
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function clearStyles() {
    panel.style.transform = "";
    panel.style.transformOrigin = "";
    panel.style.clipPath = "";
    dialog.style.removeProperty("--chrome");
  }

  // The overlay video needs its size before the stage can be measured.
  function whenSized() {
    if (inlineVideo.videoWidth) {
      video.style.aspectRatio = `${inlineVideo.videoWidth} / ${inlineVideo.videoHeight}`;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      video.addEventListener("loadedmetadata", resolve, { once: true });
      setTimeout(resolve, 400);
    });
  }

  async function open(fromShot, fromVideo) {
    shot = fromShot;
    inlineVideo = fromVideo;
    leaving = false;
    if (reducedMotion.matches) return;

    p = 0;
    v = 0;
    panel.style.opacity = "0"; // until it can start from the shot
    dialog.style.setProperty("--chrome", 0);
    await whenSized();
    if (leaving || !dialog.open) return;
    measure();
    paint();
    panel.style.opacity = "";
    shot.classList.add("is-lifted"); // the clip has left its slot
    springTo(100, OPEN_SPRING, clearStyles);
  }

  function dismiss() {
    if (!dialog.open || leaving) return;
    leaving = true;
    // The page clip carries on from where the overlay was.
    if (inlineVideo && video.duration)
      inlineVideo.currentTime = video.currentTime;
    if (reducedMotion.matches || !geo) {
      dialog.close();
      return;
    }
    dialog.classList.add("is-leaving");
    const at = p;
    measure(); // the window may have changed size while open
    p = at;
    springTo(0, CLOSE_SPRING, () => {
      shot?.classList.remove("is-lifted"); // back in place before focus returns to it
      dialog.close();
    });
  }

  // Runs on every close, however it happened.
  function reset() {
    cancelAnimationFrame(raf);
    raf = 0;
    leaving = true; // stops an open() still waiting on the video size
    clearStyles();
    panel.style.opacity = "";
    video.style.aspectRatio = "";
    dialog.classList.remove("is-leaving");
    shot?.classList.remove("is-lifted");
    shot = inlineVideo = geo = null;
  }

  return { open, dismiss, reset };
}

function setupPan(shot) {
  const phones = shot.classList.contains("project-shot--phones");
  shot.classList.add("project-shot--pan");

  const cue = document.createElement("span");
  cue.className = "shot-cue";
  cue.setAttribute("aria-hidden", "true");
  cue.textContent = t(phones ? ui.work.hoverScroll : ui.work.hoverZoom);
  shot.appendChild(cue);

  // The rest is CSS: phone screenshots scroll, wide ones zoom and follow the
  // cursor position that trackPointer() publishes.
}

/**
 * Publish the cursor position over a shot as --px / --py (0 to 1). CSS uses it
 * to tilt the shot, and to pan a wide screenshot.
 */
function trackPointer(shot) {
  shot.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = shot.getBoundingClientRect();
    shot.style.setProperty(
      "--px",
      ((e.clientX - rect.left) / rect.width).toFixed(3),
    );
    shot.style.setProperty(
      "--py",
      ((e.clientY - rect.top) / rect.height).toFixed(3),
    );
  });
  // Back to centre, so the shot settles flat again.
  shot.addEventListener("pointerleave", () => {
    shot.style.removeProperty("--px");
    shot.style.removeProperty("--py");
  });
}

/**
 * Publish where the cursor is relative to each shot's centre as --ax / --ay
 * (-1 to 1, reaching the limit half a viewport away). CSS turns it into a
 * slight lean, so the shots respond before they are hovered.
 */
function trackAmbientPointer(shots) {
  let cursor = null; // last mouse position in the viewport
  let queued = false;

  const clamp = (n) => Math.max(-1, Math.min(1, n));

  const update = () => {
    queued = false;
    shots.forEach((shot) => {
      if (!cursor) {
        shot.style.removeProperty("--ax");
        shot.style.removeProperty("--ay");
        return;
      }
      const rect = shot.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return; // off screen
      const dx = cursor.x - (rect.left + rect.width / 2);
      const dy = cursor.y - (rect.top + rect.height / 2);
      shot.style.setProperty(
        "--ax",
        clamp(dx / (window.innerWidth / 2)).toFixed(3),
      );
      shot.style.setProperty(
        "--ay",
        clamp(dy / (window.innerHeight / 2)).toFixed(3),
      );
    });
  };

  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    cursor = {
      x: e.clientX,
      y: e.clientY,
    };
    queue();
  });
  // Scrolling moves the shots under a still cursor.
  window.addEventListener("scroll", () => cursor && queue(), { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    cursor = null;
    queue();
  });
}
