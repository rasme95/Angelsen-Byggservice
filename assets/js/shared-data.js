(function () {
  const storageKey = "angelsen-byggservice-site-data";
  const adminSessionKey = "angelsen-byggservice-admin-session";
  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const projectRootUrl = new URL("../../", scriptUrl);

  const defaultData = {
    businessName: "Angelsen Byggservice",
    brandSubline: "Tømrer, vedlikehold og rehabilitering",
    heroTitle: "Alt innen bygg, vedlikehold og flis.",
    heroLead: "Bad, terrasse, vedlikehold og oppgradering i Bergen og omegn.",
    heroImage: "Bilder/Bilder nettsiden Angelsen byggservice/original-E0F701BA-FA1B-4877-9136-B4D162617BD8.jpeg",
    heroBadgeTitle: "Prosjekter med egne bildegallerier",
    services: [
      "Tak",
      "Terrasse",
      "Flis",
      "Kjøkken",
      "Vinduer og dører",
      "Vedlikehold"
    ],
    contactTitle: "Fortell kort om prosjektet ditt",
    contact: {
      phone: "464 20 079",
      email: "post@angelsenbyggservice.no",
      area: "Bergen og omegn"
    },
    social: {
      facebook: "https://www.facebook.com/"
    },
    projects: [
      {
        title: "Prosjekt 1: Bad og flis",
        category: "Bad",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice/original-73837324-77AF-454F-8582-26B6B740075B.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-7EF81E0D-9D58-4C13-8130-8AC89278EE36.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-8CCD16D1-2D17-4235-8DCD-FC1219693CE8.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-11BF36A7-587A-448D-A773-F00B52FB4A4F.jpeg"
        ]
      },
      {
        title: "Prosjekt 2: Terrasse og uteområde",
        category: "Terrasse",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice/original-E0F701BA-FA1B-4877-9136-B4D162617BD8.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-D5F4EE24-98B0-494D-A644-B0E78839B3B9.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-CCA042BB-8C4A-47ED-A5C2-6C165D53EB74.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-6E67531E-185D-47DA-AAA1-48B3ABB59B6A.jpeg"
        ]
      },
      {
        title: "Prosjekt 3: Fasade og lyssetting",
        category: "Fasade",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-03489DA6-16F8-4002-B2BB-4BCF044CE91D.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-B74B2EE5-2C0E-4B37-90C4-C00F8757EC22.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-8AC193BC-FE68-4F9F-9780-9E040B1B2DB0.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-A1C347ED-220C-4440-8236-5B7DD3F2616D.jpeg"
        ]
      }
    ]
  };

  const adminCredentials = { username: "SveinAngelsen", password: "SveinAngelsen123" };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeProject(project, index, fallbackImage) {
    return {
      title: project && project.title ? project.title : "Grid " + (index + 1),
      category: project && project.category ? project.category : "Prosjekt",
      images: Array.isArray(project && project.images) && project.images.length ? project.images : [fallbackImage]
    };
  }

  function normalizeData(data) {
    const merged = {
      ...deepClone(defaultData),
      ...(data || {}),
      contact: { ...defaultData.contact, ...((data && data.contact) || {}) },
      social: { ...defaultData.social, ...((data && data.social) || {}) },
      services: Array.isArray(data && data.services) && data.services.length ? data.services : deepClone(defaultData.services)
    };

    const rawProjects = Array.isArray(data && data.projects) && data.projects.length
      ? data.projects
      : deepClone(defaultData.projects);

    merged.projects = rawProjects.map(function (project, index) {
      return normalizeProject(project, index, merged.heroImage);
    });

    return merged;
  }

  function loadSiteData() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? normalizeData(JSON.parse(raw)) : deepClone(defaultData);
    } catch (error) {
      return deepClone(defaultData);
    }
  }

  function saveSiteData(data) {
    const normalized = normalizeData(data);
    localStorage.setItem(storageKey, JSON.stringify(normalized));
    return normalized;
  }

  function resetSiteData() {
    localStorage.setItem(storageKey, JSON.stringify(defaultData));
    return deepClone(defaultData);
  }

  function resolveAssetPath(path) {
    const value = String(path || "");
    if (/^(https?:|data:|blob:)/i.test(value)) {
      return value;
    }
    return new URL(value, projectRootUrl).href;
  }

  function sanitizePhone(phone) {
    return String(phone || "").replace(/[^+\d]/g, "");
  }

  window.AngelsenStore = {
    storageKey: storageKey,
    adminSessionKey: adminSessionKey,
    adminCredentials: adminCredentials,
    defaultData: deepClone(defaultData),
    loadSiteData: loadSiteData,
    saveSiteData: saveSiteData,
    resetSiteData: resetSiteData,
    normalizeData: normalizeData,
    resolveAssetPath: resolveAssetPath,
    sanitizePhone: sanitizePhone,
    deepClone: deepClone
  };
}());