import { ui } from "../../content/ui.js";
import { el, externalLink, mount } from "../lib/dom.js";
import { t } from "../lib/i18n.js";
import { icon } from "../lib/icons.js";

/** Every place the contact details appear: the hero and the contact section. */
export function renderContact(contact) {
  const note = document.getElementById("contact-note");
  if (note) note.textContent = t(contact.note);

  renderChannels(contact);
  renderHeroLinks(contact);
  renderHeroCv(t(contact.cv));
}

/** Ways to reach me: one row each, in the same shape. */
function renderChannels(contact) {
  const channels = mount("contact-channels");
  if (!channels) return;

  const rows = [
    {
      label: t(ui.contact.email),
      value: contact.email,
      icon: "mail",
      url: `mailto:${contact.email}`,
    },
    ...contact.links.map((link) => ({
      label: link.label,
      value: link.handle,
      icon: link.icon,
      url: link.url,
      external: true,
    })),
  ];
  if (contact.cv) {
    rows.push({
      label: t(ui.contact.cv),
      value: t(ui.contact.cvValue),
      icon: "download",
      url: t(contact.cv),
      download: true,
    });
  }

  rows.forEach((row) => {
    const a = row.external ? externalLink("", row.url) : el("a");
    a.href = row.url;
    if (row.download) a.download = "";

    const badge = el("span", "channel-icon");
    badge.appendChild(icon(row.icon));
    const text = el("span", "channel-text");
    text.append(
      el("span", "channel-label", row.label),
      el("span", "channel-value", row.value),
    );
    const arrow = icon(row.download ? "download" : "arrowUpRight");
    arrow.classList.add("channel-arrow");

    a.append(badge, text, arrow);
    const item = el("li");
    item.appendChild(a);
    channels.appendChild(item);
  });
}

/** Hero: the same destinations as icon-only buttons. */
function renderHeroLinks(contact) {
  const heroLinks = mount("hero-links");
  if (!heroLinks) return;

  const email = el("a");
  email.href = `mailto:${contact.email}`;
  email.setAttribute("aria-label", t(ui.contact.email));
  email.appendChild(icon("mail"));
  heroLinks.appendChild(email);

  contact.links.forEach((link) => {
    const a = externalLink("", link.url);
    a.setAttribute("aria-label", link.label);
    a.appendChild(icon(link.icon));
    heroLinks.appendChild(a);
  });
}

/** The hero's Download CV button only shows once a CV path is set. */
function renderHeroCv(cv) {
  const heroCv = document.getElementById("cv-link");
  if (!heroCv || !cv) return;
  heroCv.href = cv;
  heroCv.download = "";
  heroCv.append(icon("download"));
  heroCv.hidden = false;
}
