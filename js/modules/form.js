export function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successMsg = document.getElementById("form-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    // Simple validation
    if (name.value.trim() === "") {
      showError("name", "Name is required");
      isValid = false;
    } else {
      clearError("name");
    }

    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      showError("email", "Please enter a valid email");
      isValid = false;
    } else {
      clearError("email");
    }

    if (message.value.trim().length < 20) {
      showError("message", "Message must be at least 20 characters");
      isValid = false;
    } else {
      clearError("message");
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        to_email: "test@email.com",
      };

      sendEmail(payload)
        .then(() => {
          successMsg.style.display = "block";
          form.reset();
          setTimeout(() => {
            successMsg.style.display = "none";
          }, 5000);
        })
        .catch((err) => {
          console.error("Email send error", err);
          alert(
            "There was an error sending your message. Please try again later.",
          );
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    }
  });

  function showError(field, msg) {
    const errorSpan = document.getElementById(`${field}-error`);
    if (errorSpan) errorSpan.textContent = msg;
    const fieldEl = document.getElementById(field);
    if (fieldEl) fieldEl.classList.add("error");
  }

  function clearError(field) {
    const errorSpan = document.getElementById(`${field}-error`);
    if (errorSpan) errorSpan.textContent = "";
    const fieldEl = document.getElementById(field);
    if (fieldEl) fieldEl.classList.remove("error");
  }

  function sendEmail(data) {
    if (typeof emailjs !== "undefined") {
      try {
        emailjs.init({
          publicKey: "5uACJShPx1gYp2dAa",
        });
      } catch (e) {}

      const serviceID = "service_9c4t158";
      const templateID = "template_cj71wjc";
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_email: data.to_email,
      };

      return emailjs.send(serviceID, templateID, templateParams);
    }

    // Fallback: open user's mail client via mailto (can't auto-send).
    console.warn("EmailJS not available, falling back to mailto");
    return new Promise((resolve) => {
      const subject = `Contact from ${data.name}`;
      const body = `Name: ${data.name}%0AEmail: ${data.email}%0A%0A${data.message}`;
      window.location.href = `mailto:${encodeURIComponent(data.to_email)}?subject=${encodeURIComponent(subject)}&body=${body}`;
      resolve();
    });
  }
}
