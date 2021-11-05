# Sömndagbok

## Om 
Denna sömndagbok skapades av Epsykiatrienheten.se (Sahlgrenska) med syfte att vara ett anpassat formulär för att hämta in sömnregistreringar i sömnbehandlingar.
Alla komponenter i denna, från tekniska beroenden (läs package.json för detaljer) till innehållsmässiga delar är fri att använda. 

## Börja använda
Det finns en ingång för en användare till sömndagboken om inget annat gjorts:
1. /users - Härifrån skapas en tom dagbok. För varje dagbok skapas en unik länk som är den enda ingången till en tom sömndagbok. Då sömndagboken bygger på att behandlarstöd alltid finns med, skapas två länkar där admin/behandlar-länken innehåller en unik flagga som särskiljer dem.
2. root (/) - När man väl gått in på sidan en gång via länken ovan kommer man direkt till roten av sidan (/) och är därefter inloggad. 

Länken bör sparas för att senare återaktivera sessionen. Och för behandlare behöver man använda länken för att växla mellan flera klienter.

### SuperAdmin
För att nå en överblick av alla dagböcker som ligger uppe
Lokalt
http://localhost:3001/users/admin123

## Teknik
Nodejs/Express/SQLITE3
För daemonisering av appen i prod är en rekommendation att använda pm2 

### Setup
> npm install
> npm install pm2 
> npm run dbsetup

development eller production ? NODE_ENV=production/development
*dev:*
nodemon DEBUG=myapp:* npm start
*prod:*
NODE_ENV=production pm2 start pre-prod/bin/www --name sleepdiary-pre-prod


### inställningar databasnivå
mode = universal switch
0 = default
1 = sömnrestriktion aktiv

Tid sparas som unix-tid i milisekunder. Appen använder moment.js för att hantera datum och tid. 
litet x = milisekunder, stort X sekunder. 

### Test
Starta tester med ``npm test``
Testerna kör:
- Rootsidan
- Secret admin path
- Skapa ny dagbok

## Lokal struktur
./gitrepo
  /prod
  /preprod

rsync -av --progress repo/* pre-prod/ --exclude .git --exclude tests

## https cerifikat
sudo certbot certonly --manual -d somndagbok.vgregion.se

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/somndagbok.vgregion.se/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/somndagbok.vgregion.se/privkey.pem
   Your cert will expire on 2021-11-30. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le