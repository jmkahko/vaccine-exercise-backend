// Testaukseen tarvittavia
const assert = require('assert'); // Mochajs testaukseen

const mongoose = require('mongoose'); // MongoDB tietokantayhteys
require('dotenv').config(); //dotenv -moduuli tarvitaan .env -tiedoston käyttöön

// Modellit
const Vaccinations = require("../models/Vaccinations");
const Vaccines = require("../models/Vaccines");

// Testi datan tuonti
const NewTestVaccinesObject = require('./testDataVaccinesObject');
const NewTestVaccinationsObject = require('./testDataVaccinationsObject')

// newTestVaccinesObject ja newTestVaccinationsObject ovat skeeman mukaisia olioita, joista tehdään Vaccines ja Vaccinations tyyppisiä
const newTestVaccines = Vaccines(NewTestVaccinesObject);
const newTestVaccinations = Vaccinations(NewTestVaccinationsObject);

describe('MongoDB', function () {
  describe('Tietokanta yhteys', function () {

    // Tarkistetaan onko paikallinen tietokanta käytössä
    if (process.env.PAIKALLINEN_MONGODB === 'mongodb://KÄYTTÄJÄTUNNUS:SALASANA@localhost:27017/TIETOKANTA') {
      it('Paikallinen esim. Docker, ei ole käytössä', function (done) {
        done();
      });
    } else {
      it('Paikallinen esim. Docker', function (done) {
        mongoose
          .connect(process.env.PAIKALLINEN_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
          })
          .then(() => {
            done();
          })
          .catch((err) => {
            console.error('Paikallinen tietokanta yhteys epäonnistui');
          });
      });
    }

    // Tarkistetaan onko MongoDB Atlas käytössä
    if (process.env.MONGODB_URL === 'TÄHÄN SALAINEN TIETOKANTALINKKI') {
      it('Atlas palvelu ei ole käytössä', function (done) {
        done();
      });
    } else {
      it('Atlas palveluun', function (done) {
        mongoose
          .connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
          })
          .then(() => {
            done();
          })
          .catch((err) => {
            console.error('Atlas palvelun tietokanta yhteys epäonnistui');
          });
      });
    }
  });

  describe('Rokotteisiin liittyvät CRD tietokanta operaatiot', function () {
    it('Uuden tallennus', function (done) {
      newTestVaccines.save(done);
    });

    it('Tallennetun haku', function (done) {
      Vaccines.find({
        id: '1a2b3c4d-1a2b-1a2b-1a2b-1a2b3c4d5e6f'
      }, (err) => {
        // Jos tulee virhe consolilokataan virhe
        if (err) {
          throw err;
        }
        done();
      });
    });

    it('Tallennetun poisto', function (done) {
      Vaccines.deleteOne({ id: '1a2b3c4d-1a2b-1a2b-1a2b-1a2b3c4d5e6f' }, (err) => {
        // Jos tulee virhe consolilokataan virhe
        if (err) {
          throw err;
        }
        done();
      });
    });
  });

  describe('Rokotuksiin liittyvät CRD tietokanta operaatiot', function () {
    it('Uuden tallennus', function (done) {
      newTestVaccinations.save(done);
    });

    it('Tallennetun haku', function (done) {
      Vaccinations.find({ vaccinationId: '1a2b3c4d-3a4b-3a4b-3a4b-1a2b3c4d5e6f' }, (err) => {
        // Jos tulee virhe consolilokataan virhe
        if (err) {
          console.log(err);
        }
        done();
      });
    });

    it('Tallennetun poisto', function (done) {
      Vaccinations.deleteOne({ vaccinationId: '1a2b3c4d-3a4b-3a4b-3a4b-1a2b3c4d5e6f' }, (err) => {
        // Jos tulee virhe consolilokataan virhe
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  })

  // Testaan, että löytyy joku arvo tietokannasta jokaisesta rokotteesta
  describe('Aloitus data tietokannassa', function () {
    it('Antiqua', function (done) {
      Vaccines.findOne({ id: '6da3a8cf-c923-4c77-8f80-c69c935fe1df' })
        .then((antiquaId) => {
          assert(antiquaId.id === '6da3a8cf-c923-4c77-8f80-c69c935fe1df');
          done();
        })
    });

    it('SolarBuddhica', function (done) {
      Vaccines.findOne({ id: '19b7bddc-549b-4e1a-b8ca-9e4f25b3eb86' })
        .then((solarBuddhicaId) => {
          assert(solarBuddhicaId.id === '19b7bddc-549b-4e1a-b8ca-9e4f25b3eb86');
          done();
        })
    });

    it('Zerpfy', function (done) {
      Vaccines.findOne({ id: '6b160d09-e2ea-4e49-a291-96a33caa5f80' })
        .then((zerpfyId) => {
          assert(zerpfyId.id === '6b160d09-e2ea-4e49-a291-96a33caa5f80');
          done();
        })
    });
  });
});
