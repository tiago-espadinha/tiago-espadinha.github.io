/**
 * Nav: shown at the very top of the page, hidden while the hero scrolls past,
 * then back as a slim bar once the hero is gone. An amber underline slides to
 * the link of the section being read. The back-to-top button follows the same
 * state.
 */
export function initNav() {
  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero");
  const list = nav?.querySelector(".nav-links");
  if (!nav || !hero || !list) return;

  const links = [...list.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.hash));

  const indicator = document.createElement("li");
  indicator.className = "nav-indicator";
  indicator.setAttribute("aria-hidden", "true");
  list.appendChild(indicator);

  const toTop = document.getElementById("to-top");

  function updateState() {
    const pastHero = hero.getBoundingClientRect().bottom <= 80;
    const atTop = window.scrollY < 24;
    nav.classList.toggle("is-stuck", pastHero);
    nav.classList.toggle("is-hidden", !pastHero && !atTop);
    toTop?.classList.toggle("is-visible", pastHero);
  }

  let current = -1;

  function place(index, animate) {
    const link = links[index];
    if (!animate) indicator.style.transition = "none";
    indicator.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
    if (!animate) {
      indicator.getBoundingClientRect(); // flush so the jump is not animated
      indicator.style.transition = "";
    }
  }

  function update() {
    updateState();
    // The current section is the last one whose top has passed 40% of the
    // viewport. The last section is short, so reaching the page end selects it.
    const line = window.innerHeight * 0.4;
    let next = -1;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= line) next = i;
    });
    const doc = document.documentElement;
    if (
      next >= 0 &&
      window.innerHeight + window.scrollY >= doc.scrollHeight - 2
    ) {
      next = sections.length - 1;
    }
    if (next === current) return;

    links.forEach((a, i) => {
      if (i === next) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    if (next >= 0) place(next, current >= 0);
    indicator.classList.toggle("is-visible", next >= 0);
    current = next;
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    },
    { passive: true },
  );

  // Link widths change on resize and when the web font arrives.
  const reposition = () => {
    update();
    if (current >= 0) place(current, false);
  };
  window.addEventListener("resize", reposition);
  document.fonts?.ready.then(reposition);

  update();
}
