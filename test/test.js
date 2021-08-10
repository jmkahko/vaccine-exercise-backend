// Testaukseen tarvittavia
const assert = require('assert'); // Mochajs testaukseen

// Chai testaukseen
const chai = require('chai');
const chaiFiles = require('chai-files');
chai.use(chaiFiles);
const expect = chai.expect;

const mongoose = require('mongoose'); // MongoDB tietokantayhteys
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua

// Modellit
const Vaccinations = require("../models/Vaccinations");
const Vaccines = require("../models/Vaccines");

// Testi datan tuonti
const NewTestVaccinesObject = require('./testDataVaccinesObject');
const NewTestVaccinationsObject = require('./testDataVaccinationsObject')

// newTestVaccinesObject ja newTestVaccinationsObject ovat skeeman mukaisia olioita, joista tehdään Vaccines ja Vaccinations tyyppisiä
const newTestVaccines = Vaccines(NewTestVaccinesObject);
const newTestVaccinations = Vaccinations(NewTestVaccinationsObject);

// Löytyykö .env tiedoston ja muuttujien tarkistus
describe('Enviroment .env tiedoston muuttujat', function () {
  it('MONGODB_URL muuttujassa on merkkijono', function (done) {
    // Tarkistetaan, onko merkkijono pidempi kuin 1
    if (process.env.MONGODB_URL.length > 1) {
      done();
    }
  });

  it('FRONTEND_URL muuttujassa on merkkijono', function (done) {
    // Tarkistetaan, onko merkkijono pidempi kuin 1
    if (process.env.FRONTEND_URL.length > 1) {
      done();
    }
  });
});

// Modellien testaus
describe('Modellien testaus', function () {
  it('Vaccines model', function () {
    expect(newTestVaccines).to.be.a.does;
  });

  it('Vaccinations model', function () {
    expect(newTestVaccinations).to.be.a.does;
  });
});

// MongoDB tietokanta testejä
describe('MongoDB', function () {
  it('Tietokanta yhteys', function (done) {
    mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        //console.log('Tietokanta yhteys muodostettu');
        done();
      })
      .catch((err) => {
        console.error('Tietokanta yhteys epäonnistui: ' + err);
      });
  });

  describe('#Rokotteisiin liittyvät tietokanta operaatiot', function () {
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

  describe('#Rokotuksiin liittyvät tietokanta operaatiot', function () {
    it('Uuden tallennus', function (done) {
      newTestVaccinations.save(done);
    });

    it('Tallennetun haku', function (done) {
      Vaccinations.find({
        vaccinationId: '1a2b3c4d-3a4b-3a4b-3a4b-1a2b3c4d5e6f'
      }, (err) => {
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

  describe('#Aloitus data tietokannassa', function () {
    it('Antiqua aloitus data tietokannassa', function (done) {
      Vaccines.findOne({ id: '6da3a8cf-c923-4c77-8f80-c69c935fe1df' })
        .then((antiquaId) => {
          assert(antiquaId.id === '6da3a8cf-c923-4c77-8f80-c69c935fe1df');
          done();
        })
    });

    it('SolarBuddhica aloitus data tietokannassa', function (done) {
      Vaccines.findOne({ id: '19b7bddc-549b-4e1a-b8ca-9e4f25b3eb86' })
        .then((solarBuddhicaId) => {
          assert(solarBuddhicaId.id === '19b7bddc-549b-4e1a-b8ca-9e4f25b3eb86');
          done();
        })
    });

    it('Zerpfy aloitus data tietokannassa', function (done) {
      Vaccines.findOne({ id: '6b160d09-e2ea-4e49-a291-96a33caa5f80' })
        .then((zerpfyId) => {
          assert(zerpfyId.id === '6b160d09-e2ea-4e49-a291-96a33caa5f80');
          done();
        })
    });

    it('Rokotettujen määrä tietokannassa', function (done) {
      Vaccinations.countDocuments({})
        .then((vaccinationCount) => {
          assert(vaccinationCount === 7000);
          done();
        })
    });
  });
});