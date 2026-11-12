/**
 * Selected work, shown in this order. Rows alternate sides on wide screens.
 * To reorder, move an entry; to hide one, comment it out.
 *
 * Text fields marked {en, pt} need both languages (see docs/CONTENT.md).
 *
 * id         Anchor for the row (#teddex). Lowercase, no spaces.
 * title      Project name.
 * summary    {en, pt} One line: what it is.
 * detail     {en, pt} One or two sentences: how it works.
 * stack      Short tags, shown as one comma-separated line. A tag that needs
 *            translating can be {en, pt}.
 * clip       Optional muted loop played over the screenshots, or null. See
 *            docs/RECORDING_CLIPS.md to record one.
 * layout     "wide" for one desktop screenshot, "phones" for two phone
 *            screenshots side by side.
 * images     Screenshots: { src, alt: {en, pt} }. The first is the clip's poster.
 * liveUrl    Link to the running project, with liveLabel {en, pt} as its text.
 * codeUrl    Link to the source.
 */
export const projects = [
  {
    id: "nova-stream",
    title: "Nova Stream",
    summary: {
      en: "One search box for films, series, music, books and games.",
      pt: "Uma só pesquisa para filmes, séries, música, livros e jogos.",
    },
    detail: {
      en: "An Express API sits in front of five content providers. Favorites and collections work for guests and move to the account on sign-in.",
      pt: "Uma API Express à frente de cinco fornecedores de conteúdo. Favoritos e coleções funcionam sem conta e passam para a conta ao iniciar sessão.",
    },
    stack: ["React 18", "TypeScript", "Express", "Redis", "i18next", "PWA"],
    clip: "assets/projects/nova.mp4",
    layout: "wide",
    images: [
      {
        src: "assets/projects/nova.webp",
        alt: {
          en: "Nova Stream home with a featured title and a trending shelf",
          pt: "Página inicial do Nova Stream com um título em destaque e uma fila de tendências",
        },
      },
    ],
    liveUrl: "https://nova-stream-theta.vercel.app/",
    liveLabel: {
      en: "Open the app",
      pt: "Abrir a app",
    },
    codeUrl: "https://github.com/tiago-espadinha/NovaStream",
  },
  {
    id: "simlab",
    title: "SimLab",
    summary: {
      en: "Physics and generative experiments on a plain canvas.",
      pt: "Experiências de física e arte generativa num simples canvas.",
    },
    detail: {
      en: "Cloth, n-body gravity, reaction-diffusion, a double pendulum and more. No build step and no dependencies, only the maths and a render loop.",
      pt: "Tecido, gravidade de n corpos, reação-difusão, um pêndulo duplo e mais. Sem build e sem dependências, só a matemática e um ciclo de renderização.",
    },
    stack: ["JavaScript", "Canvas", "HTML", "CSS"],
    clip: "assets/projects/simlab.mp4",
    layout: "wide",
    images: [
      {
        src: "assets/projects/simlab.webp",
        alt: {
          en: "SimLab double pendulum tracing a chaotic path",
          pt: "Pêndulo duplo do SimLab a traçar um percurso caótico",
        },
      },
    ],
    liveUrl: "https://simlab.vercel.app/",
    liveLabel: {
      en: "Open the lab",
      pt: "Abrir o laboratório",
    },
    codeUrl: "https://github.com/tiago-espadinha/simlab",
  },
  {
    id: "medflow",
    title: "MedFlow",
    summary: {
      en: "A hospital operations dashboard with six roles and four languages.",
      pt: "Um painel de gestão hospitalar com seis perfis e quatro línguas.",
    },
    detail: {
      en: "Patients, admissions, lab orders, billing and pharmacy, all driven by one resource configuration. Reports export to CSV and print cleanly.",
      pt: "Doentes, internamentos, análises, faturação e farmácia, tudo a partir de uma única configuração de recursos. Os relatórios exportam para CSV e imprimem sem falhas.",
    },
    stack: ["React 18", "TypeScript", "React Router", "Framer Motion"],
    clip: "assets/projects/medflow.mp4",
    layout: "wide",
    images: [
      {
        src: "assets/projects/medflow.webp",
        alt: {
          en: "MedFlow dashboard with hospital KPIs and occupancy charts",
          pt: "Painel do MedFlow com indicadores do hospital e gráficos de ocupação",
        },
      },
    ],
    liveUrl: "https://med-flow-amber.vercel.app",
    liveLabel: {
      en: "Open the app",
      pt: "Abrir a app",
    },
    codeUrl: "https://github.com/tiago-espadinha/MedFlow",
  },
  {
    id: "teddex",
    title: "TedDex",
    summary: {
      en: "An installable Pokédex and team builder that works in airplane mode.",
      pt: "Uma Pokédex e construtor de equipas instalável que funciona em modo de voo.",
    },
    detail: {
      en: "1,025 species, their moves, evolutions and locations, served as static data with no server. A build pipeline prepares the data and a service worker caches it.",
      pt: "1025 espécies, com os seus movimentos, evoluções e localizações, servidas como dados estáticos sem servidor. Uma pipeline de build prepara os dados e um service worker guarda-os em cache.",
    },
    stack: [
      "React 19",
      "TypeScript",
      "IndexedDB",
      "Workbox",
      {
        en: "500+ tests",
        pt: "500+ testes",
      },
    ],
    clip: "assets/projects/teddex.mp4",
    layout: "phones",
    images: [
      {
        src: "assets/projects/teddex-dex.webp",
        alt: {
          en: "TedDex grid of species cards tinted by type",
          pt: "Grelha de cartões de espécies do TedDex coloridos por tipo",
        },
      },
      {
        src: "assets/projects/teddex-detail.webp",
        alt: {
          en: "TedDex species page showing Charizard's base stats",
          pt: "Página de espécie do TedDex com os atributos base do Charizard",
        },
      },
    ],
    liveUrl: "https://teddex.vercel.app/",
    liveLabel: {
      en: "Open the app",
      pt: "Abrir a app",
    },
    codeUrl: "https://github.com/tiago-espadinha/TedDex",
  },
];
