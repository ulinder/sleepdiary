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

### SuperAdmin - 
Lokalt
http://localhost:3001/users/admin123

Prod 
http://sleep.dunamis.se/users/admin123

# WINDOWS INSTRUKTIONER

OM node ligger i C:/node och sleepdiary ligger i C:/sleepdiary

Starta dev server
> server.bat

# describe tables
Gives all tables
    db > SELECT name FROM sqlite_master WHERE type='table' and tbl_name not like 'sqlite_%';
Descsribe each table:
    db > pragma table_info('posts');


# moment(Number);
Similar to new Date(Number), you can create a moment by passing an integer value 
representing the number of milliseconds since the Unix Epoch (Jan 1 1970 12AM UTC).

# UTS som moment-datum
` var day = moment(1318781876406); `

# Idag som UTS
` console.log(Date.now()/3600000/24/365); `

1360013296123/3600000/24/365 = 43,1257387152


1. Formulär:
    Skapa datum -> spara som UNIX timestamp
2. Beräkna sömneffektivitet
3. 