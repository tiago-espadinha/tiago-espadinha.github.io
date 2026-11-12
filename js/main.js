import * as content from "../content/index.js";

import { renderChrome } from "./render/chrome.js";

import { initFlock } from "./features/flock.js";
import { initIntro } from "./features/intro.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Build the DOM from content/.
  renderChrome();

  // 2. Add behaviour to what is now on the page.
  initFlock(document.getElementById("flock"));
  initIntro();
});
