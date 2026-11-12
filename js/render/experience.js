import { el, mount } from "../lib/dom.js";

/** Jobs and education share one layout: dates, title, description. */
export function renderTimeline(containerId, entries) {
  const container = mount(containerId);
  if (!container) return;

  entries.forEach((entry) => {
    const item = el("div", "job");
    item.append(
      el("p", "job-dates", entry.dates),
      el("h3", "", entry.title),
      el("p", "job-description", entry.description),
    );
    container.appendChild(item);
  });
}

/** Toolkit: a definition list, one label and one line of items per group. */
export function renderToolkit(toolkit) {
  const list = mount("toolkit");
  if (!list) return;

  toolkit.forEach((group) => {
    list.append(
      el("dt", "", group.label),
      el("dd", "", group.items.join(", ")),
    );
  });
}
