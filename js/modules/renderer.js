export function initRenderer(data) {
  renderAbout(data.about);
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
