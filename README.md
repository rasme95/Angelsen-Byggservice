# Angelsen-Byggservice

Statisk nettside for Angelsen Byggservice bygget med HTML, CSS og JavaScript.

## Struktur

- `index.html`: offentlig nettside
- `auth/admin/index.html`: adminside som på vanlig statisk hosting gir stien `/auth/admin`
- `assets/css`: stilark for offentlig side og admin
- `assets/js`: delt datalagring, public script og admin script

## Admin

Adminsiden bruker en enkel frontend-innlogging uten backend eller ekte autentisering.

- Innloggingen er kun en lokal demonstrasjon og gir ingen reell tilgangsbeskyttelse.
- Endringer lagres i nettleserens `localStorage`
- Hver opprettede prosjekt-grid blir en egen karusell på forsiden
- Bilder kan legges inn som URL-er/stier eller lastes opp direkte fra maskinen i admin

## Kontakt

Forsiden har et kontaktskjema som åpner brukerens e-postklient med en ferdig utfylt melding til `angel.bygg@outlook.com`. Brukeren må selv sende meldingen.

## Begrensning

Løsningen er bevisst statisk. Adminsiden er derfor ikke sikker på serversiden og publiserer ikke filer automatisk. For ekte sikkerhet, publisering, brukerhåndtering og bildeopplasting må dette senere kobles til backend eller CMS.

## Kontroller og publisering

Kjør `node scripts/check-site.mjs` for å kontrollere JavaScript-syntaks og lokale filreferanser i HTML-sidene. Kontrollen kjøres også i GitHub Actions ved push og pull request og som byggkommando på Netlify når Git-basert publisering er koblet opp. Dette erstatter ikke testing av brukerreiser, tilgjengelighet eller sikkerhet.

GitHub-koblingen, produksjonsbranch og automatiske deployer må verifiseres i Netlify før automatisk publisering kan regnes som aktiv. Kontroller gjerne en forhåndsvisning før endringer legges i produksjonsbranchen, og bekreft at den publiserte siden fungerer etterpå. Netlify og GitHub Actions kjører separat; GitHub-kontrollen stopper ikke i seg selv en Netlify-deploy.
