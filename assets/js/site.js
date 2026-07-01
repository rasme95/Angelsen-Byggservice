(function () {
  const store = window.AngelsenStore;
  let siteData = store.loadSiteData();
  const imageIndexes = {};
  const autoSlideHandles = {};

  const dom = {
    brandName: document.getElementById("brandName"),
    brandSubline: document.getElementById("brandSubline"),
    headerPhone: document.getElementById("headerPhone"),
    heroTitle: document.getElementById("heroTitle"),
    heroLead: document.getElementById("heroLead"),
    heroImage: document.getElementById("heroImage"),
    heroBadgeTitle: document.getElementById("heroBadgeTitle"),
    servicePills: document.getElementById("servicePills"),
    projectGridList: document.getElementById("projectGridList"),
    contactTitle: document.getElementById("contactTitle"),
    contactList: document.getElementById("contactList"),
    footerBrand: document.getElementById("footerBrand"),
    footerSummary: document.getElementById("footerSummary"),
    footerEmail: document.getElementById("footerEmail"),
    footerPhone: document.getElementById("footerPhone"),
    contactForm: document.getElementById("contactForm"),
    contactName: document.getElementById("contactName"),
    contactPhone: document.getElementById("contactPhone"),
    contactEmail: document.getElementById("contactEmail"),
    contactSubject: document.getElementById("contactSubject"),
    contactMessage: document.getElementById("contactMessage"),
    contactHint: document.getElementById("contactHint"),
    stickyContactBar: document.getElementById("stickyContactBar"),
    stickyContactButton: document.getElementById("stickyContactButton"),
    stickyPhone: document.getElementById("stickyPhone"),
    lightbox: document.getElementById("lightbox"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxClose: document.getElementById("lightboxClose"),
    contactModal: document.getElementById("contactModal"),
    contactModalClose: document.getElementById("contactModalClose"),
    contactModalTitle: document.getElementById("contactModalTitle"),
    contactModalForm: document.getElementById("contactModalForm"),
    modalContactName: document.getElementById("modalContactName"),
    modalContactPhone: document.getElementById("modalContactPhone"),
    modalContactEmail: document.getElementById("modalContactEmail"),
    modalContactSubject: document.getElementById("modalContactSubject"),
    modalContactMessage: document.getElementById("modalContactMessage"),
    contactModalHint: document.getElementById("contactModalHint")
  };

  renderSite();
  wireEvents();

  function renderSite() {
    siteData = store.loadSiteData();

    dom.brandName.textContent = siteData.businessName;
    dom.brandSubline.textContent = siteData.brandSubline;
    dom.headerPhone.textContent = siteData.contact.phone;
    dom.headerPhone.href = "tel:" + store.sanitizePhone(siteData.contact.phone);
    dom.stickyPhone.textContent = siteData.contact.phone;
    dom.stickyPhone.href = "tel:" + store.sanitizePhone(siteData.contact.phone);
    dom.heroTitle.textContent = siteData.heroTitle;
    dom.heroLead.textContent = siteData.heroLead;
    dom.heroImage.src = store.resolveAssetPath(siteData.heroImage || siteData.projects[0].images[0]);
    dom.heroImage.alt = siteData.businessName + " prosjektbilde";
    dom.heroBadgeTitle.textContent = siteData.heroBadgeTitle;
    dom.contactTitle.textContent = siteData.contactTitle;
    dom.contactModalTitle.textContent = siteData.contactTitle;
    dom.footerBrand.textContent = siteData.businessName;
    dom.footerSummary.textContent = siteData.contact.area + ".";
    dom.footerEmail.textContent = siteData.contact.email;
    dom.footerEmail.href = "mailto:" + siteData.contact.email;
    dom.footerPhone.textContent = siteData.contact.phone;
    dom.footerPhone.href = "tel:" + store.sanitizePhone(siteData.contact.phone);
    dom.contactHint.textContent = "Mottaker settes til " + siteData.contact.email + ".";
    dom.contactModalHint.textContent = "Mottaker settes til " + siteData.contact.email + ".";

    dom.servicePills.innerHTML = siteData.services.map(function (service) {
      return "<span class=\"service-pill\">" + escapeHtml(service) + "</span>";
    }).join("");

    dom.contactList.innerHTML = [
      { mark: "T", title: "Telefon", value: siteData.contact.phone, href: "tel:" + store.sanitizePhone(siteData.contact.phone) },
      { mark: "E", title: "E-post", value: siteData.contact.email, href: "mailto:" + siteData.contact.email },
      { mark: "O", title: "Område", value: siteData.contact.area }
    ].map(function (item) {
      const content = item.href ? "<a href=\"" + escapeAttribute(item.href) + "\">" + escapeHtml(item.value) + "</a>" : escapeHtml(item.value);
      return "<div class=\"contact-row\"><div class=\"contact-mark\">" + item.mark + "</div><div><strong>" + item.title + "</strong><span>" + content + "</span></div></div>";
    }).join("");

    renderProjectGrids();
  }

  function renderProjectGrids() {
    dom.projectGridList.innerHTML = siteData.projects.map(function (project, projectIndex) {
      const currentIndex = Math.min(imageIndexes[projectIndex] || 0, project.images.length - 1);
      const currentImage = project.images[currentIndex] || project.images[0];

      return "<article class=\"project-carousel-card glass-card reveal reveal-delay-1\">"
        + "<div class=\"project-card-head\">"
        + "<p class=\"eyebrow\">" + escapeHtml(project.category || "Prosjekt") + "</p>"
        + "<h2>" + escapeHtml(project.title) + "</h2>"
        + "</div>"
        + "<div class=\"gallery-main\">"
        + "<button class=\"gallery-nav prev\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-shift=\"-1\" aria-label=\"Forrige bilde\">‹</button>"
        + "<img src=\"" + escapeAttribute(store.resolveAssetPath(currentImage)) + "\" alt=\"" + escapeAttribute(project.title + " bilde " + (currentIndex + 1)) + "\">"
        + "<button class=\"gallery-nav next\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-shift=\"1\" aria-label=\"Neste bilde\">›</button>"
        + "<div class=\"gallery-overlay\"><div><small>Grid " + (projectIndex + 1) + "</small><h3>" + escapeHtml(project.title) + "</h3></div><button class=\"button secondary open-lightbox-button\" type=\"button\" data-project-index=\"" + projectIndex + "\">Åpne stort bilde</button></div>"
        + "</div>"
        + "<div class=\"gallery-thumbs\">"
        + project.images.map(function (image, imageIndex) {
          const activeClass = imageIndex === currentIndex ? " active" : "";
          return "<button class=\"gallery-thumb" + activeClass + "\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-image-index=\"" + imageIndex + "\"><img src=\"" + escapeAttribute(store.resolveAssetPath(image)) + "\" alt=\"Miniatyr " + (imageIndex + 1) + "\"></button>";
        }).join("")
        + "</div>"
        + "</article>";
    }).join("");

    Array.from(dom.projectGridList.querySelectorAll(".gallery-nav")).forEach(function (button) {
      button.addEventListener("click", function () {
        shiftImage(Number(button.getAttribute("data-project-index")), Number(button.getAttribute("data-shift")));
      });
    });

    Array.from(dom.projectGridList.querySelectorAll(".gallery-thumb")).forEach(function (button) {
      button.addEventListener("click", function () {
        const projectIndex = Number(button.getAttribute("data-project-index"));
        imageIndexes[projectIndex] = Number(button.getAttribute("data-image-index"));
        renderProjectGrids();
        startAutoSlide(projectIndex);
      });
    });

    Array.from(dom.projectGridList.querySelectorAll(".open-lightbox-button")).forEach(function (button) {
      button.addEventListener("click", function () {
        const projectIndex = Number(button.getAttribute("data-project-index"));
        const project = siteData.projects[projectIndex];
        openLightbox(project.images[imageIndexes[projectIndex] || 0]);
      });
    });

    siteData.projects.forEach(function (_project, index) {
      startAutoSlide(index);
    });
  }

  function shiftImage(projectIndex, step) {
    const project = siteData.projects[projectIndex];
    const currentIndex = imageIndexes[projectIndex] || 0;
    imageIndexes[projectIndex] = (currentIndex + step + project.images.length) % project.images.length;
    renderProjectGrids();
    startAutoSlide(projectIndex);
  }

  function wireEvents() {
    dom.contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendContactMail({
        name: dom.contactName.value.trim(),
        phone: dom.contactPhone.value.trim(),
        email: dom.contactEmail.value.trim(),
        subject: dom.contactSubject.value.trim(),
        message: dom.contactMessage.value.trim()
      });
    });

    dom.contactModalForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendContactMail({
        name: dom.modalContactName.value.trim(),
        phone: dom.modalContactPhone.value.trim(),
        email: dom.modalContactEmail.value.trim(),
        subject: dom.modalContactSubject.value.trim(),
        message: dom.modalContactMessage.value.trim()
      });
    });

    dom.stickyContactButton.addEventListener("click", openContactModal);

    dom.lightboxClose.addEventListener("click", closeLightbox);
    dom.lightbox.addEventListener("click", function (event) {
      if (event.target === dom.lightbox) {
        closeLightbox();
      }
    });

    dom.contactModalClose.addEventListener("click", closeContactModal);
    dom.contactModal.addEventListener("click", function (event) {
      if (event.target === dom.contactModal) {
        closeContactModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
        closeContactModal();
      }
    });

    window.addEventListener("scroll", toggleStickyContactBar);

    window.addEventListener("storage", function () {
      renderSite();
    });

    toggleStickyContactBar();
  }

  function startAutoSlide(projectIndex) {
    window.clearInterval(autoSlideHandles[projectIndex]);
    const project = siteData.projects[projectIndex];
    if (!project || project.images.length < 2) {
      return;
    }

    autoSlideHandles[projectIndex] = window.setInterval(function () {
      shiftImage(projectIndex, 1);
    }, 4500);
  }

  function openLightbox(image) {
    dom.lightboxImage.src = store.resolveAssetPath(image);
    dom.lightbox.classList.add("open");
    dom.lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    dom.lightbox.classList.remove("open");
    dom.lightbox.setAttribute("aria-hidden", "true");
  }

  function openContactModal() {
    dom.contactModal.classList.add("open");
    dom.contactModal.setAttribute("aria-hidden", "false");
  }

  function closeContactModal() {
    dom.contactModal.classList.remove("open");
    dom.contactModal.setAttribute("aria-hidden", "true");
  }

  function toggleStickyContactBar() {
    const shouldShow = window.scrollY > 280;
    dom.stickyContactBar.classList.toggle("visible", shouldShow);
    dom.stickyContactBar.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  }

  function sendContactMail(values) {
    const subject = values.subject || "Forespørsel fra nettsiden";
    const lines = [
      "Navn: " + values.name,
      "Telefon: " + values.phone,
      "E-post: " + values.email,
      "Type oppdrag: " + subject,
      "",
      values.message
    ];

    const mailto = "mailto:" + encodeURIComponent(siteData.contact.email)
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(lines.join("\n"));

    window.location.href = mailto;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
}());