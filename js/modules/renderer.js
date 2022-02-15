export function initRenderer(data) {
  renderAbout(data.about);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderTimeline(data.timeline);
  renderFooter();
}

function renderFooter() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function renderAbout(about) {
  const aboutBio = document.getElementById("about-bio");
  if (aboutBio) {
    aboutBio.textContent = about.bio;
  }
}

function renderSkills(skills) {
  const skillsGrid = document.getElementById("skills-grid");
  if (!skillsGrid) return;

  skillsGrid.innerHTML = "";

  skills.forEach((skill, index) => {
    const card = document.createElement("div");
    card.className = `skill-card${skill.comingSoon ? " coming-soon" : ""} reveal`;
    card.style.animationDelay = `${index * 75}ms`;

    const icon = document.createElement("i");
    icon.className = skill.iconClass;
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = skill.name;

    card.appendChild(icon);
    card.appendChild(label);
    skillsGrid.appendChild(card);
  });
}

function renderProjects(projects) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";

    const projectImg = document.createElement("div");
    projectImg.className = "project-img";

    const img = document.createElement("img");
    img.src = project.coverImage;
    img.alt = project.altText;
    img.loading = "lazy";

    projectImg.appendChild(img);

    const projectInfo = document.createElement("div");
    projectInfo.className = "project-info";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const techStack = document.createElement("div");
    techStack.className = "tech-stack";
    project.techStack.forEach((tech) => {
      const tag = document.createElement("span");
      tag.textContent = tech;
      techStack.appendChild(tag);
    });

    const projectLinks = document.createElement("div");
    projectLinks.className = "project-links";

    const githubLink = document.createElement("a");
    githubLink.href = project.githubUrl;
    githubLink.className = "btn btn-primary btn-sm";
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";
    githubLink.innerHTML = `<i class="fab fa-github"></i> GitHub`;

    const liveLink = document.createElement("a");
    liveLink.href = project.liveUrl;
    liveLink.className = "btn btn-secondary btn-sm";
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";
    liveLink.textContent = "Live Demo";

    projectLinks.appendChild(githubLink);
    projectLinks.appendChild(liveLink);

    projectInfo.appendChild(title);
    projectInfo.appendChild(description);
    projectInfo.appendChild(techStack);
    projectInfo.appendChild(projectLinks);

    card.appendChild(projectImg);
    card.appendChild(projectInfo);
    projectsGrid.appendChild(card);
  });
}

function renderTimeline(timeline) {
  const timelineContainer = document.getElementById("timeline-container");
  if (!timelineContainer) return;

  timelineContainer.innerHTML = "";

  timeline.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal";

    const dot = document.createElement("div");
    dot.className = "timeline-dot";

    const date = document.createElement("div");
    date.className = "timeline-date";
    date.textContent = entry.date;

    const content = document.createElement("div");
    content.className = "timeline-content";

    const title = document.createElement("h3");
    title.textContent = entry.title;

    const description = document.createElement("p");
    description.textContent = entry.description;

    content.appendChild(title);
    content.appendChild(description);
    item.appendChild(dot);
    item.appendChild(date);
    item.appendChild(content);
    timelineContainer.appendChild(item);
  });
}
