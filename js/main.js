import * as content from "../content/index.js";

import { renderChrome } from "./render/chrome.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Build the DOM from content/.
  renderChrome();
});
