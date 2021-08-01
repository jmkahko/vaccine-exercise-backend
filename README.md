## Solita tehtävä
[Tehtävän Github-linkki](https://github.com/solita/vaccine-exercise-2021)

Projektin [frontend](linkki) Github-linkki

## Projektin käyttöönotto

1. Luo tunnukset ja tietokanta [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) palveluun
2. Lisää aloitusdata kansiosta tiedot tietokantaan

```
mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=Antiqua.source

mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=SolarBuddhica.source

mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=Zerpfy.source

mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccinations --type=json --file=vaccinations.source
```


3. Luo oheinen .env tiedosto projektin juureen

```
# mongoDB Atlas
MONGODB_URL="TÄHÄN SALAINEN TIETOKANTALINKKI"

# Cors frontendiin
FRONTEND_URL = 'http://localhost:4200'

```
4. Käynnistä projekti `npm start` komennolla