(function () {
  const store = window.AngelsenStore;
  let siteData = store.deepClone(store.defaultData);
  let savedData = store.deepClone(siteData);
  let version = null;
  let isUnlocked = false;
  let hasUnsavedChanges = false;
  const api = '/.netlify/functions/';
  const authHash = new URLSearchParams(location.hash.slice(1));
  let setupToken = authHash.get('invite_token') || authHash.get('recovery_token');
  let setupAction = authHash.has('invite_token') ? 'invite' : 'recovery';
  if (setupToken) history.replaceState(null, '', location.pathname + location.search);

  const dom = {
    loginPanel: document.getElementById("loginPanel"),
    appPanel: document.getElementById("appPanel"),
    username: document.getElementById("usernameInput"),
    password: document.getElementById("passwordInput"),
    loginButton: document.getElementById("loginButton"),
    loginMessage: document.getElementById("loginMessage"),
    invitePanel: document.getElementById('invitePanel'),
    newPassword: document.getElementById('newPasswordInput'),
    acceptInviteButton: document.getElementById('acceptInviteButton'),
    businessName: document.getElementById("businessNameInput"),
    brandSubline: document.getElementById("brandSublineInput"),
    heroTitle: document.getElementById("heroTitleInput"),
    heroLead: document.getElementById("heroLeadInput"),
    phone: document.getElementById("phoneInput"),
    email: document.getElementById("emailInput"),
    area: document.getElementById("areaInput"),
    projectsEditor: document.getElementById("projectsEditor"),
    addProjectButton: document.getElementById("addProjectButton"),
    saveButton: document.getElementById("saveButton"),
    resetButton: document.getElementById("resetButton"),
    logoutButton: document.getElementById("logoutButton"),
    confirmDialog: document.getElementById('confirmDialog'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmDescription: document.getElementById('confirmDescription'),
    confirmAction: document.getElementById('confirmAction'),
    statusText: document.getElementById("statusText")
  };

  wireEvents();
  checkSession();
  dom.invitePanel.hidden = !setupToken;

  function wireEvents() {
    dom.appPanel.addEventListener('input', function () { hasUnsavedChanges = true; });
    window.addEventListener('beforeunload', function (event) {
      if (hasUnsavedChanges) { event.preventDefault(); event.returnValue = ''; }
    });
    dom.loginButton.addEventListener("click", tryLogin);
    dom.acceptInviteButton.addEventListener('click', async function () {
      if (dom.newPassword.value.length < 12) { dom.loginMessage.textContent = 'Passordet må ha minst 12 tegn.'; return; }
      dom.acceptInviteButton.disabled = true;
      try {
        const response = await fetch(api + 'auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: setupAction, token: setupToken, password: dom.newPassword.value }) });
        if (!response.ok) throw new Error('Lenken er ugyldig eller utløpt.');
        setupToken = null; dom.newPassword.value = ''; dom.invitePanel.hidden = true;
        await checkSession();
        if (!isUnlocked) dom.loginMessage.textContent = 'Passordet er lagret, men kontoen mangler administratorrolle.';
      } catch (error) { dom.loginMessage.textContent = error.message; }
      finally { dom.acceptInviteButton.disabled = false; }
    });
    dom.password.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        tryLogin();
      }
    });

    dom.addProjectButton.addEventListener("click", function () {
      hasUnsavedChanges = true;
      siteData.projects.push({
        title: "Nytt prosjekt " + (siteData.projects.length + 1),
        category: "Prosjekt",
        showOnHomepage: true,
        images: []
      });
      renderProjectEditors();
    });

    dom.saveButton.addEventListener("click", saveChanges);
    dom.resetButton.addEventListener("click", async function () {
      if (hasUnsavedChanges && !await confirmAction('Forkast endringer?', 'Alle endringer siden forrige lagring blir fjernet.', 'Forkast endringer')) return;
      siteData = store.deepClone(savedData);
      hasUnsavedChanges = false;
      seedForm();
      setStatus("Ulagrede endringer er forkastet.");
    });
    dom.logoutButton.addEventListener("click", async function () {
      if (hasUnsavedChanges && !await confirmAction('Logg ut?', 'Du har ulagrede endringer som vil gå tapt.', 'Logg ut')) return;
      try { await fetch(api + 'auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) }); } catch (_) { /* Avslutt visningen også ved nettverksfeil. */ }
      isUnlocked = false;
      hasUnsavedChanges = false;
      renderAccessState();
    });
  }

  function renderAccessState() {
    dom.loginPanel.hidden = isUnlocked;
    dom.appPanel.hidden = !isUnlocked;
    if (isUnlocked) {
      seedForm();
    }
  }

  async function checkSession() {
    try {
      const response = await fetch(api + 'auth', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const result = await response.json();
      isUnlocked = result.authenticated;
      if (isUnlocked) await loadPublished();
      renderAccessState();
    } catch (_) {
      dom.loginMessage.textContent = 'Administrasjonen er ikke tilgjengelig akkurat nå.';
      renderAccessState();
    }
  }

  async function loadPublished() {
    const response = await fetch(api + 'site-data', { cache: 'no-store' });
    if (!response.ok) throw new Error('Kunne ikke hente innholdet.');
    const result = await response.json();
    version = result.version;
    siteData = result.data ? store.normalizeData(result.data) : store.deepClone(store.defaultData);
    savedData = store.deepClone(siteData);
    hasUnsavedChanges = false;
  }

  async function tryLogin() {
    dom.loginButton.disabled = true;
    dom.loginMessage.textContent = '';
    try {
      const response = await fetch(api + 'auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', email: dom.username.value.trim(), password: dom.password.value }) });
      if (!response.ok) throw new Error('Innloggingen mislyktes. Kontroller e-post og passord.');
      dom.password.value = '';
      const sessionResponse = await fetch(api + 'auth', { cache: 'no-store' });
      const session = await sessionResponse.json();
      if (!session.authenticated) throw new Error('Kontoen mangler tilgang som administrator.');
      await loadPublished();
      isUnlocked = true;
      renderAccessState();
    } catch (error) {
      dom.loginMessage.textContent = error.message || 'Kunne ikke logge inn.';
    } finally { dom.loginButton.disabled = false; }
  }

  function seedForm() {
    dom.businessName.value = siteData.businessName;
    dom.brandSubline.value = siteData.brandSubline;
    dom.heroTitle.value = siteData.heroTitle;
    dom.heroLead.value = siteData.heroLead;
    dom.phone.value = siteData.contact.phone;
    dom.email.value = siteData.contact.email;
    dom.area.value = siteData.contact.area;
    renderProjectEditors();
  }

  function renderProjectEditors() {
    dom.projectsEditor.innerHTML = siteData.projects.map(function (project, index) {
      return "<article class=\"project-editor\" data-editor-index=\"" + index + "\">"
        + "<div class=\"project-editor-head\"><div class=\"project-editor-heading\"><span class=\"project-number\">Prosjekt " + (index + 1) + "</span><strong>" + escapeHtml(project.title) + "</strong><span class=\"project-visibility\">" + (project.showOnHomepage !== false ? 'Vises på forsiden' : 'Vises kun under alle prosjekter') + "</span></div><div class=\"project-actions\"><button class=\"button secondary\" type=\"button\" data-action=\"up\" data-index=\"" + index + "\" " + (index === 0 ? 'disabled' : '') + ">Opp</button><button class=\"button secondary\" type=\"button\" data-action=\"down\" data-index=\"" + index + "\" " + (index === siteData.projects.length - 1 ? 'disabled' : '') + ">Ned</button><button class=\"button secondary\" type=\"button\" data-action=\"remove\" data-index=\"" + index + "\">Slett</button></div></div>"
        + "<div class=\"admin-fields\">"
        + fieldHtml("Prosjekttittel", "title", project.title)
        + toggleFieldHtml("Vis på hovedsiden", "showOnHomepage", project.showOnHomepage !== false)
        + "<div class=\"field-full image-list\">" + project.images.map(function (image, imageIndex) {
          return "<div class=\"image-item\"><img src=\"" + escapeAttribute(store.resolveAssetPath(image)) + "\" alt=\"Bilde " + (imageIndex + 1) + "\"><button class=\"button secondary\" type=\"button\" data-remove-image=\"" + imageIndex + "\" data-project=\"" + index + "\">Fjern bilde</button></div>";
        }).join("") + "</div>"
        + "<div class=\"field-full\"><label>Last opp bilder fra enhet<input type=\"file\" accept=\"image/jpeg,image/png,image/webp\" multiple data-file-input=\"" + index + "\"></label><p class=\"admin-note\">JPEG, PNG eller WebP. Store bilder tilpasses automatisk før opplasting. Husk å lagre endringene.</p></div>"
        + "</div></article>";
    }).join("");

    Array.from(dom.projectsEditor.querySelectorAll("[data-action]")).forEach(function (button) {
      button.addEventListener("click", function () {
        handleProjectAction(button.getAttribute("data-action"), Number(button.getAttribute("data-index")));
      });
    });

    Array.from(dom.projectsEditor.querySelectorAll('[data-remove-image]')).forEach(function (button) {
      button.addEventListener('click', function () {
        const projectIndex = Number(button.getAttribute('data-project'));
        const imageIndex = Number(button.getAttribute('data-remove-image'));
        siteData.projects[projectIndex].images.splice(imageIndex, 1);
        hasUnsavedChanges = true;
        renderProjectEditors();
      });
    });

    Array.from(dom.projectsEditor.querySelectorAll("input[data-field], textarea[data-field]")).forEach(function (field) {
      field.addEventListener("input", function () {
        const form = field.closest(".project-editor");
        syncProjectFromEditor(Number(form.getAttribute("data-editor-index")), form);
        const project = siteData.projects[Number(form.getAttribute('data-editor-index'))];
        form.querySelector('.project-editor-heading strong').textContent = project.title;
        form.querySelector('.project-visibility').textContent = project.showOnHomepage ? 'Vises på forsiden' : 'Vises kun under alle prosjekter';
      });
    });

    Array.from(dom.projectsEditor.querySelectorAll("input[data-file-input]")).forEach(function (input) {
      input.addEventListener("change", function () {
        handleFiles(Number(input.getAttribute("data-file-input")), input.files);
      });
    });
  }

  async function handleProjectAction(action, index) {
    if (action === "remove") {
      if (siteData.projects.length === 1) {
        setStatus("Det må være minst ett prosjekt.", true);
        return;
      }
      if (!await confirmAction('Slett prosjekt?', '«' + siteData.projects[index].title + '» fjernes når du lagrer endringene.', 'Slett prosjekt')) return;
      siteData.projects.splice(index, 1);
      hasUnsavedChanges = true;
    }

    if (action === "up" && index > 0) {
      swapProjects(index, index - 1);
      hasUnsavedChanges = true;
    }

    if (action === "down" && index < siteData.projects.length - 1) {
      swapProjects(index, index + 1);
      hasUnsavedChanges = true;
    }

    renderProjectEditors();
  }

  function confirmAction(title, description, action) {
    dom.confirmTitle.textContent = title;
    dom.confirmDescription.textContent = description;
    dom.confirmAction.textContent = action;
    dom.confirmDialog.returnValue = 'cancel';
    return new Promise(function (resolve) {
      dom.confirmDialog.addEventListener('close', function () { resolve(dom.confirmDialog.returnValue === 'confirm'); }, { once: true });
      dom.confirmDialog.showModal();
    });
  }

  function swapProjects(a, b) {
    const temp = siteData.projects[a];
    siteData.projects[a] = siteData.projects[b];
    siteData.projects[b] = temp;
  }

  function syncProjectFromEditor(index, form) {
    siteData.projects[index] = {
      title: readField(form, "title") || "Prosjekt " + (index + 1),
      category: siteData.projects[index] && siteData.projects[index].category ? siteData.projects[index].category : "Prosjekt",
      showOnHomepage: readToggle(form, "showOnHomepage"),
      images: siteData.projects[index].images
    };

  }

  async function handleFiles(index, files) {
    if (!files || !files.length) {
      return;
    }

    dom.saveButton.disabled = true;
    dom.addProjectButton.disabled = true;
    dom.projectsEditor.querySelectorAll('button, input, textarea').forEach(function (element) { element.disabled = true; });
    setStatus('Laster opp bilder …');
    try {
      let count = 0;
      for (const file of Array.from(files)) {
        const upload = await prepareImage(file);
        const response = await fetch(api + 'media', { method: 'POST', headers: { 'Content-Type': upload.type }, body: upload });
        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();
        siteData.projects[index].images.push(result.url);
        hasUnsavedChanges = true;
        count++;
      }
      setStatus(count + ' bilde(r) lastet opp. Husk å lagre.');
    } catch (error) {
      setStatus('Opplasting stoppet: ' + error.message + ' Bilder som allerede er lastet opp beholdes. Husk å lagre.', true);
    } finally {
      dom.saveButton.disabled = false;
      dom.addProjectButton.disabled = false;
      renderProjectEditors();
    }
  }

  async function prepareImage(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Velg et bilde i JPEG, PNG eller WebP.');
    if (file.size <= 4000000) return file;
    setStatus('Tilpasser et stort bilde før opplasting …');
    const bitmap = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Bildet kunne ikke tilpasses på denne enheten.');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.86, 0.72, 0.58]) {
        const result = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/jpeg', quality); });
        if (result && result.size <= 4000000) return result;
      }
      throw new Error('Bildet er fortsatt for stort. Prøv et mindre bilde.');
    } finally { bitmap.close(); }
  }

  async function saveChanges() {
    siteData.businessName = dom.businessName.value.trim() || store.defaultData.businessName;
    siteData.brandSubline = dom.brandSubline.value.trim() || store.defaultData.brandSubline;
    siteData.heroTitle = dom.heroTitle.value.trim() || store.defaultData.heroTitle;
    siteData.heroLead = dom.heroLead.value.trim() || store.defaultData.heroLead;
    siteData.contact.phone = dom.phone.value.trim() || store.defaultData.contact.phone;
    siteData.contact.email = dom.email.value.trim() || store.defaultData.contact.email;
    siteData.contact.area = dom.area.value.trim() || store.defaultData.contact.area;
    const missingImage = siteData.projects.find(function (project) { return !project.images.length; });
    if (missingImage) { setStatus('Legg til minst ett bilde i «' + missingImage.title + '» før du lagrer.', true); return; }
    dom.saveButton.disabled = true;
    dom.appPanel.inert = true;
    setStatus('Lagrer …');
    try {
      const response = await fetch(api + 'site-data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: siteData, version: version }) });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      version = result.version;
      savedData = store.deepClone(siteData);
      hasUnsavedChanges = false;
      seedForm();
      setStatus('Endringene er lagret og publisert.');
    } catch (error) { setStatus('Kunne ikke lagre: ' + error.message, true); }
    finally { dom.appPanel.inert = false; dom.saveButton.disabled = false; }
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
    return "<div class=\"field\"><label>" + label + "<input type=\"text\" data-field=\"" + field + "\" value=\"" + escapeAttribute(value || "") + "\"></label></div>";
  }

  function toggleFieldHtml(label, field, isChecked) {
    return "<div class=\"field-full toggle-field\"><label class=\"toggle-row\"><input type=\"checkbox\" data-field=\"" + field + "\" " + (isChecked ? "checked" : "") + "><span>" + label + "</span></label></div>";
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

  function readToggle(form, field) {
    const element = form.querySelector("[data-field='" + field + "']");
    return element ? element.checked : false;
  }
}());
