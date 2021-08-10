## Solita tehtävä
Tehtävän [Github-linkki](https://github.com/solita/vaccine-exercise-2021)

Projektin [frontend](https://github.com/jmkahko/vaccine-exercise-frontend) Github

## Projektin käyttöönotto
1. Luo tunnukset ja tietokanta [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) palveluun
2. Kloonaa projekti `git clone https://github.com/jmkahko/vaccine-exercise-backend.git`
3. Lisää aloitusdata kansiosta tiedot tietokantaan

```
mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=Antiqua.source

mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=SolarBuddhica.source

mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=Zerpfy.source

mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccinations --type=json --file=vaccinations.source
```


4. Luo oheinen .env tiedosto projektin juureen

```
# mongoDB Atlas
MONGODB_URL="TÄHÄN SALAINEN TIETOKANTALINKKI"

# Cors frontendiin
FRONTEND_URL = 'http://localhost:4200'

```

5. Aja `npm i`

6. Käynnistä projekti `npm start` komennolla

## Testaus
Testaukseen liittyvät testit löytyvät ./test kansiosta. Kansiossa on test.js tiedosto joka sisältää testit, tämän lisäksi löytyy testi dataa Vaccinations ja Vaccines collectioneihin.

Testauksessa suoritetaan oheiset tarkistukset:
* Enviroment .env tiedoston muuttujat
  - MONGODB_URL muuttujassa on merkkijono
  - FRONTEND_URL muuttujassa on merkkijono

* Modellien testaus
  - Vaccines model
  - Vaccinations model

* MongoDB
  - Tietokanta yhteys
  - #Rokotteisiin liittyvät tietokanta operaatiot
    - Uuden tallennus
    - Tallennetun haku
    - Tallennetun poisto
  - #Rokotuksiin liittyvät tietokanta operaatiot
    - Uuden tallennus
    - Tallennetun haku
    - Tallennetun poisto
  - #Aloitus data tietokannassa
    - Antiqua aloitus data tietokannassa
    - SolarBuddhica aloitus data tietokannassa
    - Zerpfy aloitus data tietokannassa
    - Rokotettujen määrä tietokannassa

Testit saa suoritettua `npm test` komennolla