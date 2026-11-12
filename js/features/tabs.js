/**
 * Tabs: click or arrow keys switch which panel of a [role=tablist] is shown.
 * An amber thumb slides under the selected tab. The outgoing panel fades,
 * the box eases to the new panel's height, and the new entries rise in one
 * after another.
 */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const EASE_OUT = "cubic-bezier(0.2, 0.7, 0.2, 1)";

export function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panelOf = (tab) => document.getElementById(tab.getAttribute("aria-controls"));

    const thumb = document.createElement("span");
    thumb.className = "toggle-thumb";
    thumb.setAttribute("aria-hidden", "true");
    list.prepend(thumb);

    let current = tabs.find((t) => t.getAttribute("aria-selected") === "true") ?? tabs[0];
    let swap = null; // the panel change in progress, if any

    function placeThumb(animate) {
      if (!animate) thumb.style.transition = "none";
      thumb.style.setProperty("--x", `${current.offsetLeft}px`);
      thumb.style.setProperty("--w", `${current.offsetWidth}px`);
      if (!animate) {
        thumb.getBoundingClientRect(); // flush so the jump is not animated
        thumb.style.transition = "";
      }
    }

    function select(tab, focus) {
      if (focus) tab.focus();
      if (tab === current) return;
      const from = panelOf(current);
      const to = panelOf(tab);
      current = tab;

      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
      });
      placeThumb(true);

      swap?.finish();
      if (reducedMotion.matches) {
        from.hidden = true;
        to.hidden = false;
      } else {
        swap = swapPanels(from, to);
      }
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      });
    });

    // Tab widths change when the web font arrives and on resize.
    placeThumb(false);
    document.fonts?.ready.then(() => placeThumb(false));
    window.addEventListener("resize", () => placeThumb(false));
  });
}

/**
 * Fade `from` out, then show `to` while the shared box eases between the two
 * heights. Returns a handle whose finish() jumps to the end state, so a quick
 * second click never leaves two panels showing.
 */
function swapPanels(from, to) {
  const box = from.parentElement;
  const startHeight = box.offsetHeight;
  const running = [];
  let done = false;

  const end = () => {
    if (done) return;
    done = true;
    running.forEach((a) => a.cancel());
    from.hidden = true;
    to.hidden = false;
    box.style.height = "";
    box.style.overflow = "";
  };

  box.style.height = `${startHeight}px`;
  box.style.overflow = "hidden";

  const fadeOut = from.animate(
    [{ opacity: 1 }, { opacity: 0, transform: "translateY(-6px)" }],
    { duration: 160, easing: "ease-in", fill: "forwards" }, // held until end() hides it
  );
  running.push(fadeOut);

  fadeOut.finished
    .then(() => {
      if (done) return;
      from.hidden = true;
      to.hidden = false;
      box.style.height = "";
      const endHeight = box.offsetHeight;

      running.push(
        box.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], {
          duration: 380,
          easing: EASE_OUT,
        }),
      );
      [...to.children].forEach((child, i) => {
        running.push(
          child.animate(
            [
              { opacity: 0, transform: "translateY(10px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 420, delay: i * 60, easing: EASE_OUT, fill: "backwards" },
          ),
        );
      });
      return Promise.all(running.slice(1).map((a) => a.finished));
    })
    .then(end, () => {}); // a cancelled animation rejects; finish() already tidied up

  return { finish: end };
}
