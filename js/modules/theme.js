export function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("hero-icon");
  const body = document.body;


  if (!themeToggle) return;

  // Check for saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    themeIcon.src = savedTheme === "dark" ? "assets/icons/logo_dark.svg" : "assets/icons/logo_light.svg";
    body.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeIcon.src = "assets/icons/logo_dark.svg";
    body.setAttribute("data-theme", "dark");
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    themeIcon.src = newTheme === "dark" ? "assets/icons/logo_dark.svg" : "assets/icons/logo_light.svg";
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}
