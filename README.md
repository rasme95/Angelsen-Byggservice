# Angelsen-Byggservice

Statisk nettside for Angelsen Byggservice bygget med HTML, CSS og JavaScript.

## Struktur

- `index.html`: offentlig nettside
- `auth/admin/index.html`: adminside som på vanlig statisk hosting gir stien `/auth/admin`
- `assets/css`: stilark for offentlig side og admin
- `assets/js`: delt datalagring, public script og admin script

## Admin

Adminsiden bruker en enkel frontend-innlogging uten backend eller ekte autentisering.

- Brukernavn: `SveinAngelsen`
- Passord: `SveinAngelsen123`
- Endringer lagres i nettleserens `localStorage`
- Hver opprettede prosjekt-grid blir en egen karusell på forsiden
- Bilder kan legges inn som URL-er/stier eller lastes opp direkte fra maskinen i admin

## Kontakt

Forsiden har et kontaktskjema som åpner brukerens e-postklient og sender til `post@angelsenbyggservice.no`.

## Begrensning

Løsningen er bevisst statisk. Adminsiden er derfor ikke sikker på serversiden og publiserer ikke filer automatisk. For ekte sikkerhet, publisering, brukerhåndtering og bildeopplasting må dette senere kobles til backend eller CMS.
