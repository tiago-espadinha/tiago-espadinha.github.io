export const portfolioData = {
  about: {
    bio: "I am a passionate developer with a focus on building clean, accessible, and high-performance web applications. I enjoy solving complex problems and learning new technologies to stay at the forefront of the industry."
  },
  skills: [
    { name: "HTML", iconClass: "fab fa-html5", comingSoon: false },
    { name: "CSS", iconClass: "fab fa-css3-alt", comingSoon: false },
    { name: "JavaScript", iconClass: "fab fa-js", comingSoon: false },
    { name: "Python", iconClass: "fab fa-python", comingSoon: false },
    { name: "React", iconClass: "fab fa-react", comingSoon: false },
    { name: "Node.js", iconClass: "fab fa-node-js", comingSoon: false },
    { name: "SQL", iconClass: "fas fa-database", comingSoon: true },
    { name: "Docker", iconClass: "fab fa-docker", comingSoon: true },
  ],
  projects: [
    {
      title: "E-commerce Platform",
      description: "A full-featured online store with product management and secure checkout functionality.",
      coverImage: "/assets/placeholder.webp",
      altText: "E-commerce Platform",
      techStack: ["React", "Node.js", "MongoDB"],
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather tracking application using OpenWeatherMap API with dynamic visuals.",
      coverImage: "/assets/placeholder.webp",
      altText: "Weather Dashboard",
      techStack: ["JavaScript", "CSS3", "API"],
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Task Management App",
      description: "Collaborative tool for teams to manage projects, track time, and assign tasks efficiently.",
      coverImage: "/assets/placeholder.webp",
      altText: "Task Management App",
      techStack: ["Vue.js", "Firebase", "Tailwind"],
      githubUrl: "#",
      liveUrl: "#",
    },
  ]
};
