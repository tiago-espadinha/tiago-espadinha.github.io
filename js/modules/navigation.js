export function initNavigation() {
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("back-to-top");
  let lastScroll = 0;

  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navbar) {
    window.addEventListener("scroll", () => {
      // Prevent navbar from hiding if mobile menu is active
      if (navLinks && navLinks.classList.contains("active")) return;

      const currentScroll = window.pageYOffset;

      // Hide/show navbar
      if (currentScroll <= 0) {
        navbar.style.transform = "translateY(0)";
      } else if (currentScroll > lastScroll && currentScroll > 80) {
        // Scrolling down
        navbar.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    });
  }

  // Mobile nav toggle click handler
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Auto-close menu when link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Back to top functionality
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
