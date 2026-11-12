import { el, externalLink, mount } from "../lib/dom.js";

/** Selected work: one row per project, media beside text. */
export function renderProjects(projects) {
  const container = mount("projects");
  if (!container) return;
  projects.forEach((project) => container.appendChild(projectRow(project)));
}

function projectRow(project) {
  const article = el("article", "project");
  article.id = project.id;
  article.append(projectShot(project), projectInfo(project));
  return article;
}

function projectShot(project) {
  const shot = el(
    "div",
    `project-shot${project.layout === "phones" ? " project-shot--phones" : ""}`,
  );
  project.images.forEach((image) => {
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    shot.appendChild(img);
  });
  // Optional clip. It loads on first play and sits over the screenshots,
  // which stay visible as its poster (see features/media.js).
  if (project.clip) {
    const video = document.createElement("video");
    video.src = project.clip;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "none";
    video.setAttribute("aria-label", `Short clip of ${project.title} in use`);
    shot.appendChild(video);
  }
  return shot;
}

function projectInfo(project) {
  const info = el("div", "project-info");
  info.append(
    el("h3", "", project.title),
    el("p", "project-summary", project.summary),
    el("p", "project-detail", project.detail),
    el("p", "project-stack", project.stack.join(", ")),
  );

  const links = el("div", "link-row");
  links.append(
    externalLink(project.liveLabel, project.liveUrl),
    externalLink("Read the code", project.codeUrl),
  );
  info.appendChild(links);
  return info;
}
