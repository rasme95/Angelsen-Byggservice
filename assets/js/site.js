(function () {
  const store = window.AngelsenStore;
  let siteData = store.loadSiteData();
  const imageIndexes = {};

  const dom = {
    brandName: document.getElementById("brandName"),
    brandSubline: document.getElementById("brandSubline"),
    menuToggle: document.getElementById("menuToggle"),
    headerNavContacts: document.getElementById("headerNavContacts"),
    headerEmail: document.getElementById("headerEmail"),
    headerPhone: document.getElementById("headerPhone"),
    heroTitle: document.getElementById("heroTitle"),
    heroLead: document.getElementById("heroLead"),
    heroBadgeTitle: document.getElementById("heroBadgeTitle"),
    projectGridList: document.getElementById("projectGridList"),
    allProjectList: document.getElementById("allProjectList"),
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

    setText(dom.brandName, siteData.businessName);
    setText(dom.brandSubline, siteData.brandSubline);
    setText(dom.headerEmail, siteData.contact.email);
    setHref(dom.headerEmail, "mailto:" + siteData.contact.email);
    setText(dom.headerPhone, siteData.contact.phone);
    setHref(dom.headerPhone, "tel:" + store.sanitizePhone(siteData.contact.phone));
    if (document.body.classList.contains("projects-page")) {
      setText(dom.heroTitle, "Alle prosjekter");
      setText(dom.heroLead, "Her finner du en samlet oversikt over alle utvalgte prosjekter.");
    } else {
      setText(dom.heroTitle, siteData.heroTitle);
      setText(dom.heroLead, siteData.heroLead);
    }
    setText(dom.contactModalTitle, siteData.contactTitle);
    setText(dom.footerBrand, siteData.businessName);
    setText(dom.footerSummary, siteData.contact.area + ".");
    setText(dom.footerEmail, siteData.contact.email);
    setHref(dom.footerEmail, "mailto:" + siteData.contact.email);
    setText(dom.footerPhone, siteData.contact.phone);
    setHref(dom.footerPhone, "tel:" + store.sanitizePhone(siteData.contact.phone));
    setText(dom.contactHint, "Mottaker settes til " + siteData.contact.email + ".");
    setText(dom.contactModalHint, "Mottaker settes til " + siteData.contact.email + ".");

    renderProjectLists();
  }

  function renderProjectLists() {
    if (dom.projectGridList) {
      renderProjectGrid(dom.projectGridList, siteData.projects
        .map(function (project, index) {
          return { project: project, index: index };
        })
        .filter(function (item) {
          return item.project.showOnHomepage !== false;
        })
        .slice(0, 5));
    }
    if (dom.allProjectList) {
      renderProjectGrid(dom.allProjectList, siteData.projects.map(function (project, index) {
        return { project: project, index: index };
      }));
    }
  }

  function renderProjectGrid(container, projectItems) {
    container.innerHTML = projectItems.map(function (item) {
      const project = item.project;
      const projectIndex = item.index;
      const currentIndex = Math.min(imageIndexes[projectIndex] || 0, project.images.length - 1);
      const currentImage = project.images[currentIndex] || project.images[0];

      return "<article class=\"project-carousel-card glass-card reveal reveal-delay-1\">"
        + "<div class=\"project-card-head\">"
        + "<h2>" + escapeHtml(project.title) + "</h2>"
        + "</div>"
        + "<div class=\"gallery-main\">"
        + "<button class=\"open-lightbox-button gallery-expand-button\" type=\"button\" data-project-index=\"" + projectIndex + "\" aria-label=\"Utvid bilde\"><i class=\"fa-solid fa-up-right-and-down-left-from-center\" aria-hidden=\"true\"></i></button>"
        + "<button class=\"gallery-nav prev\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-shift=\"-1\" aria-label=\"Forrige bilde\">‹</button>"
        + "<img src=\"" + escapeAttribute(store.resolveAssetPath(currentImage)) + "\" alt=\"" + escapeAttribute(project.title + " bilde " + (currentIndex + 1)) + "\">"
        + "<button class=\"gallery-nav next\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-shift=\"1\" aria-label=\"Neste bilde\">›</button>"
        + "</div>"
        + "</article>";
    }).join("");

    Array.from(container.querySelectorAll(".gallery-nav")).forEach(function (button) {
      button.addEventListener("click", function () {
        shiftImage(Number(button.getAttribute("data-project-index")), Number(button.getAttribute("data-shift")));
      });
    });

    Array.from(container.querySelectorAll(".open-lightbox-button")).forEach(function (button) {
      button.addEventListener("click", function () {
        const projectIndex = Number(button.getAttribute("data-project-index"));
        const project = siteData.projects[projectIndex];
        openLightbox(project.images[imageIndexes[projectIndex] || 0]);
      });
    });

    Array.from(container.querySelectorAll(".gallery-main img")).forEach(function (image) {
      image.addEventListener("click", function () {
        const gallery = image.closest(".gallery-main");
        if (!gallery) {
          return;
        }
        const projectIndex = Number(gallery.querySelector(".gallery-nav")?.getAttribute("data-project-index"));
        if (Number.isNaN(projectIndex)) {
          return;
        }
        const project = siteData.projects[projectIndex];
        openLightbox(project.images[imageIndexes[projectIndex] || 0]);
      });
    });

  }

  function shiftImage(projectIndex, step) {
    const project = siteData.projects[projectIndex];
    const currentIndex = imageIndexes[projectIndex] || 0;
    imageIndexes[projectIndex] = (currentIndex + step + project.images.length) % project.images.length;
    renderProjectLists();
  }

  function wireEvents() {
    if (dom.menuToggle && dom.headerNavContacts) {
      dom.menuToggle.addEventListener("click", function () {
        const isOpen = dom.headerNavContacts.classList.toggle("open");
        dom.menuToggle.classList.toggle("open", isOpen);
        dom.menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      Array.from(dom.headerNavContacts.querySelectorAll("a")).forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.innerWidth <= 980) {
            dom.headerNavContacts.classList.remove("open");
            dom.menuToggle.classList.remove("open");
            dom.menuToggle.setAttribute("aria-expanded", "false");
          }
        });
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 980) {
          dom.headerNavContacts.classList.remove("open");
          dom.menuToggle.classList.remove("open");
          dom.menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (dom.contactForm) {
      dom.contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendContactMail({
          name: dom.contactName.value.trim(),
          phone: dom.contactPhone.value.trim(),
          email: dom.contactEmail.value.trim(),
          subject: dom.contactSubject.value.trim(),
          message: dom.contactMessage.value.trim()
        });
        clearContactForm(false);
      });
    }

    if (dom.contactModalForm) {
      dom.contactModalForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendContactMail({
          name: dom.modalContactName.value.trim(),
          phone: dom.modalContactPhone.value.trim(),
          email: dom.modalContactEmail.value.trim(),
          subject: dom.modalContactSubject.value.trim(),
          message: dom.modalContactMessage.value.trim()
        });
        clearContactForm(true);
      });
    }

    if (dom.lightboxClose && dom.lightbox) {
      dom.lightboxClose.addEventListener("click", closeLightbox);
      dom.lightbox.addEventListener("click", function (event) {
        if (event.target === dom.lightbox) {
          closeLightbox();
        }
      });
    }

    if (dom.contactModalClose && dom.contactModal) {
      dom.contactModalClose.addEventListener("click", closeContactModal);
      dom.contactModal.addEventListener("click", function (event) {
        if (event.target === dom.contactModal) {
          closeContactModal();
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
        closeContactModal();
      }
    });

    window.addEventListener("storage", function () {
      renderSite();
    });
  }


  function openLightbox(image) {
    if (!dom.lightbox || !dom.lightboxImage) {
      return;
    }
    dom.lightboxImage.src = store.resolveAssetPath(image);
    dom.lightbox.classList.add("open");
    dom.lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!dom.lightbox) {
      return;
    }
    dom.lightbox.classList.remove("open");
    dom.lightbox.setAttribute("aria-hidden", "true");
  }

  function openContactModal() {
    if (!dom.contactModal) {
      return;
    }
    dom.contactModal.classList.add("open");
    dom.contactModal.setAttribute("aria-hidden", "false");
  }

  function closeContactModal() {
    if (!dom.contactModal) {
      return;
    }
    dom.contactModal.classList.remove("open");
    dom.contactModal.setAttribute("aria-hidden", "true");
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

  function clearContactForm(isModal) {
    if (isModal) {
      dom.modalContactName.value = "";
      dom.modalContactPhone.value = "";
      dom.modalContactEmail.value = "";
      dom.modalContactSubject.value = "";
      dom.modalContactMessage.value = "";
      return;
    }

    dom.contactName.value = "";
    dom.contactPhone.value = "";
    dom.contactEmail.value = "";
    dom.contactSubject.value = "";
    dom.contactMessage.value = "";
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

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function setHref(element, value) {
    if (element) {
      element.href = value;
    }
  }
}());