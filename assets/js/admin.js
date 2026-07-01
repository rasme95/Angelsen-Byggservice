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
    services: document.getElementById("servicesInput"),
    contactTitle: document.getElementById("contactTitleInput"),
    phone: document.getElementById("phoneInput"),
    email: document.getElementById("emailInput"),
    area: document.getElementById("areaInput"),
    projectsEditor: document.getElementById("projectsEditor"),
    addProjectButton: document.getElementById("addProjectButton"),
    saveButton: document.getElementById("saveButton"),
    exportButton: document.getElementById("exportButton"),
    importButton: document.getElementById("importButton"),
    resetButton: document.getElementById("resetButton"),
    logoutButton: document.getElementById("logoutButton"),
    jsonArea: document.getElementById("jsonArea"),
    statusText: document.getElementById("statusText")
  };

  wireEvents();
  renderAccessState();

  function wireEvents() {
    dom.loginButton.addEventListener("click", tryLogin);
    dom.password.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        tryLogin();
      }
    });

    dom.addProjectButton.addEventListener("click", function () {
      siteData.projects.push({
        title: "Ny grid " + (siteData.projects.length + 1),
        category: "Prosjekt",
        images: [siteData.heroImage]
      });
      renderProjectEditors();
    });

    dom.saveButton.addEventListener("click", saveChanges);
    dom.exportButton.addEventListener("click", function () {
      dom.jsonArea.value = JSON.stringify(siteData, null, 2);
      setStatus("Innhold eksportert som JSON.");
    });
    dom.importButton.addEventListener("click", importJson);
    dom.resetButton.addEventListener("click", function () {
      siteData = store.resetSiteData();
      seedForm();
      setStatus("Innhold tilbakestilt til standard.");
    });
    dom.logoutButton.addEventListener("click", function () {
      isUnlocked = false;
      sessionStorage.removeItem(store.adminSessionKey);
      renderAccessState();
    });
  }

  function renderAccessState() {
    dom.loginPanel.hidden = isUnlocked;
    dom.appPanel.hidden = !isUnlocked;
    if (isUnlocked) {
      siteData = store.loadSiteData();
      seedForm();
    }
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
    dom.services.value = siteData.services.join("\n");
    dom.contactTitle.value = siteData.contactTitle;
    dom.phone.value = siteData.contact.phone;
    dom.email.value = siteData.contact.email;
    dom.area.value = siteData.contact.area;
    dom.jsonArea.value = "";
    renderProjectEditors();
  }

  function renderProjectEditors() {
    dom.projectsEditor.innerHTML = siteData.projects.map(function (project, index) {
      return "<article class=\"project-editor\" data-editor-index=\"" + index + "\">"
        + "<div class=\"project-editor-head\"><div><strong>" + escapeHtml(project.title) + "</strong><p class=\"admin-note\">Grid " + (index + 1) + "</p></div><div class=\"project-actions\"><button class=\"button secondary\" type=\"button\" data-action=\"up\" data-index=\"" + index + "\">Opp</button><button class=\"button secondary\" type=\"button\" data-action=\"down\" data-index=\"" + index + "\">Ned</button><button class=\"button secondary\" type=\"button\" data-action=\"remove\" data-index=\"" + index + "\">Slett</button></div></div>"
        + "<div class=\"admin-fields\">"
        + fieldHtml("Grid-tittel", "title", project.title)
        + fieldHtml("Kort etikett", "category", project.category)
        + fullFieldHtml("Bilde-URL-er eller lokale stier, én per linje", "images", project.images.join("\n"))
        + "<div class=\"field-full\"><label>Last opp bilder fra enhet</label><input type=\"file\" accept=\"image/*\" multiple data-file-input=\"" + index + "\"><p class=\"admin-note\">Du kan også lime inn eksterne bildelenker direkte i feltet over.</p></div>"
        + "</div></article>";
    }).join("");

    Array.from(dom.projectsEditor.querySelectorAll("[data-action]")).forEach(function (button) {
      button.addEventListener("click", function () {
        handleProjectAction(button.getAttribute("data-action"), Number(button.getAttribute("data-index")));
      });
    });

    Array.from(dom.projectsEditor.querySelectorAll("input[data-field], textarea[data-field]")).forEach(function (field) {
      field.addEventListener("input", function () {
        const form = field.closest(".project-editor");
        syncProjectFromEditor(Number(form.getAttribute("data-editor-index")), form);
      });
    });

    Array.from(dom.projectsEditor.querySelectorAll("input[data-file-input]")).forEach(function (input) {
      input.addEventListener("change", function () {
        handleFiles(Number(input.getAttribute("data-file-input")), input.files);
      });
    });
  }

  function handleProjectAction(action, index) {
    if (action === "remove") {
      if (siteData.projects.length === 1) {
        setStatus("Det må være minst én grid.", true);
        return;
      }
      siteData.projects.splice(index, 1);
    }

    if (action === "up" && index > 0) {
      swapProjects(index, index - 1);
    }

    if (action === "down" && index < siteData.projects.length - 1) {
      swapProjects(index, index + 1);
    }

    renderProjectEditors();
  }

  function swapProjects(a, b) {
    const temp = siteData.projects[a];
    siteData.projects[a] = siteData.projects[b];
    siteData.projects[b] = temp;
  }

  function syncProjectFromEditor(index, form) {
    siteData.projects[index] = {
      title: readField(form, "title") || "Grid " + (index + 1),
      category: readField(form, "category") || "Prosjekt",
      images: readField(form, "images").split("\n").map(function (item) {
        return item.trim();
      }).filter(Boolean)
    };

    if (!siteData.projects[index].images.length) {
      siteData.projects[index].images = [siteData.heroImage || store.defaultData.heroImage];
    }
  }

  function handleFiles(index, files) {
    if (!files || !files.length) {
      return;
    }

    const readers = Array.from(files).map(function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () { resolve(String(reader.result)); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(function (results) {
      siteData.projects[index].images = siteData.projects[index].images.concat(results);
      renderProjectEditors();
      setStatus(results.length + " bilde(r) lagt til. Husk å lagre.");
    }).catch(function () {
      setStatus("Kunne ikke lese en eller flere filer.", true);
    });
  }

  function saveChanges() {
    siteData.businessName = dom.businessName.value.trim() || store.defaultData.businessName;
    siteData.brandSubline = dom.brandSubline.value.trim() || store.defaultData.brandSubline;
    siteData.heroTitle = dom.heroTitle.value.trim() || store.defaultData.heroTitle;
    siteData.heroLead = dom.heroLead.value.trim() || store.defaultData.heroLead;
    siteData.heroImage = dom.heroImage.value.trim() || store.defaultData.heroImage;
    siteData.heroBadgeTitle = dom.heroBadgeTitle.value.trim() || store.defaultData.heroBadgeTitle;
    siteData.services = dom.services.value.split("\n").map(function (item) { return item.trim(); }).filter(Boolean);
    siteData.contactTitle = dom.contactTitle.value.trim() || store.defaultData.contactTitle;
    siteData.contact.phone = dom.phone.value.trim() || store.defaultData.contact.phone;
    siteData.contact.email = dom.email.value.trim() || store.defaultData.contact.email;
    siteData.contact.area = dom.area.value.trim() || store.defaultData.contact.area;
    siteData = store.saveSiteData(siteData);
    seedForm();
    setStatus("Endringer lagret.");
  }

  function importJson() {
    try {
      siteData = store.saveSiteData(JSON.parse(dom.jsonArea.value));
      seedForm();
      setStatus("JSON importert og lagret.");
    } catch (error) {
      setStatus("Kunne ikke importere JSON.", true);
    }
  }

  function setStatus(message, isError) {
    dom.statusText.textContent = message;
    dom.statusText.className = isError ? "status-text error" : "status-text";
  }

  function readField(form, field) {
    const element = form.querySelector("[data-field='" + field + "']");
    return element ? element.value.trim() : "";
  }

  function fieldHtml(label, field, value) {
    return "<div class=\"field\"><label>" + label + "</label><input type=\"text\" data-field=\"" + field + "\" value=\"" + escapeAttribute(value || "") + "\"></div>";
  }

  function fullFieldHtml(label, field, value) {
    return "<div class=\"field-full\"><label>" + label + "</label><textarea data-field=\"" + field + "\">" + escapeHtml(value || "") + "</textarea></div>";
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