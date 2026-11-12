import * as content from "../content/index.js";

import { renderTimeline, renderToolkit } from "./render/experience.js";
import { renderChrome } from "./render/chrome.js";

import { initFlock } from "./features/flock.js";
import { initIntro } from "./features/intro.js";
import { initNav } from "./features/nav.js";
import { initTabs } from "./features/tabs.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Build the DOM from content/.
  renderTimeline("experience-list", content.work);
  renderTimeline("education-list", content.education);
  renderToolkit(content.toolkit);
  renderChrome();

  // 2. Add behaviour to what is now on the page.
  initTabs();
  initNav();
  initFlock(document.getElementById("flock"));
  initIntro();
});
