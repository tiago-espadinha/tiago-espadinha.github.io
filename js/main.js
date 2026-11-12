import * as content from "../content/index.js";

import { renderProjects } from "./render/projects.js";
import { renderTimeline, renderToolkit } from "./render/experience.js";
import { renderContact } from "./render/contact.js";
import { renderChrome } from "./render/chrome.js";
import { translatePage } from "./lib/i18n.js";

import { initFlock } from "./features/flock.js";
import { initIntro } from "./features/intro.js";
import { initNav } from "./features/nav.js";
import { initTabs } from "./features/tabs.js";
import { initProjectMedia } from "./features/media.js";
import { initContactForm } from "./features/form.js";
import { initLanguageSwitch } from "./features/language.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Translate the static markup and build the rest of the DOM from content/.
  translatePage(content.ui);
  renderProjects(content.projects);
  renderTimeline("experience-list", content.work);
  renderTimeline("education-list", content.education);
  renderToolkit(content.toolkit);
  renderContact(content.contact);
  renderChrome();
  document.documentElement.classList.remove("i18n-pending");

  // 2. Add behaviour to what is now on the page.
  initProjectMedia();
  initTabs();
  initContactForm(content.contact);
  initLanguageSwitch();
  initNav();
  initFlock(document.getElementById("flock"));
  initIntro();
});
