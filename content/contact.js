/**
 * Contact details, used by the hero icon links, the "Get in touch" list and
 * the contact form.
 *
 * note    {en, pt} The line under "Get in touch".
 * email   Shown first in the list, and the fallback when the form fails.
 * form    EmailJS ids for the contact form (public by design). Set to null
 *         to hide the form and keep only the list.
 * cv      {en, pt} Path to the CV PDF in each language, built from cv/ (see
 *         docs/CONTENT.md). Set to null to hide the Download CV buttons.
 * links   Profiles, in display order: { label, handle, icon, url }. `icon`
 *         is a name from js/lib/icons.js.
 */
export const contact = {
  note: {
    en: "Open to frontend and fullstack roles in the Lisbon region, or remote within Europe.",
    pt: "Disponível para funções de frontend e fullstack na região de Lisboa, ou remoto na Europa.",
  },
  email: "tiago.espadinha.simoes@gmail.com",
  form: {
    publicKey: "5uACJShPx1gYp2dAa",
    serviceId: "service_9c4t158",
    templateId: "template_cj71wjc",
  },
  cv: {
    en: "assets/tiago_simoes-cv_en.pdf",
    pt: "assets/tiago_simoes-cv_pt.pdf",
  },
  links: [
    {
      label: "GitHub",
      handle: "tiago-espadinha",
      icon: "github",
      url: "https://github.com/tiago-espadinha",
    },
    {
      label: "LinkedIn",
      handle: "Tiago Espadinha Simões",
      icon: "linkedin",
      url: "https://www.linkedin.com/in/tiago-espadinha-sim%C3%B5es/",
    },
  ],
};
