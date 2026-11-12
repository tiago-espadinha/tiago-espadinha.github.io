/**
 * The Experience section's two tabs, also printed on the CV
 * (scripts/build-cv.mjs). Entries show in this order, so keep the most recent
 * first.
 *
 * from, to     Years. `to: null` means ongoing ("2025 to now").
 * title        {en, pt}
 * school       Education only: where. Shown before the description.
 * description  {en, pt} Optional for education.
 * cv           {en, pt} Optional: replaces the description on the CV. Can use
 *              *italic*, **bold** and a blank line for a new paragraph.
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
    from: 2022,
    to: 2024,
    title: {
      en: "Master's Degree in Electrical and Computer Engineering",
      pt: "Mestrado em Engenharia Eletrotécnica e de Computadores",
    },
    school: "Instituto Superior Técnico",
    description: {
      en: "Specialised in control, robotics and AI. Thesis on visual SLAM and camera calibration for autonomous cars.",
      pt: "Especialização em controlo, robótica e IA. Dissertação sobre SLAM visual e calibração de câmaras para veículos autónomos.",
    },
    cv: {
      en: "Main area: Control Systems, Robotics and AI.\n\n*Dissertation:* Visual SLAM and Camera Autocalibration for Autonomous Cars Navigation, in the **VIENA Project**. Implemented camera systems and object detection for ground truth acquisition and distractor removal in VSLAM.",
      pt: "Especialização: Controlo, Robótica e IA.\n\n*Dissertação:* Monitorização de trajetória de veículos autónomos usando câmaras, no **Projeto VIENA**. Câmaras e deteção de objetos para *ground truth* e remoção de distratores em VSLAM.",
    },
  },
  {
    from: 2019,
    to: 2022,
    title: {
      en: "Bachelor's Degree in Electrical and Computer Engineering",
      pt: "Licenciatura em Engenharia Eletrotécnica e de Computadores",
    },
    school: "Instituto Superior Técnico",
  },
];
