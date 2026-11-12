import { ui } from "../../content/ui.js";
import { t } from "../lib/i18n.js";
import { icon } from "../lib/icons.js";

/**
 * Contact form: validates in the page, then sends through EmailJS using the
 * ids in content/contact.js (`form`). The EmailJS script is only fetched on the
 * first send. If it cannot load or the send fails, the visitor is pointed to
 * the email address instead.
 */
const SDK_URL =
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

const RULES = {
  name: (v) => (v ? "" : t(ui.form.nameMissing)),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? "" : t(ui.form.emailInvalid)),
  message: (v) => (v ? "" : t(ui.form.messageMissing)),
};

// The plane gets at least one full lap, so a fast send still reads as sent.
const MIN_SENDING_MS = 1100;
// How long "Sent" stays before the button goes back to "Send message".
const SENT_HOLD_MS = 3000;

export function initContactForm(contact) {
  const form = document.getElementById("contact-form");
  if (!form) return;
  // Without EmailJS ids there is nothing to send with, so leave the form out.
  if (!contact.form) {
    form.hidden = true;
    return;
  }

  const status = document.getElementById("form-status");
  const button = form.querySelector('button[type="submit"]');
  const setButton = buildSendButton(button);
  let resetTimer;

  function validate(field) {
    const input = form.elements[field];
    const message = RULES[field](input.value.trim());
    document.getElementById(`${field}-error`).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.dataset.kind = kind;
  }

  // Once a field has been flagged, re-check it as the visitor types.
  Object.keys(RULES).forEach((field) => {
    form.elements[field].addEventListener("input", () => {
      if (form.elements[field].getAttribute("aria-invalid") === "true") {
        validate(field);
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearTimeout(resetTimer);
    setStatus("", "");

    const invalid = Object.keys(RULES).filter((field) => !validate(field));
    if (invalid.length) {
      form.elements[invalid[0]].focus();
      return;
    }

    button.disabled = true;
    setButton("sending");
    try {
      const emailjs = await loadSdk();
      await Promise.all([
        emailjs.send(
          contact.form.serviceId,
          contact.form.templateId,
          {
            from_name: form.elements.name.value.trim(),
            from_email: form.elements.email.value.trim(),
            message: form.elements.message.value.trim(),
          },
          {
            publicKey: contact.form.publicKey,
          },
        ),
        wait(MIN_SENDING_MS),
      ]);
      form.reset();
      setButton("sent");
      setStatus(t(ui.form.success), "success");
      resetTimer = setTimeout(() => setButton("idle"), SENT_HOLD_MS);
    } catch (err) {
      console.error("Contact form send failed", err);
      setButton("error");
      setStatus(
        t(ui.form.failure, {
          email: contact.email,
        }),
        "error",
      );
    } finally {
      button.disabled = false;
    }
  });
}

/**
 * Fill the submit button with one face per state (see .btn-send in
 * css/components/form.css) and return a setter. The faces are decorative; the button
 * is named by aria-label, which follows the state.
 */
function buildSendButton(button) {
  const LABELS = {
    idle: t(ui.form.send),
    sending: t(ui.form.sending),
    sent: t(ui.form.sent),
    error: t(ui.form.retry),
  };

  button.classList.add("btn-send");
  button.replaceChildren(
    face("send-label", null, LABELS.idle),
    face("send-plane", "mail"),
    face("send-sent", "check", LABELS.sent),
    face("send-retry", "alert", LABELS.error),
  );

  const set = (state) => {
    button.dataset.state = state;
    button.setAttribute("aria-label", LABELS[state]);
  };
  set("idle");
  return set;
}

function face(className, iconName, text) {
  const span = document.createElement("span");
  span.className = `send-face ${className}`;
  span.setAttribute("aria-hidden", "true");
  if (iconName) span.append(icon(iconName));
  if (text) span.append(text);
  return span;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let sdkPromise;
function loadSdk() {
  sdkPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.addEventListener("load", () => resolve(window.emailjs));
    script.addEventListener("error", () => {
      sdkPromise = undefined; // allow a retry on the next submit
      reject(new Error("EmailJS failed to load"));
    });
    document.head.appendChild(script);
  });
  return sdkPromise;
}
