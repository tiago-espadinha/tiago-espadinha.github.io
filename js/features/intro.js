/**
 * Hero intro: the TS logo draws itself where the name will be, then the two
 * letters travel to the start of "Tiago" and "Simões" while the rest of each
 * word appears behind them. index.html sets .intro-pending on <html> before
 * first paint (and not at all under reduced motion), so the name does not
 * flash before this runs.
 */
// The monogram from assets/icons/logo_lettering.svg: the heading font's own
// T and S (Bricolage Grotesque 800), in font units, so the drawn letters are
// the same shapes they turn into.
const LOGO = [
  {
    color: "var(--color-chalk)",
    d: "M177 0V-660H339V0ZM14 -522V-660H502V-522Z",
  },
  {
    color: "var(--color-amber)",
    d: "M649 14Q579 14 526.5 -2Q474 -18 439 -48Q404 -78 387.5 -120.5Q371 -163 373 -215L523 -248Q525 -202 542.5 -173.5Q560 -145 590 -131.5Q620 -118 657 -118Q687 -118 710 -125.5Q733 -133 746.5 -146.5Q760 -160 760 -178Q760 -202 742 -217.5Q724 -233 692.5 -244Q661 -255 621 -266Q578 -278 535.5 -292.5Q493 -307 458 -329Q423 -351 401.5 -386Q380 -421 380 -473Q380 -537 412.5 -582Q445 -627 502.5 -650.5Q560 -674 634 -674Q712 -674 773 -647.5Q834 -621 867 -570Q900 -519 893 -445L745 -421Q746 -451 739 -474Q732 -497 717.5 -513Q703 -529 681 -537.5Q659 -546 629 -546Q598 -546 577.5 -538Q557 -530 546.5 -516Q536 -502 536 -484Q536 -463 552 -449Q568 -435 598 -424.5Q628 -414 669 -403Q712 -391 755.5 -376.5Q799 -362 836 -338.5Q873 -315 895.5 -278Q918 -241 918 -184Q918 -118 883.5 -74Q849 -30 788.5 -8Q728 14 649 14Z",
  },
];
const CUT = 68; // width of the gap the S cuts out of the T's bar, as a stroke

const SVG_NS = "http://www.w3.org/2000/svg";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function initIntro() {
  playNameIntro();
}

async function playNameIntro() {
  const root = document.documentElement;
  const h1 = document.querySelector(".hero h1");
  if (!h1 || !root.classList.contains("intro-pending")) return;

  const original = h1.innerHTML;
  let svg;
  try {
    // The letters are measured, so the heading font has to be in first.
    await Promise.race([document.fonts.ready, wait(1000)]);

    const initials = splitName(h1);
    if (initials.length !== LOGO.length) return;

    const host = h1.parentElement.getBoundingClientRect();
    svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "name-intro");
    svg.setAttribute("aria-hidden", "true");
    const paths = LOGO.map(({ d, color }) => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("pathLength", "1");
      path.style.fill = color;
      path.style.stroke = color;
      svg.appendChild(path);
      return path;
    });
    // As in the logo, the S sits in front and cuts a gap out of the T's bar.
    // The mask lives in the T's own coordinates, so it travels with it.
    const cut = document.createElementNS(SVG_NS, "path");
    cut.setAttribute("d", LOGO[1].d);
    cut.setAttribute("stroke", "black");
    cut.setAttribute("stroke-width", CUT);
    cut.setAttribute("stroke-linejoin", "round");
    const mask = document.createElementNS(SVG_NS, "mask");
    mask.id = "name-intro-cut";
    mask.setAttribute("maskUnits", "userSpaceOnUse");
    for (const [name, value] of [
      ["x", -2000],
      ["y", -2000],
      ["width", 4000],
      ["height", 4000],
    ]) {
      mask.setAttribute(name, value);
    }
    const keep = document.createElementNS(SVG_NS, "rect");
    for (const [name, value] of [
      ["x", -2000],
      ["y", -2000],
      ["width", 4000],
      ["height", 4000],
      ["fill", "white"],
    ]) {
      keep.setAttribute(name, value);
    }
    mask.append(keep, cut);
    svg.appendChild(mask);
    paths[0].style.mask = "url(#name-intro-cut)";
    h1.parentElement.appendChild(svg);

    // Start: both letters as the logo has them, left-aligned over the name.
    const boxes = paths.map((path) => path.getBBox());
    const left = Math.min(...boxes.map((b) => b.x));
    const top = Math.min(...boxes.map((b) => b.y));
    const bottom = Math.max(...boxes.map((b) => b.y + b.height));
    const name = h1.getBoundingClientRect();
    const scale = (name.height * 0.8) / (bottom - top);
    const start = `translate(${name.left - host.left - left * scale}px, ${
      name.top - host.top + name.height * 0.1 - top * scale
    }px) scale(${scale})`;

    // End: each letter stretched over the ink of its glyph in the heading.
    const ends = initials.map((span, i) => {
      const ink = inkRect(span);
      const b = boxes[i];
      const sx = ink.width / b.width;
      const sy = ink.height / b.height;
      return `translate(${ink.x - host.left - b.x * sx}px, ${ink.y - host.top - b.y * sy}px) scale(${sx}, ${sy})`;
    });

    paths.forEach((path) => {
      path.style.transform = start;
      path.style.strokeWidth = 2.5 / scale;
    });
    root.classList.remove("intro-pending"); // the name is ours to reveal now

    const chalk = getComputedStyle(h1).color;
    const hold = { fill: "both" };
    const anims = [];
    paths.forEach((path, i) => {
      // 1. Draw the outline, then fill it in.
      anims.push(
        path.animate(
          { strokeDashoffset: [1, 0] },
          { ...hold, duration: 800, delay: i * 150, easing: "ease-in-out" },
        ),
        path.animate(
          { fillOpacity: [0, 1] },
          { ...hold, duration: 300, delay: 850 },
        ),
        path.animate(
          { strokeOpacity: [1, 0] },
          { ...hold, duration: 150, delay: 1050 },
        ),
        // 2. Travel to the first letter of its word, turning text-coloured.
        path.animate(
          {
            transform: [start, ends[i]],
            fill: [getComputedStyle(path).fill, chalk],
          },
          {
            ...hold,
            duration: 700,
            delay: 1250,
            easing: "cubic-bezier(0.6, 0, 0.2, 1)",
          },
        ),
      );
    });
    // The gap closes as the two letters part.
    anims.push(
      cut.animate({ opacity: [1, 0] }, { ...hold, duration: 250, delay: 1250 }),
    );
    // 3. The rest of each word follows as they arrive, letter by letter.
    h1.querySelectorAll(".name-letter").forEach((letter) => {
      anims.push(
        letter.animate(
          { opacity: [0, 1] },
          { ...hold, duration: 250, delay: 1750 + letter.dataset.index * 40 },
        ),
      );
    });
    // 4. Hand over to the real letters: they come in underneath, then the
    // drawn ones go, so the pair never dims on the way.
    initials.forEach((span) => {
      anims.push(
        span.animate(
          { opacity: [0, 1] },
          { ...hold, duration: 100, delay: 1950 },
        ),
      );
    });
    anims.push(
      svg.animate({ opacity: [1, 0] }, { ...hold, duration: 150, delay: 2050 }),
    );

    await Promise.all(anims.map((a) => a.finished));
  } finally {
    h1.innerHTML = original;
    svg?.remove();
    root.classList.remove("intro-pending");
  }
}

/**
 * Wrap each word of the heading as an initial plus single letters, all hidden.
 * Returns the initials. The original markup is put back when the intro ends.
 */
function splitName(h1) {
  const initials = [];
  [...h1.childNodes].forEach((node) => {
    const word =
      node.nodeType === Node.TEXT_NODE ? node.textContent.trim() : "";
    if (!word) return;
    const spans = [...word].map((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = 0;
      if (i === 0) initials.push(span);
      else {
        span.className = "name-letter";
        span.dataset.index = i - 1;
      }
      return span;
    });
    node.replaceWith(...spans);
  });
  return initials;
}

/** The box the glyph's ink covers on screen, not its taller line box. */
function inkRect(span) {
  const rect = span.getBoundingClientRect();
  const style = getComputedStyle(span);
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const m = ctx.measureText(span.textContent);
  const fontHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  const baseline =
    rect.top + (rect.height - fontHeight) / 2 + m.fontBoundingBoxAscent;
  return {
    x: rect.left - m.actualBoundingBoxLeft,
    y: baseline - m.actualBoundingBoxAscent,
    width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
  };
}
