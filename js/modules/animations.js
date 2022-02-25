export function initAnimations() {
  // 1. IntersectionObserver scroll reveals
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length > 0) {
    const revealOnScroll = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    reveals.forEach((reveal) => {
      revealOnScroll.observe(reveal);
    });
  }

  // 2. Hero background slides transitions manager
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    const animationButtons = document.querySelectorAll(
      ".hero-animation-selector [data-animation]",
    );

    const imagePaths = [
      "assets/carousel1.webp",
      "assets/carousel2.webp",
      "assets/carousel3.webp",
    ];

    const slides = imagePaths.map((image) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      slide.style.backgroundImage = `url(${image})`;
      heroBg.appendChild(slide);
      return slide;
    });

    let current = 0;
    let intervalId = null;

    const setActiveSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    };

    const nextSlide = () => {
      current = (current + 1) % slides.length;
      setActiveSlide(current);
    };

    if (animationButtons.length > 0) {
      animationButtons.forEach((button) => {
        button.addEventListener("click", () => {
          setActiveSlide(current);
        });
      });
    }

    setActiveSlide(current);
    intervalId = setInterval(nextSlide, 6000);

    heroBg.addEventListener("mouseenter", () => {
      clearInterval(intervalId);
      intervalId = null;
    });

    heroBg.addEventListener("mouseleave", () => {
      if (!intervalId) intervalId = setInterval(nextSlide, 6000);
    });
  }
}
