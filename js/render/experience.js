import { ui } from "../../content/ui.js";
import { el, mount } from "../lib/dom.js";
import { t } from "../lib/i18n.js";

/** Jobs and education share one layout: dates, title, description. */
export function renderTimeline(containerId, entries) {
  const container = mount(containerId);
  if (!container) return;

  entries.forEach((entry) => {
    const dates =
      entry.to === null
        ? t(ui.experience.ongoing, { from: entry.from })
        : t(ui.experience.range, { from: entry.from, to: entry.to });
    const description = [entry.school, t(entry.description)]
      .filter(Boolean)
      .join(". ");
    const item = el("div", "job");
    item.append(
      el("p", "job-dates", dates),
      el("h3", "", t(entry.title)),
      el("p", "job-description", description),
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
      el("dt", "", t(group.label)),
      el("dd", "", group.items.map((item) => t(item)).join(", ")),
    );
  });
}
