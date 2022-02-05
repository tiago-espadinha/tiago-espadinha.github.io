export function initRenderer(data) {
  renderAbout(data.about);
}

function renderAbout(about) {
  const aboutBio = document.getElementById("about-bio");
  if (aboutBio) {
    aboutBio.textContent = about.bio;
  }
}
