(function () {
  const storageKey = "angelsen-byggservice-site-data";
  const adminSessionKey = "angelsen-byggservice-admin-session";
  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const projectRootUrl = new URL("../../", scriptUrl);
  const curatedImagePaths = new Set([
    "Bilder/Bad/Bad 1/original-468649AD-3E89-4162-A47A-DD886DBF195A.jpeg",
    "Bilder/Bad/Bad 1/original-70F9AEFF-F9FE-4912-9DC5-8DC5035B1539.jpeg",
    "Bilder/Bad/Bad 1/original-E1D8CE6F-1F91-4903-B596-38BC020DF96C.jpeg",
    "Bilder/Fasade/Fasade 1/original-03489DA6-16F8-4002-B2BB-4BCF044CE91D.jpeg",
    "Bilder/Fasade/Fasade 1/original-6CADC8C4-ACEC-4CE6-9BEC-38AF37F4E2EC.jpeg",
    "Bilder/Fasade/Fasade 1/original-85C302F1-C09B-40A0-B0C4-EBE6D5DD93E0.jpeg",
    "Bilder/Fasade/Fasade 1/original-8D265042-FBC3-4F65-888C-800F6ABF1F74.jpeg",
    "Bilder/Spilevegg/original-520FDB21-D18E-46C5-B4B4-A97897A43000.jpeg",
    "Bilder/Spilevegg/original-9022F6C2-3964-43F6-A607-EE8281280C9F.jpeg",
    "Bilder/Spilevegg/original-DD6E830E-30D0-47DD-8E35-8BAB1BA604AC.jpeg",
    "Bilder/Fasade/Fasade 2/original-2DD983D9-14D3-4854-8521-D357E101BF74.jpeg",
    "Bilder/Fasade/Fasade 2/original-4679C108-517F-4A3E-832C-2CA5A9E02333.jpeg",
    "Bilder/Fasade/Fasade 2/original-72C71FFA-8A0E-4507-A638-7A24E8FDAB10.jpeg",
    "Bilder/Fasade/Fasade 2/original-BCA60F10-E827-458C-AA74-46339DDE81B3.jpeg",
    "Bilder/Fasade/Fasade 3/original-0DFFAB7A-0B7A-42F9-AFF4-BB66DD8A4510.jpeg",
    "Bilder/Fasade/Fasade 3/original-12CCEDCD-2F1C-4A4F-B3CC-F74800ABBAC3.jpeg",
    "Bilder/Fasade/Fasade 3/original-242FE9F2-C82F-49CE-87D9-9960285018A5.jpeg",
    "Bilder/Fasade/Fasade 3/original-5D30E49A-2275-42AE-8048-03DE23A5DF8D.jpeg",
    "Bilder/Fasade/Fasade 3/original-6E67531E-185D-47DA-AAA1-48B3ABB59B6A.jpeg",
    "Bilder/Fasade/Fasade 3/original-78F4DA8E-5920-4A34-9712-5F40B4F80112.jpeg",
    "Bilder/Fasade/Fasade 3/original-F32D7A89-1569-4BEC-9616-87EF2E20535D.jpeg",
    "Bilder/Logo/logo.jpg"
  ]);

  const defaultData = {
    businessName: "Angelsen Byggservice",
    brandSubline: "Tømrer, vedlikehold og rehabilitering",
    heroTitle: "Alt innen bygg, vedlikehold og flis.",
    heroLead: "Bad, terrasse, vedlikehold og oppgradering i Bergen og omegn.",
    heroImage: "Bilder/Spilevegg/original-520FDB21-D18E-46C5-B4B4-A97897A43000.jpeg",
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
      email: "angel.bygg@outlook.com",
      area: "Bergen og omegn"
    },
    social: {
      facebook: "https://www.facebook.com/"
    },
    projects: [
      {
        title: "Nytt bad",
        category: "Bad",
        showOnHomepage: true,
        images: [
          "Bilder/Bad/Bad 1/original-468649AD-3E89-4162-A47A-DD886DBF195A.jpeg",
          "Bilder/Bad/Bad 1/original-70F9AEFF-F9FE-4912-9DC5-8DC5035B1539.jpeg",
          "Bilder/Bad/Bad 1/original-E1D8CE6F-1F91-4903-B596-38BC020DF96C.jpeg"
        ]
      },
      {
        title: "Baderomsoppgradering",
        category: "Bad",
        showOnHomepage: true,
        images: [
          "Bilder/Bad/Bad 2/original-1940BB8C-2B48-4830-9702-3B4451C8DF0E.jpeg",
          "Bilder/Bad/Bad 2/original-6E303E5B-1C0C-475E-9BA9-47A0073501BA.jpeg",
          "Bilder/Bad/Bad 2/original-728A8639-9C7E-48A7-97E6-C1B67DFE4016.jpeg",
          "Bilder/Bad/Bad 2/original-CB3C1C2E-73A7-47B7-82A0-ECEE05CFCF3D.jpeg"
        ]
      },
      {
        title: "Totalrenovering",
        category: "Fasade",
        showOnHomepage: true,
        images: [
          "Bilder/Fasade/Fasade 1/original-03489DA6-16F8-4002-B2BB-4BCF044CE91D.jpeg",
          "Bilder/Fasade/Fasade 1/original-6CADC8C4-ACEC-4CE6-9BEC-38AF37F4E2EC.jpeg",
          "Bilder/Fasade/Fasade 1/original-85C302F1-C09B-40A0-B0C4-EBE6D5DD93E0.jpeg",
          "Bilder/Fasade/Fasade 1/original-8D265042-FBC3-4F65-888C-800F6ABF1F74.jpeg"
        ]
      },
      {
        title: "Spilevegger",
        category: "Spilevegg",
        showOnHomepage: true,
        images: [
          "Bilder/Spilevegg/original-520FDB21-D18E-46C5-B4B4-A97897A43000.jpeg",
          "Bilder/Spilevegg/original-9022F6C2-3964-43F6-A607-EE8281280C9F.jpeg",
          "Bilder/Spilevegg/original-DD6E830E-30D0-47DD-8E35-8BAB1BA604AC.jpeg"
        ]
      },
      {
        title: "Oppgradering: Kledning",
        category: "Fasade",
        showOnHomepage: true,
        images: [
          "Bilder/Fasade/Fasade 2/original-2DD983D9-14D3-4854-8521-D357E101BF74.jpeg",
          "Bilder/Fasade/Fasade 2/original-4679C108-517F-4A3E-832C-2CA5A9E02333.jpeg",
          "Bilder/Fasade/Fasade 2/original-72C71FFA-8A0E-4507-A638-7A24E8FDAB10.jpeg",
          "Bilder/Fasade/Fasade 2/original-BCA60F10-E827-458C-AA74-46339DDE81B3.jpeg"
        ]
      },
      {
        title: "Oppgradering: Uteområde",
        category: "Uteområde",
        showOnHomepage: true,
        images: [
          "Bilder/Fasade/Fasade 3/original-0DFFAB7A-0B7A-42F9-AFF4-BB66DD8A4510.jpeg",
          "Bilder/Fasade/Fasade 3/original-12CCEDCD-2F1C-4A4F-B3CC-F74800ABBAC3.jpeg",
          "Bilder/Fasade/Fasade 3/original-242FE9F2-C82F-49CE-87D9-9960285018A5.jpeg",
          "Bilder/Fasade/Fasade 3/original-5D30E49A-2275-42AE-8048-03DE23A5DF8D.jpeg",
          "Bilder/Fasade/Fasade 3/original-6E67531E-185D-47DA-AAA1-48B3ABB59B6A.jpeg"
        ]
      },
      {
        title: "Kjøkkenfornyelse",
        category: "Kjøkken",
        showOnHomepage: false,
        images: [
          "Bilder/Kjøkken/original-966692BA-FF1C-4556-A783-777D1BD8296D.jpeg",
          "Bilder/Kjøkken/original-E5C8199E-2522-4AA4-AE9F-D32B54FEA5B1.jpeg"
        ]
      },
      {
        title: "Småjobber og vedlikehold",
        category: "Vedlikehold",
        showOnHomepage: false,
        images: [
          "Bilder/Diverse småjobber/original-0673BE02-1A41-44AB-9AFC-8C42DFBE2082.jpeg",
          "Bilder/Diverse småjobber/original-0D34D600-36FF-4265-91FC-C488421A155E.jpeg",
          "Bilder/Diverse småjobber/original-35A258E7-8BD1-4A30-80F0-E0FBED400B0D.jpeg",
          "Bilder/Diverse småjobber/original-B5471D1F-9709-4D0D-83C4-4BDC9026DBFE.jpeg",
          "Bilder/Diverse småjobber/original-CCA042BB-8C4A-47ED-A5C2-6C165D53EB74.jpeg"
        ]
      }
    ]
  };

  const adminCredentials = { username: "SveinAngelsen", password: "SveinAngelsen123" };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isApprovedImage(path) {
    const value = String(path || "");
    if (!value) {
      return false;
    }
    // Keep uploaded/admin-managed images while filtering cluttered local file paths.
    if (/^(https?:|data:|blob:)/i.test(value)) {
      return true;
    }
    return curatedImagePaths.has(value);
  }

  function normalizeProject(project, index, defaultProject, fallbackImage) {
    const sanitizedImages = Array.isArray(project && project.images)
      ? project.images.filter(isApprovedImage)
      : [];

    return {
      title: project && project.title ? project.title : (defaultProject && defaultProject.title) ? defaultProject.title : "Prosjekt " + (index + 1),
      category: project && project.category ? project.category : (defaultProject && defaultProject.category) ? defaultProject.category : "Prosjekt",
      showOnHomepage: typeof (project && project.showOnHomepage) === "boolean"
        ? project.showOnHomepage
        : defaultProject && typeof defaultProject.showOnHomepage === "boolean"
          ? defaultProject.showOnHomepage
          : true,
      images: sanitizedImages.length
        ? sanitizedImages
        : defaultProject && Array.isArray(defaultProject.images) && defaultProject.images.length
          ? defaultProject.images.slice()
          : [fallbackImage]
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

    // Keep public contact email consistent across stored data versions.
    merged.contact.email = defaultData.contact.email;

    const rawProjects = Array.isArray(data && data.projects) && data.projects.length
      ? data.projects
      : [];

    const projectCount = Math.max(rawProjects.length, defaultData.projects.length);
    merged.projects = Array.from({ length: projectCount }).map(function (_, index) {
      return normalizeProject(rawProjects[index], index, defaultData.projects[index], merged.heroImage);
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