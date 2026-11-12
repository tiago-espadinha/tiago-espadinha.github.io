/**
 * The Toolkit list beside Experience: one row per group, in this order.
 * Each group: { label: {en, pt}, items }. An item that needs translating
 * can be {en, pt}; names of tools stay plain strings.
 */
export const toolkit = [
  {
    label: {
      en: "Every day",
      pt: "Dia a dia",
    },
    items: ["TypeScript", "Angular", "React", "HTML", "CSS", "Git"],
  },
  {
    label: {
      en: "Shipped with",
      pt: "Em produção",
    },
    items: [
      "Next.js",
      "React Native",
      "Expo",
      "Redux",
      "GraphQL",
      "REST",
      "Node",
      "Jest",
    ],
  },
  {
    label: {
      en: "Side projects",
      pt: "Projetos pessoais",
    },
    items: [
      {
        en: "PWAs and offline storage",
        pt: "PWAs e armazenamento offline",
      },
      "Vite",
      "Express",
      "Canvas",
    ],
  },
  {
    label: {
      en: "Learning now",
      pt: "A aprender",
    },
    items: [
      {
        en: "SQL and schema design",
        pt: "SQL e modelação de dados",
      },
      {
        en: "Auth",
        pt: "Autenticação",
      },
      "Docker",
      "CI/CD",
      "AWS",
    ],
  },
];
