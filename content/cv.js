/**
 * What only the CV shows. Everything else on the CV comes from the site's
 * content: jobs and degrees (experience.js), projects (projects.js), skills
 * (toolkit.js) and the email and GitHub link (contact.js). Build it with
 * `npm run cv` (scripts/build-cv.mjs, then LaTeX in cv/).
 *
 * Text can use *italic* and **bold**.
 */
export const cv = {
  name: "Tiago Simões",
  phone: "+351 912 308 887",
  city: { en: "Lisboa", pt: "Lisboa" },
  headings: {
    experience: { en: "Experience", pt: "Experiência" },
    projects: { en: "Projects", pt: "Projetos" },
    education: { en: "Education", pt: "Formação Académica" },
    skills: { en: "Skills", pt: "Competências" },
    workshops: { en: "Workshops", pt: "Workshops" },
  },
  dates: {
    range: { en: "{from} -- {to}", pt: "{from} -- {to}" },
    ongoing: { en: "{from} -- present", pt: "{from} -- atual" },
  },
  // Skill rows after the toolkit groups that have `onCv` left on.
  skills: [
    {
      label: { en: "Also", pt: "Outras" },
      items: ["Python", "C", "MATLAB", "LaTeX"],
    },
    {
      label: { en: "Languages", pt: "Línguas" },
      items: [
        { en: "Portuguese (native)", pt: "Português (nativo)" },
        { en: "English", pt: "Inglês" },
      ],
    },
  ],
  workshops: [
    {
      en: "*Uncomplicating AI*, Cloudflare at SINFO 31 (2024)",
      pt: "*Uncomplicating AI*, Cloudflare na SINFO 31 (2024)",
    },
    {
      en: "Git workshop, NEECIST (2022)",
      pt: "Workshop de Git, NEECIST (2022)",
    },
    {
      en: "Soldering workshop, NEECIST (2022)",
      pt: "Workshop de soldadura, NEECIST (2022)",
    },
  ],
};
