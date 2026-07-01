(function () {
  const storageKey = "angelsen-byggservice-site-data";
  const adminSessionKey = "angelsen-byggservice-admin-session";
  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const projectRootUrl = new URL("../../", scriptUrl);
  const imageLibrary = [
    "Bilder/Logo/logo.jpg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-E0F701BA-FA1B-4877-9136-B4D162617BD8.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-DD6E830E-30D0-47DD-8E35-8BAB1BA604AC.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-D5F4EE24-98B0-494D-A644-B0E78839B3B9.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-D0D15565-9906-44E1-9894-3ECED8F5F138.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-CCA042BB-8C4A-47ED-A5C2-6C165D53EB74.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-CB3C1C2E-73A7-47B7-82A0-ECEE05CFCF3D.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-B5471D1F-9709-4D0D-83C4-4BDC9026DBFE.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-AA64F688-D84F-4479-883F-98079D0340D1.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-8E1A713C-C313-4996-B6A1-7DC237B231C7.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-8CCD16D1-2D17-4235-8DCD-FC1219693CE8.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-7EF81E0D-9D58-4C13-8130-8AC89278EE36.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-7D6EE456-C756-4217-B041-5C7CA6AD459B.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-78F4DA8E-5920-4A34-9712-5F40B4F80112.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-73837324-77AF-454F-8582-26B6B740075B.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-728A8639-9C7E-48A7-97E6-C1B67DFE4016.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-6E67531E-185D-47DA-AAA1-48B3ABB59B6A.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-6E303E5B-1C0C-475E-9BA9-47A0073501BA.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-61BECFB8-0BA1-44C9-BB02-69C98536B586.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-520FDB21-D18E-46C5-B4B4-A97897A43000.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-35A258E7-8BD1-4A30-80F0-E0FBED400B0D.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-2C34BC7A-6289-41A1-B537-502BAC54251B.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-2BBBB766-F02D-4FED-9079-F299CA0903C6.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-242FE9F2-C82F-49CE-87D9-9960285018A5.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-20C091A5-A551-499B-8A79-D8A0D249A4BD.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-1940BB8C-2B48-4830-9702-3B4451C8DF0E.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-11BF36A7-587A-448D-A773-F00B52FB4A4F.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-0DFFAB7A-0B7A-42F9-AFF4-BB66DD8A4510.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-0D34D600-36FF-4265-91FC-C488421A155E.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-0673BE02-1A41-44AB-9AFC-8C42DFBE2082.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice/original-F32D7A89-1569-4BEC-9616-87EF2E20535D.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-F6ACD678-1680-4B67-8AA6-3FA115F1D3FA.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-F62B9C9A-7FDD-424C-9CD2-FFBF295908A5.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-EEB4DC0F-5FC2-462E-9CEE-48A9423F07A4.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-CCFF1958-97FE-4D15-83F3-8AFB902EAD5B.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-C9AEC15A-167D-49D7-8F2D-AC614921219E.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-C8A85A4B-9ABB-4A0A-8E2C-136DE4E7C6C0.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-BDA8CB57-AB91-47B2-B0EF-29E59A632798.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-BBCFD489-A4A0-4957-B434-6BFFA52F5852.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-B74B2EE5-2C0E-4B37-90C4-C00F8757EC22.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-AFD73CD5-E24F-4435-8C03-0403F9DEF388.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-A1C347ED-220C-4440-8236-5B7DD3F2616D.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-902AE882-73C7-4F54-8452-8EF531779AF0.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-8D265042-FBC3-4F65-888C-800F6ABF1F74.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-8AC193BC-FE68-4F9F-9780-9E040B1B2DB0.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-88F5630C-9B10-4A3A-92AC-5A6FB0270D67.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-85C302F1-C09B-40A0-B0C4-EBE6D5DD93E0.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-7ABADC84-B25A-4F16-A69D-4C4ED58DEF50.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-6CADC8C4-ACEC-4CE6-9BEC-38AF37F4E2EC.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-54FB3B04-02FD-406F-95E0-97809B5E5358.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-2092D31B-C86C-4D88-B9C2-CCE520A0E624.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-1646D684-DDF9-4B4C-BF8B-5F19DC37BED8.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-0C0BAF81-64B2-483C-BA4E-DE941F6F8CD2.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-0A547366-CA2D-4A85-8050-DD59A8BE7BF7.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-03489DA6-16F8-4002-B2BB-4BCF044CE91D.jpeg",
    "Bilder/Bilder nettsiden Angelsen byggservice 1/original-02DC1CD3-B363-4F4E-8155-091DE05E2AD2.jpeg"
  ];
  const defaultData = {
    businessName: "Angelsen Byggservice",
    brandSubline: "Tømrer, vedlikehold og rehabilitering",
    heroTitle: "Alt innen bygg, vedlikehold og flis.",
    heroLead: "Angelsen Byggservice hjelper privatkunder med oppussing, rehabilitering, flis, utvendige oppgraderinger og praktiske byggeoppdrag i Bergen og omegn.",
    heroImage: "Bilder/Bilder nettsiden Angelsen byggservice/original-E0F701BA-FA1B-4877-9136-B4D162617BD8.jpeg",
    heroBadgeTitle: "Bad, uteområder og vedlikehold",
    heroBadgeText: "Nettsiden er satt opp for å vise ekte prosjektbilder, tydelige tjenester og en enkel vei til direkte kontakt.",
    highlights: [
      { value: "Bergen", label: "Lokale oppdrag og rask dialog" },
      { value: "Mange fag", label: "Tømrer, flis, vedlikehold og utearbeid" },
      { value: "Ekte bilder", label: "Prosjekter vist med egne gallerier" }
    ],
    heroCards: [
      { title: "Bad og flis", text: "Rolige materialvalg, detaljfokus og moderne uttrykk." },
      { title: "Terrasse og uteområde", text: "Oppgraderinger som forbedrer både bruk og helhet." },
      { title: "Vedlikehold og utbedring", text: "Ryddige leveranser ute og inne gjennom hele året." }
    ],
    servicesIntro: "Behovene varierer fra mindre reparasjoner til komplette oppgraderinger. Derfor er tjenestene presentert bredt, men formulert konkret nok til at kunden raskt ser om oppdraget passer.",
    services: [
      "Takskifte og utbedringer",
      "Terrasser, gjerder og levegger",
      "Gulvlegging og listing",
      "Kjøkkenmontering og innvendig oppgradering",
      "Vinduer, dører og bordkledning",
      "Flislegging i kjøkken, gang, bad og bod",
      "Pergola, blomsterkasser og mindre spesialtilpasninger"
    ],
    aboutTitle: "En samarbeidspartner som holder orden hele veien",
    aboutText: "Målet er å gjøre førsteinntrykket profesjonelt, men jordnært. Derfor er innholdet praktisk: hva som leveres, hvordan arbeidet følges opp og hvordan prosjektene faktisk ser ut når de presenteres ryddig.",
    process: [
      { title: "Tydelig avklaring", text: "Oppdrag starter med en konkret gjennomgang av behov, prioriteringer og omfang." },
      { title: "Løsningsorientert utførelse", text: "Materialvalg og utførelse vurderes med fokus på bruk, finish og varighet." },
      { title: "Ryddig avslutning", text: "Resultatene dokumenteres bedre når bilder og prosjekttekst samles på ett sted." }
    ],
    contactTitle: "Fortell kort om prosjektet ditt",
    contactBody: "Beskriv gjerne hva som skal gjøres, hvor prosjektet er og om du har ønsket tidspunkt eller bilder klare. Skjemaet under åpner e-postklienten din med ferdig utfylt melding.",
    contact: {
      phone: "464 20 079",
      email: "post@angelsenbyggservice.no",
      area: "Bergen og omegn",
      hours: "Svarer fortløpende på hverdager"
    },
    social: { facebook: "https://www.facebook.com/" },
    projects: [
      {
        title: "Prosjekt 1: Bad og flis",
        category: "Våtrom og finish",
        summary: "Et prosjekt med rolige materialtoner, mørke detaljer og en helhetlig løsning som fremstår moderne, praktisk og godt balansert.",
        delivery: "Flisarbeid, montering og detaljfinish",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice/original-73837324-77AF-454F-8582-26B6B740075B.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-7EF81E0D-9D58-4C13-8130-8AC89278EE36.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-8CCD16D1-2D17-4235-8DCD-FC1219693CE8.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-11BF36A7-587A-448D-A773-F00B52FB4A4F.jpeg"
        ]
      },
      {
        title: "Prosjekt 2: Terrasse og uteområde",
        category: "Utvendig oppgradering",
        summary: "Terrasse og uteplass presentert på en måte som viser materialitet, linjer og brukssituasjon uten å virke tilfeldig.",
        delivery: "Terrasse, rekkverk og utemiljø",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice/original-E0F701BA-FA1B-4877-9136-B4D162617BD8.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-D5F4EE24-98B0-494D-A644-B0E78839B3B9.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-CCA042BB-8C4A-47ED-A5C2-6C165D53EB74.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice/original-6E67531E-185D-47DA-AAA1-48B3ABB59B6A.jpeg"
        ]
      },
      {
        title: "Prosjekt 3: Fasade og lyssetting",
        category: "Detaljer ute",
        summary: "Fasadebilder og lyssetting fungerer bedre når de presenteres som en samlet leveranse, ikke som løse enkeltbilder.",
        delivery: "Montering, oppgradering og detaljarbeid",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-03489DA6-16F8-4002-B2BB-4BCF044CE91D.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-B74B2EE5-2C0E-4B37-90C4-C00F8757EC22.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-8AC193BC-FE68-4F9F-9780-9E040B1B2DB0.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-A1C347ED-220C-4440-8236-5B7DD3F2616D.jpeg"
        ]
      },
      {
        title: "Prosjekt 4: Tak og tekniske arbeider",
        category: "Praktisk vedlikehold",
        summary: "Tekniske oppdrag fortjener også en ryddig plass i prosjektoversikten, slik at bredden i leveransene blir tydelig.",
        delivery: "Utbedring og utvendig arbeid",
        images: [
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-0C0BAF81-64B2-483C-BA4E-DE941F6F8CD2.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-2092D31B-C86C-4D88-B9C2-CCE520A0E624.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-54FB3B04-02FD-406F-95E0-97809B5E5358.jpeg",
          "Bilder/Bilder nettsiden Angelsen byggservice 1/original-F6ACD678-1680-4B67-8AA6-3FA115F1D3FA.jpeg"
        ]
      }
    ]
  };
  const adminCredentials = { username: "SveinAngelsen", password: "SveinAngelsen123" };
  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function normalizeData(data) {
    const merged = {
      ...deepClone(defaultData),
      ...(data || {}),
      contact: { ...defaultData.contact, ...((data && data.contact) || {}) },
      social: { ...defaultData.social, ...((data && data.social) || {}) },
      highlights: Array.isArray(data && data.highlights) ? data.highlights : deepClone(defaultData.highlights),
      heroCards: Array.isArray(data && data.heroCards) ? data.heroCards : deepClone(defaultData.heroCards),
      services: Array.isArray(data && data.services) ? data.services : deepClone(defaultData.services),
      process: Array.isArray(data && data.process) ? data.process : deepClone(defaultData.process),
      projects: Array.isArray(data && data.projects) && data.projects.length ? data.projects : deepClone(defaultData.projects)
    };
    merged.projects = merged.projects.map(function (project, index) {
      return {
        title: project.title || "Prosjekt " + (index + 1),
        category: project.category || "Prosjekt",
        summary: project.summary || "",
        delivery: project.delivery || "",
        images: Array.isArray(project.images) && project.images.length ? project.images : [merged.heroImage]
      };
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
  function resolveAssetPath(path) { return new URL(path, projectRootUrl).href; }
  function sanitizePhone(phone) { return String(phone || "").replace(/[^+\d]/g, ""); }
  window.AngelsenStore = {
    storageKey: storageKey,
    adminSessionKey: adminSessionKey,
    adminCredentials: adminCredentials,
    imageLibrary: imageLibrary,
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