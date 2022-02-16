import { initTheme } from "./modules/theme.js";
import { initRenderer } from "./modules/renderer.js";
import { portfolioData } from "./modules/data.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initRenderer(portfolioData);
});
