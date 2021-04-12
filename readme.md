### Sömndagbok

## Användning
Det finns två unika vyer:
1 - Skapa ny dagbok -> /users
Varje länk är en unik ingång till en sömndagbok. Behandlare och patient använder samma länk och ser samma innehåll.
2 - dagbokssidan (rooten /) logga in med länken för att komma till formuläret och all visualiserad data.

## Teknisk info
NODE/EXPRESS/SQLITE3

Setting up 
starting app in dev-mode using nodemon
nodemon DEBUG=myapp:* npm start

# Prod
pm2 start bin/www 
pm2 ls // list units

# db cli
sqlite sleepdiary.sqlite

# seeded client
http://localhost:3001/39/123
