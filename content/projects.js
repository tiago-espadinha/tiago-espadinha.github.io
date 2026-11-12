/**
 * Selected work, shown in this order. Rows alternate sides on wide screens.
 * To reorder, move an entry; to hide one, comment it out.
 *
 * id         Anchor for the row (#teddex). Lowercase, no spaces.
 * title      Project name.
 * summary    One line: what it is.
 * detail     One or two sentences: how it works.
 * stack      Short tags, shown as one comma-separated line.
 * clip       Optional muted loop played over the screenshots, or null. See
 *            docs/RECORDING_CLIPS.md to record one.
 * layout     "wide" for one desktop screenshot, "phones" for two phone
 *            screenshots side by side.
 * images     Screenshots: { src, alt }. The first is the clip's poster.
 * liveUrl    Link to the running project, with liveLabel as its text.
 * codeUrl    Link to the source.
 */
export const projects = [
  {
    id: "nova-stream",
    title: "Nova Stream",
    summary: "One search box for films, series, music, books and games.",
    detail:
      "An Express API sits in front of five content providers. Favorites and collections work for guests and move to the account on sign-in.",
    stack: ["React 18", "TypeScript", "Express", "Redis", "i18next", "PWA"],
    clip: "assets/projects/nova.mp4",
    layout: "wide",
    images: [
      {
        src: "assets/projects/nova.webp",
        alt: "Nova Stream home with a featured title and a trending shelf",
      },
    ],
    liveUrl: "https://nova-stream-theta.vercel.app/",
    liveLabel: "Open the app",
    codeUrl: "https://github.com/tiago-espadinha/NovaStream",
  },
  {
    id: "simlab",
    title: "SimLab",
    summary: "Physics and generative experiments on a plain canvas.",
    detail:
      "Cloth, n-body gravity, reaction-diffusion, a double pendulum and more. No build step and no dependencies, only the maths and a render loop.",
    stack: ["JavaScript", "Canvas", "HTML", "CSS"],
    clip: "assets/projects/simlab.mp4",
    layout: "wide",
    images: [
      {
        src: "assets/projects/simlab.webp",
        alt: "SimLab double pendulum tracing a chaotic path",
      },
    ],
    liveUrl: "https://simlab.vercel.app/",
    liveLabel: "Open the lab",
    codeUrl: "https://github.com/tiago-espadinha/simlab",
  },
  {
    id: "medflow",
    title: "MedFlow",
    summary:
      "A hospital operations dashboard with six roles and four languages.",
    detail:
      "Patients, admissions, lab orders, billing and pharmacy, all driven by one resource configuration. Reports export to CSV and print cleanly.",
    stack: ["React 18", "TypeScript", "React Router", "Framer Motion"],
    clip: "assets/projects/medflow.mp4",
    layout: "wide",
    images: [
      {
        src: "assets/projects/medflow.webp",
        alt: "MedFlow dashboard with hospital KPIs and occupancy charts",
      },
    ],
    liveUrl: "https://med-flow-amber.vercel.app",
    liveLabel: "Open the app",
    codeUrl: "https://github.com/tiago-espadinha/MedFlow",
  },
  {
    id: "teddex",
    title: "TedDex",
    summary:
      "An installable Pokédex and team builder that works in airplane mode.",
    detail:
      "1,025 species, their moves, evolutions and locations, served as static data with no server. A build pipeline prepares the data and a service worker caches it.",
    stack: ["React 19", "TypeScript", "IndexedDB", "Workbox", "500+ tests"],
    clip: "assets/projects/teddex.mp4",
    layout: "phones",
    images: [
      {
        src: "assets/projects/teddex-dex.webp",
        alt: "TedDex grid of species cards tinted by type",
      },
      {
        src: "assets/projects/teddex-detail.webp",
        alt: "TedDex species page showing Charizard's base stats",
      },
    ],
    liveUrl: "https://teddex.vercel.app/",
    liveLabel: "Open the app",
    codeUrl: "https://github.com/tiago-espadinha/TedDex",
  },
];
