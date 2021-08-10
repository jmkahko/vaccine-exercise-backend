## Solita tehtävä
Tehtävän [Github-linkki](https://github.com/solita/vaccine-exercise-2021)

Projektin [frontend](https://github.com/jmkahko/vaccine-exercise-frontend) Github

## Projektin käyttöönotto
1. Luo tunnukset ja tietokanta 
    - Joko [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) palveluun
    - Tai paikalliseen tietokantaan
2. Kloonaa projekti `git clone https://github.com/jmkahko/vaccine-exercise-backend.git`
3. Lisää aloitusdata kansiosta tiedot tietokantaan

    - Jos käytössä MongoDB Atlas palvelu
    ```
    mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=Antiqua.source
    mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=SolarBuddhica.source
    mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccines --type=json --file=Zerpfy.source
    mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection vaccinations --type=json --file=vaccinations.source
    ```

    - Jos käytössä paikallista tietokanta esim. Dockerissa
    ```
    docker exec -i mongodb_mongo_1 mongoimport -u KÄYTTÄJÄTUNNUS -p SALASANA -- authenticationDatabase=admin --drop -d TIETOKANTA -c vaccines < Antiqua.source
    docker exec -i mongodb_mongo_1 mongoimport -u KÄYTTÄJÄTUNNUS -p SALASANA -- authenticationDatabase=admin --drop -d TIETOKANTA -c vaccines < SolarBuddhica.source
    docker exec -i mongodb_mongo_1 mongoimport -u KÄYTTÄJÄTUNNUS -p SALASANA -- authenticationDatabase=admin --drop -d TIETOKANTA -c vaccines < Zerpfy.source
    docker exec -i mongodb_mongo_1 mongoimport -u KÄYTTÄJÄTUNNUS -p SALASANA -- authenticationDatabase=admin --drop -d TIETOKANTA -c vaccinations < vaccinations.source
    ```

4. Luo oheinen .env tiedosto projektin juureen

```
# mongoDB Atlas
MONGODB_URL="TÄHÄN SALAINEN TIETOKANTALINKKI"

# Paikalliseen MongoDB:hen yhteys. Korvataan DB_USER, DB_PASSWORD, DB_NAME oikeilla tiedoilla
PAIKALLINEN_MONGODB="mongodb://DB_USER:DB_PASSWORD@localhost:27017/DB_NAME"

# Cors frontendiin
FRONTEND_URL = 'http://localhost:4200'
```

5. Käy määrittelemässä app.js tiedostoon kumpaa tietokantaa käytetään. Löytyy riviltä 29

```
Käytetään MongoDB Atlas palvelua
mongoose
  .connect(process.env.MONGODB_URL, {

  })

Käytetään MongoDB paikallisella koneella
mongoose
  .connect(process.env.PAIKALLINEN_MONGODB, {

  })
```

6. Aja `npm i`

7. Käynnistä projekti `npm start` komennolla

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