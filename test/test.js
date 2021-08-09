// Testaukseen tarvittavia
const assert = require('assert'); // Mochajs tarvitsema
const mongoose = require('mongoose'); // MongoDB tietokantayhteys
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua
const Vaccinations = require("../models/Vaccinations"); // Modelli
const Vaccines = require("../models/Vaccines"); // Modelli


// Tietokanta yhteyden muodostus MongoDB palveluun
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
});


// mochajs aloitustesti
describe('Array', function() {
  describe('#indexOf()', function() {
    it('Palauttaa arvon -1, jos paikassa 4 ei ole arvoa', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

// Löytyykö .env tiedosto ja löytyykö sieltä MONGODB_URL arvosta merkkijono
describe('Enviroment', function() {
      it('Löytyykö .env tiedosto', function(done) {

        // Tarkistetaan, onko merkkijono pidempi kuin 1
        if (process.env.MONGODB_URL.length > 1) {
            done();
        }

    });
  });

// MongoDB aloitus data tietokannassa eri rokotteiden ja rokotettujen määrä
describe('MongoDB', function() {
    it('Antiqua aloitus data tietokannassa', function(done) {
        Vaccines.findOne({id: '6da3a8cf-c923-4c77-8f80-c69c935fe1df'})
            .then((antiquaId) => {
                assert(antiquaId.id === '6da3a8cf-c923-4c77-8f80-c69c935fe1df');
                done();
            })
    });

    it('SolarBuddhica aloitus data tietokannassa', function(done) {
        Vaccines.findOne({id: '19b7bddc-549b-4e1a-b8ca-9e4f25b3eb86'})
            .then((solarBuddhicaId) => {
                assert(solarBuddhicaId.id === '19b7bddc-549b-4e1a-b8ca-9e4f25b3eb86');
                done();
            })
    });

    it('Zerpfy aloitus data tietokannassa', function(done) {
        Vaccines.findOne({id: '6b160d09-e2ea-4e49-a291-96a33caa5f80'})
            .then((zerpfyId) => {
                assert(zerpfyId.id === '6b160d09-e2ea-4e49-a291-96a33caa5f80');
                done();
            })
    });

    it('Rokotettujen määrä tietokannassa', function(done) {
        Vaccinations.countDocuments({})
            .then((vaccinationCount) => {
                assert(vaccinationCount === 7000);
                done();
            })
    });
});