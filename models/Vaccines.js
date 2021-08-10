// Mongoose-skema, josta tehdään model joka exportataan.
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon.
const VaccinesSchema = new mongoose.Schema({
  id: {type: String, required: true},
  orderNumber: {type: Number, required: true}, // number of injections available in a bottle
  responsiblePerson: {type: String, required: true}, // number of injections available in a bottle
  healthCareDistrict: {type: String, enum: ['HYKS', 'KYS', 'OYS', 'TAYS', 'TYKS'], required: true}, // String and 'HYKS', 'KYS', 'OYS', 'TAYS', 'TYKS'
  vaccine: {type: String, enum: ['Zerpfy', 'Antiqua', 'SolarBuddhica'], required: true}, // String and Zerpfy, Antiqua, SolarBuddhica
  injections: {type: Number, required: true}, // number of injections available in a bottle
  arrived: {type: String, required: true}, // ISO datetime
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka, joka sisältää skeeman.
const Vaccines = mongoose.model('Vaccines', VaccinesSchema); // Eka laitetaan modelin luokka ja mistä se tulee.

module.exports = Vaccines;