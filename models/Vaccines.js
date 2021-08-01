// Mongoose-skema, josta tehdään model joka exportataan.
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon.
const VaccinesSchema = new mongoose.Schema({
  id: {type: String},
  orderNumber: {type: Number}, // number of injections available in a bottle
  responsiblePerson: {type: String}, // number of injections available in a bottle
  healthCareDistrict: {type: String}, // HYKS, KYS, OYS, TAYS, TYKS
  vaccine: {type: String}, // Zerpfy, Antiqua, SolarBuddhica
  injections: {type: Number}, // number of injections available in a bottle
  arrived: {type: String}, // ISO datetime
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka, joka sisältää skeeman.
const Vaccines = mongoose.model('Vaccines', VaccinesSchema); // Eka laitetaan modelin luokka ja mistä se tulee.

module.exports = Vaccines;