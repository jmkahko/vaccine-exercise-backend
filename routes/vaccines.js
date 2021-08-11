const express = require('express');
const router = express.Router();
const VaccinesController = require('../controllers/vaccinesController')

// Kuinka monta tilausta ja rokotetta saapunut. Hakuun laitetaan aloitus ja lopetuspäivä
router.get('/manyOrderAndVaccines/:dateStart/:dateEnd', VaccinesController.manyOrderAndVaccines);

// Kuinka monta rokotteista käytetty. Hakuun laitetaan aloitus ja lopetuspäivä
router.get('/howManyVaccinations/:dateStart/:dateEnd', VaccinesController.howManyVaccinations);

// Kuinka monta tilausta / rokotetta tuottajaa kohdin. Hakuun laitetaan aloitus ja lopetuspäivä
router.get('/manyOrderAndVaccinesPerProducer/:dateStart/:dateEnd', VaccinesController.manyOrderAndVaccinesPerProducer);

// Kuinka monta pulloa on vanhentunut tiettynä päivänä. Pullo vanhenee 30 päivän kuluttua saapumisesta
router.get('/howManyBottlesExpired/:date', VaccinesController.howManyBottlesExpired);

// Kuinka monta rokotetta on vanhentunut ennen käyttöä?
router.get('/howManyVaccinesExpired/:date', VaccinesController.howManyVaccinesExpired);

// Kuinka monta rokotetta on jäljellä? Aloituspäivä date laskee suoraan -30 päivää taaksepäin
router.get('/howManyVaccinesAreLeftToUse/:date', VaccinesController.howManyVaccinesAreLeftToUse);

// Kuinka monta rokotetta vanhenee seuraavan 10 päivän aikana? Päivä josta lasketaan seuraavat 10 päivää
router.get('/howManyVaccinesExpireNext10Days/:date', VaccinesController.howManyVaccinesExpireNext10Days);

// Kuinka monta mitäkin rokotetta on sairaaloissa
router.get('/howManyVaccinesAreLeftToUsePerHealth/:date', VaccinesController.howManyVaccinesAreLeftToUsePerHealth);

// Millä rokotteella on missäkin sairaalassa rokotettu sukupuolen mukaan
router.get('/howManyGenderVaccinationsPerHealt/:date', VaccinesController.howManyGenderVaccinationsPerHealt);

// Kuinka monta mitäkin sukupuolta on rokotettu
router.get('/howManyGenderVaccinations/:date', VaccinesController.howManyGenderVaccinations);

module.exports = router;
