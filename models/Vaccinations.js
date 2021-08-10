// Mongoose-skema, josta tehdään model joka exportataan.
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon.
const VaccinationsSchema = new mongoose.Schema({
  vaccinationId: {type: String, required: true}, // universal identifier of the vaccination
  sourceBottle: {type: String, required: true}, // number of injections available in a bottle
  gender: {type: String, enum: ['male', 'female', 'nonbinary'], required: true}, // male, female, nonbinary
  vaccinationDate: {type: String, required: true} // datetime
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka, joka sisältää skeeman.
const Vaccinations = mongoose.model('Vaccinations', VaccinationsSchema); // Eka laitetaan modelin luokka ja mistä se tulee.

module.exports = Vaccinations;
