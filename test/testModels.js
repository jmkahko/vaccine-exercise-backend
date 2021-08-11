// Chai testaukseen
const chai = require('chai');
const expect = chai.expect;

// Modellit
const Vaccinations = require("../models/Vaccinations");
const Vaccines = require("../models/Vaccines");

// Testi datan tuonti
const NewTestVaccinesObject = require('./testDataVaccinesObject');
const NewTestVaccinationsObject = require('./testDataVaccinationsObject')

// newTestVaccinesObject ja newTestVaccinationsObject ovat skeeman mukaisia olioita, joista tehdään Vaccines ja Vaccinations tyyppisiä
const newTestVaccines = Vaccines(NewTestVaccinesObject);
const newTestVaccinations = Vaccinations(NewTestVaccinationsObject);

// Modellien testaus
describe('Modellien testaus', function () {
    it('Vaccines model', function () {
        expect(newTestVaccines).to.be.a.does;
    });

    it('Vaccinations model', function () {
        expect(newTestVaccinations).to.be.a.does;
    });
});