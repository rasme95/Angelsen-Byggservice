(function () {
  const store = window.AngelsenStore;
  let siteData = store.loadSiteData();
  let selectedProjectIndex = 0;
  let selectedImageIndex = 0;
  let autoSlideHandle = null;
  const dom = {
    brandName: document.getElementById("brandName"),
    brandSubline: document.getElementById("brandSubline"),
    headerPhone: document.getElementById("headerPhone"),
    heroTitle: document.getElementById("heroTitle"),
    heroLead: document.getElementById("heroLead"),
    heroImage: document.getElementById("heroImage"),
    heroBadgeTitle: document.getElementById("heroBadgeTitle"),
    heroBadgeText: document.getElementById("heroBadgeText"),
    highlightsList: document.getElementById("highlightsList"),
    heroCards: document.getElementById("heroCards"),
    servicesIntro: document.getElementById("servicesIntro"),
    servicesList: document.getElementById("servicesList"),
    aboutTitle: document.getElementById("aboutTitle"),
    aboutText: document.getElementById("aboutText"),
    processList: document.getElementById("processList"),
    projectNav: document.getElementById("projectNav"),
    projectStage: document.getElementById("projectStage"),
    contactTitle: document.getElementById("contactTitle"),
    contactBody: document.getElementById("contactBody"),
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
    lightbox: document.getElementById("lightbox"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxClose: document.getElementById("lightboxClose")
  };
  renderSite();
  wireEvents();
  startAutoSlide();
  function renderSite() {
    siteData = store.loadSiteData();
    selectedProjectIndex = Math.min(selectedProjectIndex, siteData.projects.length - 1);
    if (selectedProjectIndex < 0) { selectedProjectIndex = 0; }
    const activeProject = siteData.projects[selectedProjectIndex];
    selectedImageIndex = Math.min(selectedImageIndex, activeProject.images.length - 1);
    if (selectedImageIndex < 0) { selectedImageIndex = 0; }
    dom.brandName.textContent = siteData.businessName;
    dom.brandSubline.textContent = siteData.brandSubline;
    dom.headerPhone.textContent = siteData.contact.phone;
    dom.headerPhone.href = "tel:" + store.sanitizePhone(siteData.contact.phone);
    dom.heroTitle.textContent = siteData.heroTitle;
    dom.heroLead.textContent = siteData.heroLead;
    dom.heroImage.src = store.resolveAssetPath(siteData.heroImage || activeProject.images[0]);
    dom.heroImage.alt = siteData.businessName + " prosjektbilde";
    dom.heroBadgeTitle.textContent = siteData.heroBadgeTitle;
    dom.heroBadgeText.textContent = siteData.heroBadgeText;
    dom.servicesIntro.textContent = siteData.servicesIntro;
    dom.aboutTitle.textContent = siteData.aboutTitle;
    dom.aboutText.textContent = siteData.aboutText;
    dom.contactTitle.textContent = siteData.contactTitle;
    dom.contactBody.textContent = siteData.contactBody;
    dom.footerBrand.textContent = siteData.businessName;
    dom.footerSummary.textContent = siteData.brandSubline + ". " + siteData.contact.area + ".";
    dom.footerEmail.textContent = siteData.contact.email;
    dom.footerEmail.href = "mailto:" + siteData.contact.email;
    dom.footerPhone.textContent = siteData.contact.phone;
    dom.footerPhone.href = "tel:" + store.sanitizePhone(siteData.contact.phone);
    dom.contactHint.textContent = "Mottaker settes til " + siteData.contact.email + ".";
    dom.highlightsList.innerHTML = siteData.highlights.map(function (item) {
      return "<article class=\"metric-card\"><strong>" + escapeHtml(item.value) + "</strong><span>" + escapeHtml(item.label) + "</span></article>";
    }).join("");
    dom.heroCards.innerHTML = siteData.heroCards.map(function (item) {
      return "<article class=\"hero-mini-card\"><strong>" + escapeHtml(item.title) + "</strong><span>" + escapeHtml(item.text) + "</span></article>";
    }).join("");
    dom.servicesList.innerHTML = siteData.services.map(function (service, index) {
      return "<div class=\"service-item\"><div class=\"service-number\">" + (index + 1) + "</div><div><strong>" + escapeHtml(service) + "</strong><span>Kan kombineres med andre arbeider i samme oppdrag ved behov.</span></div></div>";
    }).join("");
    dom.processList.innerHTML = siteData.process.map(function (step, index) {
      return "<div class=\"process-item\"><div class=\"process-number\">" + (index + 1) + "</div><div><strong>" + escapeHtml(step.title) + "</strong><span>" + escapeHtml(step.text) + "</span></div></div>";
    }).join("");
    dom.contactList.innerHTML = [
      { mark: "T", title: "Telefon", value: siteData.contact.phone, href: "tel:" + store.sanitizePhone(siteData.contact.phone) },
      { mark: "E", title: "E-post", value: siteData.contact.email, href: "mailto:" + siteData.contact.email },
      { mark: "O", title: "Område", value: siteData.contact.area },
      { mark: "F", title: "Facebook", value: "Se oppdateringer", href: siteData.social.facebook }
    ].map(function (item) {
      const content = item.href ? "<a href=\"" + escapeAttribute(item.href) + "\"" + (item.href.indexOf("http") === 0 ? " target=\"_blank\" rel=\"noreferrer\"" : "") + ">" + escapeHtml(item.value) + "</a>" : escapeHtml(item.value);
      return "<div class=\"contact-row\"><div class=\"contact-mark\">" + item.mark + "</div><div><strong>" + item.title + "</strong><span>" + content + "</span></div></div>";
    }).join("");
    renderProjectNav();
    renderProjectStage();
  }
  function renderProjectNav() {
    dom.projectNav.innerHTML = siteData.projects.map(function (project, index) {
      const activeClass = index === selectedProjectIndex ? " active" : "";
      return "<button type=\"button\" class=\"" + activeClass + "\" data-project-index=\"" + index + "\"><strong>" + escapeHtml(project.title) + "</strong><span>" + escapeHtml(project.category) + "</span></button>";
    }).join("");
    Array.from(dom.projectNav.querySelectorAll("button")).forEach(function (button) {
      button.addEventListener("click", function () {
        selectedProjectIndex = Number(button.getAttribute("data-project-index"));
        selectedImageIndex = 0;
        renderSite();
        startAutoSlide();
      });
    });
  }
  function renderProjectStage() {
    const project = siteData.projects[selectedProjectIndex];
    const currentImage = project.images[selectedImageIndex] || project.images[0];
    dom.projectStage.innerHTML = "<div class=\"project-top\"><div class=\"project-title-wrap\"><p class=\"eyebrow\">" + escapeHtml(project.category) + "</p><h2>" + escapeHtml(project.title) + "</h2><p class=\"project-summary\">" + escapeHtml(project.summary) + "</p></div><div class=\"project-meta\"><div class=\"meta-chip\"><span class=\"contact-mark\">L</span><p>" + escapeHtml(project.delivery || "Utført arbeid") + "</p></div><div class=\"meta-chip\"><span class=\"contact-mark\">B</span><p>" + project.images.length + " bilder i prosjektet</p></div></div></div><div class=\"gallery-main\"><button class=\"gallery-nav prev\" type=\"button\" data-shift=\"-1\" aria-label=\"Forrige bilde\">‹</button><img src=\"" + escapeAttribute(store.resolveAssetPath(currentImage)) + "\" alt=\"" + escapeAttribute(project.title + " bilde " + (selectedImageIndex + 1)) + "\"><button class=\"gallery-nav next\" type=\"button\" data-shift=\"1\" aria-label=\"Neste bilde\">›</button><div class=\"gallery-overlay\"><div><small>Prosjekt " + (selectedProjectIndex + 1) + "</small><h3>" + escapeHtml(project.title) + "</h3></div><button class=\"button secondary\" type=\"button\" id=\"openLightboxButton\">Åpne stort bilde</button></div></div><div class=\"gallery-thumbs\">" + project.images.map(function (image, index) { const activeClass = index === selectedImageIndex ? " active" : ""; return "<button class=\"gallery-thumb" + activeClass + "\" type=\"button\" data-image-index=\"" + index + "\"><img src=\"" + escapeAttribute(store.resolveAssetPath(image)) + "\" alt=\"Miniatyr " + (index + 1) + "\"></button>"; }).join("") + "</div><div class=\"project-gallery-grid\">" + project.images.slice(0, 3).map(function (image, index) { return "<button class=\"gallery-grid-button\" type=\"button\" data-grid-index=\"" + index + "\"><img src=\"" + escapeAttribute(store.resolveAssetPath(image)) + "\" alt=\"Detaljbilde " + (index + 1) + "\"></button>"; }).join("") + "</div>";
    Array.from(dom.projectStage.querySelectorAll(".gallery-nav")).forEach(function (button) {
      button.addEventListener("click", function () { shiftImage(Number(button.getAttribute("data-shift"))); });
    });
    Array.from(dom.projectStage.querySelectorAll(".gallery-thumb")).forEach(function (button) {
      button.addEventListener("click", function () { selectedImageIndex = Number(button.getAttribute("data-image-index")); renderProjectStage(); startAutoSlide(); });
    });
    Array.from(dom.projectStage.querySelectorAll(".gallery-grid-button")).forEach(function (button) {
      button.addEventListener("click", function () { selectedImageIndex = Number(button.getAttribute("data-grid-index")); openLightbox(project.images[selectedImageIndex]); renderProjectStage(); startAutoSlide(); });
    });
    const openLightboxButton = document.getElementById("openLightboxButton");
    if (openLightboxButton) { openLightboxButton.addEventListener("click", function () { openLightbox(currentImage); }); }
  }
  function shiftImage(step) {
    const project = siteData.projects[selectedProjectIndex];
    selectedImageIndex = (selectedImageIndex + step + project.images.length) % project.images.length;
    renderProjectStage();
    startAutoSlide();
  }
  function wireEvents() {
    dom.contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const subject = dom.contactSubject.value.trim() || "Forespørsel fra nettsiden";
      const lines = ["Navn: " + dom.contactName.value.trim(), "Telefon: " + dom.contactPhone.value.trim(), "E-post: " + dom.contactEmail.value.trim(), "Type oppdrag: " + subject, "", dom.contactMessage.value.trim()];
      const mailto = "mailto:" + encodeURIComponent(siteData.contact.email) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = mailto;
    });
    dom.lightboxClose.addEventListener("click", closeLightbox);
    dom.lightbox.addEventListener("click", function (event) { if (event.target === dom.lightbox) { closeLightbox(); } });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") { closeLightbox(); } });
    window.addEventListener("storage", function () { renderSite(); });
  }
  function startAutoSlide() {
    window.clearInterval(autoSlideHandle);
    const project = siteData.projects[selectedProjectIndex];
    if (!project || project.images.length < 2) { return; }
    autoSlideHandle = window.setInterval(function () { shiftImage(1); }, 4500);
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
  function escapeHtml(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
  function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
}());