(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");

  // Mobile menu
  if (header && toggle) {
    var setOpen = function (open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) setOpen(false);
    });
  }

  // Hairline under the header once the page scrolls
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Gentle fade-in of content blocks
  var items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Contact form: the site is static, so the message is handed to the
  // visitor's mail client, addressed to the contact mailbox.
  var form = document.querySelector("form[data-mailto]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var subject = data.get("subject") || "Contact depuis maretan.com";
      var body = data.get("message") +
        "\n\n— " + data.get("name") + " <" + data.get("email") + ">";
      window.location.href = "mailto:" + form.getAttribute("data-mailto") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      var note = form.querySelector(".form-note");
      if (note) {
        note.textContent = "Merci ! Votre logiciel de messagerie va s’ouvrir pour envoyer le message.";
        note.setAttribute("data-state", "ok");
      }
    });
  }
})();
