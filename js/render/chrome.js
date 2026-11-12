import { icon } from "../lib/icons.js";

/** Icons on static buttons, and the footer year. */
export function renderChrome() {
  document.getElementById("work-link")?.append(icon("arrowDown"));
  document.getElementById("to-top")?.appendChild(icon("arrowUp"));

  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
}
