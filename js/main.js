import { initTheme } from "./modules/theme.js";
import { initNavigation } from "./modules/navigation.js";
import { initRenderer } from "./modules/renderer.js";
import { portfolioData } from "./modules/data.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initRenderer(portfolioData);
});
