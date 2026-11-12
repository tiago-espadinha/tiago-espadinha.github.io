/**
 * Interface text: the page chrome in index.html (through data-i18n keys) and
 * the labels and messages the scripts show. Every entry is { en, pt };
 * `{name}` placeholders are filled in by the code. `npm run locales` checks
 * that both languages are here and that every key in use exists.
 */
export const ui = {
  meta: {
    title: {
      en: "Tiago Simões | Web Developer",
      pt: "Tiago Simões | Web Developer",
    },
    description: {
      en: "Frontend developer with two years of experience building web and mobile apps in React, React Native and Angular. See TedDex, Nova Stream, MedFlow and SimLab.",
      pt: "Frontend developer com dois anos de experiência a criar aplicações web e mobile em React, React Native e Angular. Veja o TedDex, o Nova Stream, o MedFlow e o SimLab.",
    },
    ogDescription: {
      en: "Two years building web and mobile apps with React and Angular. Four live projects.",
      pt: "Dois anos a criar aplicações web e mobile com React e Angular. Quatro projetos online.",
    },
  },
  skipLink: {
    en: "Skip to my work",
    pt: "Saltar para os projetos",
  },
  nav: {
    label: {
      en: "Main",
      pt: "Principal",
    },
    brand: {
      en: "Tiago Simões, back to top",
      pt: "Tiago Simões, voltar ao topo",
    },
    experience: {
      en: "Experience",
      pt: "Experiência",
    },
    work: {
      en: "Work",
      pt: "Projetos",
    },
    contact: {
      en: "Contact",
      pt: "Contacto",
    },
  },
  // The switch shows the current language's code; its label names the
  // language it leads to, in that language.
  language: {
    code: { en: "EN", pt: "PT" },
    switchLabel: {
      en: "EN, ver em português",
      pt: "PT, view in English",
    },
  },
  hero: {
    lede: {
      en: "Frontend developer in Lisbon. Two years building web and mobile apps with React and Angular, and working my way down the stack.",
      pt: "Frontend developer em Lisboa. Dois anos a criar aplicações web e mobile com React e Angular, e a aprofundar o resto da stack.",
    },
    seeWork: {
      en: "See my work",
      pt: "Ver projetos",
    },
    downloadCv: {
      en: "Download CV",
      pt: "Descarregar CV",
    },
    // The note wraps a link to SimLab: noteBefore, the link, noteAfter.
    noteBefore: {
      en: "The flock is one of the simulations from",
      pt: "O bando é uma das simulações do",
    },
    noteAfter: {
      en: ". Move your cursor through it, or click to add more.",
      pt: ". Passe o cursor por ele, ou clique para juntar mais.",
    },
  },
  experience: {
    heading: {
      en: "Experience",
      pt: "Experiência",
    },
    tabsLabel: {
      en: "Work or education",
      pt: "Trabalho ou formação",
    },
    work: {
      en: "Work",
      pt: "Trabalho",
    },
    education: {
      en: "Education",
      pt: "Formação",
    },
    toolkit: {
      en: "Toolkit",
      pt: "Ferramentas",
    },
    range: { en: "{from} to {to}", pt: "{from} a {to}" },
    ongoing: { en: "{from} to now", pt: "{from} até hoje" },
  },
  work: {
    heading: {
      en: "Selected work",
      pt: "Projetos selecionados",
    },
    readCode: {
      en: "Read the code",
      pt: "Ver o código",
    },
    clipLabel: {
      en: "Short clip of {title} in use",
      pt: "Vídeo curto do {title} em uso",
    },
    expandClip: {
      en: "Expand the clip of {title}",
      pt: "Ampliar o vídeo do {title}",
    },
    viewerLabel: {
      en: "{title} clip",
      pt: "Vídeo do {title}",
    },
    clipPosition: {
      en: "Clip position",
      pt: "Posição do vídeo",
    },
    close: {
      en: "Close",
      pt: "Fechar",
    },
    play: {
      en: "Play clip",
      pt: "Reproduzir vídeo",
    },
    pause: {
      en: "Pause clip",
      pt: "Pausar vídeo",
    },
    hoverScroll: {
      en: "Hover to scroll",
      pt: "Passe o cursor para deslizar",
    },
    hoverZoom: {
      en: "Hover to look closer",
      pt: "Passe o cursor para ver de perto",
    },
  },
  contact: {
    heading: {
      en: "Get in touch",
      pt: "Vamos falar",
    },
    email: { en: "Email", pt: "Email" },
    cv: { en: "CV", pt: "CV" },
    cvValue: {
      en: "Download the PDF",
      pt: "Descarregar o PDF",
    },
  },
  form: {
    name: { en: "Name", pt: "Nome" },
    email: { en: "Email", pt: "Email" },
    message: {
      en: "Message",
      pt: "Mensagem",
    },
    nameMissing: {
      en: "Please add your name.",
      pt: "Indique o seu nome.",
    },
    emailInvalid: {
      en: "Please enter a valid email.",
      pt: "Introduza um email válido.",
    },
    messageMissing: {
      en: "Please write a message.",
      pt: "Escreva uma mensagem.",
    },
    send: {
      en: "Send message",
      pt: "Enviar mensagem",
    },
    sending: {
      en: "Sending",
      pt: "A enviar",
    },
    sent: { en: "Sent", pt: "Enviada" },
    retry: {
      en: "Try again",
      pt: "Tentar de novo",
    },
    success: {
      en: "Message sent. I will get back to you soon.",
      pt: "Mensagem enviada. Respondo em breve.",
    },
    failure: {
      en: "The message could not be sent. Please email me at {email} instead.",
      pt: "Não foi possível enviar a mensagem. Envie-me antes um email para {email}.",
    },
  },
  toTop: {
    en: "Back to top",
    pt: "Voltar ao topo",
  },
};
