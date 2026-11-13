(function () {
  if (/^#(?:invite_token|recovery_token)=/.test(window.location.hash)) {
    window.location.replace(new URL('auth/admin/' + window.location.hash, new URL('../../', document.currentScript.src)).href);
    return;
  }
  const store = window.AngelsenStore;
  let siteData = store.deepClone(store.defaultData);
  let publishedData = null;
  const imageIndexes = {};
  let lightboxTrigger = null;
  let lightboxProjectIndex = null;

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
    lightboxPrev: document.getElementById('lightboxPrev'),
    lightboxNext: document.getElementById('lightboxNext'),
    lightboxCount: document.getElementById('lightboxCount'),
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
  fetch('/.netlify/functions/site-data', { cache: 'no-store' })
    .then(function (response) { if (!response.ok) throw new Error('Innhold utilgjengelig'); return response.json(); })
    .then(function (result) { if (result.data) { publishedData = store.normalizeData(result.data); renderSite(); } })
    .catch(function () { /* Behold eksisterende innhold dersom tjenesten ikke er tilgjengelig. */ });

  function renderSite() {
    siteData = publishedData || store.deepClone(store.defaultData);

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
    setText(dom.contactHint, "E-postprogrammet åpnes med " + siteData.contact.email + " som mottaker. Husk å sende meldingen derfra.");
    setText(dom.contactModalHint, "E-postprogrammet åpnes med " + siteData.contact.email + " som mottaker. Husk å sende meldingen derfra.");

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
        }));
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
        + "<button class=\"open-lightbox-button gallery-expand-button\" type=\"button\" data-project-index=\"" + projectIndex + "\" aria-label=\"" + escapeAttribute('Forstørr bilde av ' + project.title) + "\"><span aria-hidden=\"true\">⤢</span></button>"
        + (project.images.length > 1 ? "<button class=\"gallery-nav prev\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-shift=\"-1\" aria-label=\"" + escapeAttribute('Forrige bilde: ' + project.title) + "\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m15 5-7 7 7 7\"/></svg></button>" : '')
        + "<img loading=\"lazy\" decoding=\"async\" src=\"" + escapeAttribute(store.resolveAssetPath(currentImage)) + "\" alt=\"" + escapeAttribute(project.title + " bilde " + (currentIndex + 1)) + "\">"
        + (project.images.length > 1 ? "<button class=\"gallery-nav next\" type=\"button\" data-project-index=\"" + projectIndex + "\" data-shift=\"1\" aria-label=\"" + escapeAttribute('Neste bilde: ' + project.title) + "\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m9 5 7 7-7 7\"/></svg></button><span class=\"gallery-count\" aria-live=\"polite\">" + (currentIndex + 1) + " / " + project.images.length + "</span>" : '')
        + "</div>"
        + (project.images.length > 1 ? "<div class=\"gallery-thumbs\" aria-label=\"" + escapeAttribute('Bilder for ' + project.title) + "\">" + project.images.map(function (image, index) {
          return "<button class=\"gallery-thumb" + (index === currentIndex ? ' active' : '') + "\" type=\"button\" data-thumb-project=\"" + projectIndex + "\" data-thumb-index=\"" + index + "\" aria-pressed=\"" + (index === currentIndex) + "\" aria-label=\"" + escapeAttribute('Vis bilde ' + (index + 1) + ' av ' + project.images.length + ': ' + project.title) + "\"><img loading=\"lazy\" decoding=\"async\" src=\"" + escapeAttribute(store.resolveAssetPath(image)) + "\" alt=\"\"></button>";
        }).join('') + "</div>" : '')
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
        openLightbox(projectIndex);
      });
    });

    Array.from(container.querySelectorAll(".gallery-main img")).forEach(function (image) {
      image.addEventListener("click", function () {
        const gallery = image.closest(".gallery-main");
        if (!gallery) {
          return;
        }
        const projectIndex = Number(gallery.querySelector(".open-lightbox-button")?.getAttribute("data-project-index"));
        if (Number.isNaN(projectIndex)) {
          return;
        }
        openLightbox(projectIndex);
      });
    });

    Array.from(container.querySelectorAll('.gallery-thumb')).forEach(function (button) {
      button.addEventListener('click', function () {
        setImage(Number(button.getAttribute('data-thumb-project')), Number(button.getAttribute('data-thumb-index')));
      });
    });

    Array.from(container.querySelectorAll('.gallery-main')).forEach(function (gallery) {
      let startX = null;
      gallery.addEventListener('touchstart', function (event) { startX = event.touches[0]?.clientX ?? null; }, { passive: true });
      gallery.addEventListener('touchend', function (event) {
        const endX = event.changedTouches[0]?.clientX;
        if (startX !== null && endX !== undefined && Math.abs(endX - startX) > 50) {
          const index = Number(gallery.querySelector('.open-lightbox-button').getAttribute('data-project-index'));
          if (siteData.projects[index].images.length > 1) shiftImage(index, endX < startX ? 1 : -1);
        }
        startX = null;
      }, { passive: true });
    });

  }

  function shiftImage(projectIndex, step) {
    const project = siteData.projects[projectIndex];
    const currentIndex = imageIndexes[projectIndex] || 0;
    setImage(projectIndex, (currentIndex + step + project.images.length) % project.images.length);
  }

  function setImage(projectIndex, index) {
    const project = siteData.projects[projectIndex];
    imageIndexes[projectIndex] = index;
    document.querySelectorAll('.open-lightbox-button[data-project-index="' + projectIndex + '"]').forEach(function (button) {
      const image = button.parentElement.querySelector('img');
      if (image) {
        image.src = store.resolveAssetPath(project.images[imageIndexes[projectIndex]]);
        image.alt = project.title + " bilde " + (imageIndexes[projectIndex] + 1);
      }
      const count = button.parentElement.querySelector('.gallery-count');
      if (count) count.textContent = (imageIndexes[projectIndex] + 1) + ' / ' + project.images.length;
    });
    document.querySelectorAll('.gallery-thumb[data-thumb-project="' + projectIndex + '"]').forEach(function (button) {
      const active = Number(button.getAttribute('data-thumb-index')) === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (lightboxProjectIndex === projectIndex && dom.lightbox.classList.contains('open')) updateLightbox();
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
      });
    }

    if (dom.lightboxClose && dom.lightbox) {
      dom.lightboxClose.addEventListener("click", closeLightbox);
      dom.lightboxPrev.addEventListener('click', function () { shiftImage(lightboxProjectIndex, -1); });
      dom.lightboxNext.addEventListener('click', function () { shiftImage(lightboxProjectIndex, 1); });
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
      if (dom.lightbox && dom.lightbox.classList.contains('open')) {
        if (event.key === 'ArrowLeft' && !dom.lightboxPrev.hidden) { event.preventDefault(); shiftImage(lightboxProjectIndex, -1); }
        if (event.key === 'ArrowRight' && !dom.lightboxNext.hidden) { event.preventDefault(); shiftImage(lightboxProjectIndex, 1); }
        if (event.key === 'Tab') {
          const controls = [dom.lightboxClose, dom.lightboxPrev, dom.lightboxNext].filter(function (item) { return !item.hidden; });
          const current = controls.indexOf(document.activeElement);
          if (event.shiftKey && current <= 0) { event.preventDefault(); controls[controls.length - 1].focus(); }
          else if (!event.shiftKey && (current === controls.length - 1 || current === -1)) { event.preventDefault(); controls[0].focus(); }
        }
      }
      if (event.key === "Escape") {
        if (dom.menuToggle && dom.headerNavContacts && dom.headerNavContacts.classList.contains('open')) {
          dom.headerNavContacts.classList.remove('open');
          dom.menuToggle.classList.remove('open');
          dom.menuToggle.setAttribute('aria-expanded', 'false');
          dom.menuToggle.focus();
        }
        closeLightbox();
        closeContactModal();
      }
    });

    window.addEventListener("storage", function () {
      renderSite();
    });
  }


  function openLightbox(projectIndex) {
    if (!dom.lightbox || !dom.lightboxImage) {
      return;
    }
    lightboxTrigger = document.activeElement;
    lightboxProjectIndex = projectIndex;
    updateLightbox();
    dom.lightbox.classList.add("open");
    dom.lightbox.setAttribute("aria-hidden", "false");
    dom.lightboxClose.focus();
  }

  function updateLightbox() {
    const project = siteData.projects[lightboxProjectIndex];
    const index = imageIndexes[lightboxProjectIndex] || 0;
    dom.lightboxImage.src = store.resolveAssetPath(project.images[index]);
    dom.lightboxImage.alt = project.title + ', bilde ' + (index + 1) + ' av ' + project.images.length;
    dom.lightboxCount.textContent = (index + 1) + ' / ' + project.images.length;
    dom.lightboxPrev.hidden = project.images.length < 2;
    dom.lightboxNext.hidden = project.images.length < 2;
  }

  function closeLightbox() {
    if (!dom.lightbox) {
      return;
    }
    if (!dom.lightbox.classList.contains("open")) return;
    dom.lightbox.classList.remove("open");
    dom.lightbox.setAttribute("aria-hidden", "true");
    if (lightboxTrigger && typeof lightboxTrigger.focus === "function") lightboxTrigger.focus();
    lightboxTrigger = null;
    lightboxProjectIndex = null;
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
