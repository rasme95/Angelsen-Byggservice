(function () {
  const store = window.AngelsenStore;
  let siteData = store.loadSiteData();
  let isUnlocked = sessionStorage.getItem(store.adminSessionKey) === "true";
  const dom = {
    loginPanel: document.getElementById("loginPanel"),
    appPanel: document.getElementById("appPanel"),
    username: document.getElementById("usernameInput"),
    password: document.getElementById("passwordInput"),
    loginButton: document.getElementById("loginButton"),
    loginMessage: document.getElementById("loginMessage"),
    businessName: document.getElementById("businessNameInput"),
    brandSubline: document.getElementById("brandSublineInput"),
    heroTitle: document.getElementById("heroTitleInput"),
    heroLead: document.getElementById("heroLeadInput"),
    heroImage: document.getElementById("heroImageInput"),
    heroBadgeTitle: document.getElementById("heroBadgeTitleInput"),
    heroBadgeText: document.getElementById("heroBadgeTextInput"),
    servicesIntro: document.getElementById("servicesIntroInput"),
    services: document.getElementById("servicesInput"),
    highlights: document.getElementById("highlightsInput"),
    heroCards: document.getElementById("heroCardsInput"),
    aboutTitle: document.getElementById("aboutTitleInput"),
    aboutText: document.getElementById("aboutTextInput"),
    process: document.getElementById("processInput"),
    contactTitle: document.getElementById("contactTitleInput"),
    contactBody: document.getElementById("contactBodyInput"),
    phone: document.getElementById("phoneInput"),
    email: document.getElementById("emailInput"),
    area: document.getElementById("areaInput"),
    hours: document.getElementById("hoursInput"),
    facebook: document.getElementById("facebookInput"),
    projectsEditor: document.getElementById("projectsEditor"),
    addProjectButton: document.getElementById("addProjectButton"),
    saveButton: document.getElementById("saveButton"),
    exportButton: document.getElementById("exportButton"),
    importButton: document.getElementById("importButton"),
    resetButton: document.getElementById("resetButton"),
    logoutButton: document.getElementById("logoutButton"),
    jsonArea: document.getElementById("jsonArea"),
    statusText: document.getElementById("statusText"),
    libraryGrid: document.getElementById("libraryGrid")
  };
  wireEvents();
  renderAccessState();
  renderLibrary();
  function wireEvents() {
    dom.loginButton.addEventListener("click", tryLogin);
    dom.password.addEventListener("keydown", function (event) { if (event.key === "Enter") { tryLogin(); } });
    dom.addProjectButton.addEventListener("click", function () {
      siteData.projects.push({ title: "Prosjekt " + (siteData.projects.length + 1), category: "Nytt prosjekt", summary: "Beskriv prosjektet her.", delivery: "Utført arbeid", images: [siteData.heroImage] });
      renderProjectEditors();
    });
    dom.saveButton.addEventListener("click", saveChanges);
    dom.exportButton.addEventListener("click", function () { dom.jsonArea.value = JSON.stringify(siteData, null, 2); setStatus("Innhold eksportert som JSON."); });
    dom.importButton.addEventListener("click", importJson);
    dom.resetButton.addEventListener("click", function () { siteData = store.resetSiteData(); seedForm(); setStatus("Innhold tilbakestilt til standard."); });
    dom.logoutButton.addEventListener("click", function () { isUnlocked = false; sessionStorage.removeItem(store.adminSessionKey); renderAccessState(); setStatus("Logget ut."); });
  }
  function renderAccessState() {
    dom.loginPanel.hidden = isUnlocked;
    dom.appPanel.hidden = !isUnlocked;
    if (isUnlocked) { siteData = store.loadSiteData(); seedForm(); }
  }
  function tryLogin() {
    if (dom.username.value === store.adminCredentials.username && dom.password.value === store.adminCredentials.password) {
      isUnlocked = true;
      sessionStorage.setItem(store.adminSessionKey, "true");
      dom.loginMessage.textContent = "";
      renderAccessState();
      return;
    }
    dom.loginMessage.textContent = "Feil brukernavn eller passord.";
  }
  function seedForm() {
    dom.businessName.value = siteData.businessName;
    dom.brandSubline.value = siteData.brandSubline;
    dom.heroTitle.value = siteData.heroTitle;
    dom.heroLead.value = siteData.heroLead;
    dom.heroImage.value = siteData.heroImage;
    dom.heroBadgeTitle.value = siteData.heroBadgeTitle;
    dom.heroBadgeText.value = siteData.heroBadgeText;
    dom.servicesIntro.value = siteData.servicesIntro;
    dom.services.value = siteData.services.join("\n");
    dom.highlights.value = siteData.highlights.map(function (item) { return item.value + "|" + item.label; }).join("\n");
    dom.heroCards.value = siteData.heroCards.map(function (item) { return item.title + "|" + item.text; }).join("\n");
    dom.aboutTitle.value = siteData.aboutTitle;
    dom.aboutText.value = siteData.aboutText;
    dom.process.value = siteData.process.map(function (item) { return item.title + "|" + item.text; }).join("\n");
    dom.contactTitle.value = siteData.contactTitle;
    dom.contactBody.value = siteData.contactBody;
    dom.phone.value = siteData.contact.phone;
    dom.email.value = siteData.contact.email;
    dom.area.value = siteData.contact.area;
    dom.hours.value = siteData.contact.hours;
    dom.facebook.value = siteData.social.facebook;
    dom.jsonArea.value = "";
    renderProjectEditors();
  }
  function renderProjectEditors() {
    dom.projectsEditor.innerHTML = siteData.projects.map(function (project, index) {
      return "<article class=\"project-editor\" data-editor-index=\"" + index + "\"><div class=\"project-editor-head\"><div><strong>" + escapeHtml(project.title) + "</strong><p class=\"admin-note\">Prosjekt " + (index + 1) + "</p></div><div class=\"project-actions\"><button class=\"button secondary\" type=\"button\" data-action=\"up\" data-index=\"" + index + "\">Opp</button><button class=\"button secondary\" type=\"button\" data-action=\"down\" data-index=\"" + index + "\">Ned</button><button class=\"button secondary\" type=\"button\" data-action=\"remove\" data-index=\"" + index + "\">Slett</button></div></div><div class=\"admin-fields\">" + fieldHtml("Tittel", "title", project.title) + fieldHtml("Kategori", "category", project.category) + fieldHtml("Leveranse", "delivery", project.delivery) + fullFieldHtml("Beskrivelse", "summary", project.summary, true) + fullFieldHtml("Bildestier, én per linje", "images", project.images.join("\n"), true) + "</div></article>";
    }).join("");
    Array.from(dom.projectsEditor.querySelectorAll("[data-action]")).forEach(function (button) { button.addEventListener("click", function () { handleProjectAction(button.getAttribute("data-action"), Number(button.getAttribute("data-index"))); }); });
    Array.from(dom.projectsEditor.querySelectorAll("input[data-field], textarea[data-field]")).forEach(function (field) {
      field.addEventListener("input", function () {
        const form = field.closest(".project-editor");
        syncProjectFromEditor(Number(form.getAttribute("data-editor-index")), form);
      });
    });
  }
  function handleProjectAction(action, index) {
    if (action === "remove") {
      if (siteData.projects.length === 1) { setStatus("Nettsiden må ha minst ett prosjekt.", true); return; }
      siteData.projects.splice(index, 1);
    }
    if (action === "up" && index > 0) { swapProjects(index, index - 1); }
    if (action === "down" && index < siteData.projects.length - 1) { swapProjects(index, index + 1); }
    renderProjectEditors();
  }
  function swapProjects(a, b) { const temp = siteData.projects[a]; siteData.projects[a] = siteData.projects[b]; siteData.projects[b] = temp; }
  function syncProjectFromEditor(index, form) {
    siteData.projects[index] = {
      title: readField(form, "title") || "Prosjekt " + (index + 1),
      category: readField(form, "category") || "Prosjekt",
      delivery: readField(form, "delivery"),
      summary: readField(form, "summary"),
      images: readField(form, "images").split("\n").map(function (item) { return item.trim(); }).filter(Boolean)
    };
    if (!siteData.projects[index].images.length) { siteData.projects[index].images = [siteData.heroImage || store.defaultData.heroImage]; }
  }
  function saveChanges() {
    siteData.businessName = dom.businessName.value.trim() || store.defaultData.businessName;
    siteData.brandSubline = dom.brandSubline.value.trim() || store.defaultData.brandSubline;
    siteData.heroTitle = dom.heroTitle.value.trim() || store.defaultData.heroTitle;
    siteData.heroLead = dom.heroLead.value.trim() || store.defaultData.heroLead;
    siteData.heroImage = dom.heroImage.value.trim() || store.defaultData.heroImage;
    siteData.heroBadgeTitle = dom.heroBadgeTitle.value.trim() || store.defaultData.heroBadgeTitle;
    siteData.heroBadgeText = dom.heroBadgeText.value.trim() || store.defaultData.heroBadgeText;
    siteData.servicesIntro = dom.servicesIntro.value.trim() || store.defaultData.servicesIntro;
    siteData.services = dom.services.value.split("\n").map(function (item) { return item.trim(); }).filter(Boolean);
    siteData.highlights = parsePairs(dom.highlights.value, ["value", "label"], store.defaultData.highlights);
    siteData.heroCards = parsePairs(dom.heroCards.value, ["title", "text"], store.defaultData.heroCards);
    siteData.aboutTitle = dom.aboutTitle.value.trim() || store.defaultData.aboutTitle;
    siteData.aboutText = dom.aboutText.value.trim() || store.defaultData.aboutText;
    siteData.process = parsePairs(dom.process.value, ["title", "text"], store.defaultData.process);
    siteData.contactTitle = dom.contactTitle.value.trim() || store.defaultData.contactTitle;
    siteData.contactBody = dom.contactBody.value.trim() || store.defaultData.contactBody;
    siteData.contact.phone = dom.phone.value.trim() || store.defaultData.contact.phone;
    siteData.contact.email = dom.email.value.trim() || store.defaultData.contact.email;
    siteData.contact.area = dom.area.value.trim() || store.defaultData.contact.area;
    siteData.contact.hours = dom.hours.value.trim() || store.defaultData.contact.hours;
    siteData.social.facebook = dom.facebook.value.trim() || store.defaultData.social.facebook;
    siteData = store.saveSiteData(siteData);
    seedForm();
    setStatus("Endringer lagret. Offentlig side leser samme data fra localStorage.");
  }
  function importJson() {
    try {
      siteData = store.saveSiteData(JSON.parse(dom.jsonArea.value));
      seedForm();
      setStatus("JSON importert og lagret.");
    } catch (error) {
      setStatus("Kunne ikke importere JSON. Kontroller formatet og prøv igjen.", true);
    }
  }
  function renderLibrary() {
    dom.libraryGrid.innerHTML = store.imageLibrary.map(function (path) { return "<div class=\"library-item\"><code>" + escapeHtml(path) + "</code><button class=\"button secondary\" type=\"button\" data-copy-path=\"" + escapeAttribute(path) + "\">Kopier sti</button></div>"; }).join("");
    Array.from(dom.libraryGrid.querySelectorAll("[data-copy-path]")).forEach(function (button) {
      button.addEventListener("click", function () {
        const path = button.getAttribute("data-copy-path");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(path).then(function () { setStatus("Kopierte bildesti: " + path); }, function () { dom.jsonArea.value = path; setStatus("Kunne ikke kopiere automatisk. Bildestien er lagt i JSON-feltet."); });
          return;
        }
        dom.jsonArea.value = path;
        setStatus("Utklippstavle er ikke tilgjengelig. Bildestien er lagt i JSON-feltet.");
      });
    });
  }
  function setStatus(message, isError) { dom.statusText.textContent = message; dom.statusText.className = isError ? "status-text error" : "status-text"; }
  function parsePairs(value, keys, fallback) {
    const items = value.split("\n").map(function (line) { return line.trim(); }).filter(Boolean).map(function (line) {
      const parts = line.split("|").map(function (part) { return part.trim(); });
      if (parts.length < keys.length || parts.some(function (part) { return !part; })) { return null; }
      return keys.reduce(function (result, key, index) { result[key] = parts[index] || ""; return result; }, {});
    }).filter(Boolean);
    return items.length ? items : store.deepClone(fallback);
  }
  function readField(form, field) { const element = form.querySelector("[data-field='" + field + "']"); return element ? element.value.trim() : ""; }
  function fieldHtml(label, field, value) { return "<div class=\"field\"><label>" + label + "</label><input type=\"text\" data-field=\"" + field + "\" value=\"" + escapeAttribute(value || "") + "\"></div>"; }
  function fullFieldHtml(label, field, value, isTextarea) { return "<div class=\"field-full\"><label>" + label + "</label>" + (isTextarea ? "<textarea data-field=\"" + field + "\">" + escapeHtml(value || "") + "</textarea>" : "<input type=\"text\" data-field=\"" + field + "\" value=\"" + escapeAttribute(value || "") + "\">") + "</div>"; }
  function escapeHtml(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
  function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
}());