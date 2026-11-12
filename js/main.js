import * as content from "../content/index.js";

import { renderProjects } from "./render/projects.js";
import { renderTimeline, renderToolkit } from "./render/experience.js";
import { renderContact } from "./render/contact.js";
import { renderChrome } from "./render/chrome.js";

import { initFlock } from "./features/flock.js";
import { initIntro } from "./features/intro.js";
import { initNav } from "./features/nav.js";
import { initTabs } from "./features/tabs.js";
import { initProjectMedia } from "./features/media.js";
import { initContactForm } from "./features/form.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Build the DOM from content/.
  renderProjects(content.projects);
  renderTimeline("experience-list", content.work);
  renderTimeline("education-list", content.education);
  renderToolkit(content.toolkit);
  renderContact(content.contact);
  renderChrome();

  // 2. Add behaviour to what is now on the page.
  initProjectMedia();
  initTabs();
  initContactForm(content.contact);
  initNav();
  initFlock(document.getElementById("flock"));
  initIntro();
});
