/* Checks the enquiry form, then posts it to the Zenith inbox. */
(function () {
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var submitButton = form.querySelector("button[type='submit']");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldError(input) {
    var field = input.closest(".field");
    return field ? field.querySelector(".field-error") : null;
  }

  function setError(input, message) {
    var slot = fieldError(input);
    if (slot) slot.textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function digitsOnly(value) {
    return value.replace(/\D/g, "");
  }

  function validate() {
    var name = form.elements.name;
    var email = form.elements.email;
    var phone = form.elements.phone;
    var interest = form.elements.interest;
    var message = form.elements.message;
    var valid = true;

    setError(name, "");
    setError(email, "");
    setError(phone, "");
    setError(interest, "");
    setError(message, "");

    if (name.value.trim().length < 2) {
      setError(name, "Enter your name.");
      valid = false;
    }
    if (!emailPattern.test(email.value.trim())) {
      setError(email, "Enter a valid email address.");
      valid = false;
    }
    if (digitsOnly(phone.value).length < 8) {
      setError(phone, "Enter a phone number we can call.");
      valid = false;
    }
    if (!interest.value) {
      setError(interest, "Select a business area.");
      valid = false;
    }
    if (message.value.trim().length < 10) {
      setError(message, "Add a short note about the requirement.");
      valid = false;
    }
    return valid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    if (form.elements._honey.value) return;
    if (!validate()) {
      status.textContent = "Please correct the highlighted fields.";
      status.classList.add("is-error");
      return;
    }

    var payload = {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      interest: form.elements.interest.value,
      message: form.elements.message.value.trim(),
      _subject: form.elements._subject.value,
      _template: "table",
      _captcha: "false"
    };

    submitButton.disabled = true;
    var originalLabel = submitButton.textContent;
    submitButton.textContent = "Sending...";

    fetch("https://formsubmit.co/ajax/support@zenithglobiz.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (body) {
          return { ok: response.ok, body: body };
        });
      })
      .then(function (result) {
        var accepted = result.ok && String(result.body.success) === "true";
        if (!accepted) throw new Error("rejected");
        form.reset();
        status.textContent = "Thank you. Your enquiry has been sent to Zenith.";
      })
      .catch(function () {
        status.textContent = "The form could not be sent. Email support@zenithglobiz.com or use WhatsApp.";
        status.classList.add("is-error");
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      });
  });
})();
