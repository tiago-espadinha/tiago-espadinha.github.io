import { initRenderer } from "./modules/renderer.js";
import { portfolioData } from "./modules/data.js";

document.addEventListener("DOMContentLoaded", () => {
  initRenderer(portfolioData);
});
