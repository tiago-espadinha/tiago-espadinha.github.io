/**
 * The Experience section's two tabs. Entries show in this order, so keep the
 * most recent first. Each entry: { from, to, title, description }.
 *
 * from, to     Years. `to: null` means ongoing ("2025 to now").
 * title        {en, pt}
 * description  {en, pt}
 */
export const work = [
  {
    from: 2025,
    to: null,
    title: {
      en: "Frontend developer, Angular single-page app",
      pt: "Frontend developer, aplicação Angular single-page",
    },
    description: {
      en: "Build features, integrate micro frontends, run frontend releases through the pipeline and tighten loose acceptance criteria with the client.",
      pt: "Desenvolvo funcionalidades, integro micro frontends, faço as releases de frontend pela pipeline e clarifico critérios de aceitação com o cliente.",
    },
  },
  {
    from: 2024,
    to: 2025,
    title: {
      en: "Fullstack developer, web and mobile",
      pt: "Fullstack developer, web e mobile",
    },
    description: {
      en: "Shipped a Next.js web app and a React Native app in TypeScript, with GraphQL resolvers and REST endpoints in Node.",
      pt: "Entreguei uma aplicação web em Next.js e uma aplicação React Native em TypeScript, com resolvers GraphQL e endpoints REST em Node.",
    },
  },
];

export const education = [
  {
    from: 2019,
    to: 2024,
    title: {
      en: "Electrical and Computer Engineering, Instituto Superior Técnico",
      pt: "Engenharia Eletrotécnica e de Computadores, Instituto Superior Técnico",
    },
    description: {
      en: "Specialised in control, robotics and AI. Thesis on visual SLAM and camera calibration for autonomous cars.",
      pt: "Especialização em controlo, robótica e IA. Dissertação sobre SLAM visual e calibração de câmaras para veículos autónomos.",
    },
  },
];
