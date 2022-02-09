export function initRenderer(data) {
  renderAbout(data.about);
  renderSkills(data.skills);
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
