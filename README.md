# Angelsen Byggservice

Nettsiden bruker HTML, CSS og JavaScript. Publisert innhold og prosjektbilder lagres hos Netlify. Innlogging og lagring håndteres av Netlify Functions og Netlify Identity; det brukes ikke SQLite eller en separat databasetjeneste.

## Komme i gang med administrasjon

Før den nye administrasjonen kan brukes, må Netlify Identity aktiveres på nettstedet og registrering settes til kun invitasjon. Inviter administratoren og tildel kontoen rollen `admin` eller `administrator` i Netlify Identity. Administratoren må akseptere invitasjonen og velge passord. Funksjonene avviser endringer og bildeopplastinger uten en av disse rollene. Ingen passord eller nøkler skal legges i kildekoden.

På `/auth/admin/` kan administrator redigere kontaktinformasjon, endre rekkefølge, legge til og fjerne prosjekter og laste opp JPEG-, PNG- eller WebP-bilder på opptil 4 MB per bilde. Endringer blir synlige når de lagres. Bildeopplasting lagrer selve bildet umiddelbart; det vises på nettsiden etter at prosjektet er lagret. Bilder som fjernes fra et prosjekt, slettes ikke automatisk fra lagringen.

**Migrering:** Den gamle administrasjonen lagret endringer bare i nettleserens `localStorage`. De er ikke automatisk overført til den felles lagringen. Kontroller og ta vare på eventuelle lokale endringer før overgangen. Standardprosjektene i kildekoden brukes inntil felles innhold er lagret første gang.

Forhåndsvisninger bruker separate Netlify Blobs-lagre fra produksjon, men deler lagring med andre forhåndsvisninger. Andre deploytyper har ikke lagringstilgang. Tidligere versjoner av innholdet lagres i `history/` før hver endring, og prosjektbilder slettes ikke automatisk; gjenoppretting er foreløpig manuell. Etabler også en ekstern sikkerhetskopi av innhold og bilder før løsningen tas i produksjonsbruk; tilbakeføring av kode er ikke sikkerhetskopi av innhold.

## Kontakt

Kontaktskjemaet åpner en ferdig utfylt e-post i besøkerens e-postprogram. Besøkeren må selv sende meldingen. Kontaktinformasjon kan endres i administrasjonen.

## Utvikling og publisering

Installer avhengigheter fra `pnpm-lock.yaml`, og bruk Netlify Dev for å teste Functions, Identity og Blobs. En vanlig statisk server kan vise nettsiden, men kan ikke teste felles lagring eller innlogging. `node scripts/check-site.mjs` kontrollerer JavaScript-syntaks og lokale HTML-referanser. `node scripts/build-site.mjs` kopierer offentlige filer til `dist/`; serverkode, avhengigheter og prosjektfiler er ikke en del av publiseringsmappen.

GitHub Actions kjører kontroller ved push og pull request. Netlify kjører kontrollene og bygger `dist/` ved deploy. GitHub-kontrollen stopper ikke i seg selv Netlify-deploy; kontrollen i Netlifys byggkommando må bestå. Automatiske kontroller erstatter ikke testing av reelle brukerreiser, tilgangsstyring eller tilgjengelighet.
