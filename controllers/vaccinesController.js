// Modellien tuonti
const Vaccinations = require("../models/Vaccinations");
const Vaccines = require("../models/Vaccines");

const VaccinesController = {
  // Kuinka monta tilausta ja rokotetta on saapunut, tiettyyn päivään mennessä
  manyOrderAndVaccines: (req, res) => {
    // Url reitistä saatu päivämäärät alku- ja loppupäivä
    let saatuPaivaAlku = req.params.dateStart;
    let saatuPaivaLoppu = req.params.dateEnd;

    Vaccines.aggregate(
      [
        { $match: { arrived: { $gt: saatuPaivaAlku, $lt: saatuPaivaLoppu } } }, // Rajataan alku- ja loppupäivän mukaan hakua
        {
          $group: {
            _id: null,
            rokotetta: { $sum: "$injections" },
            tilausta: { $sum: 1 },
          },
        },
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        // Jos tulee undefined, niin lähetään tyhjä objekti
        if (maara.length < 1) {
          res.json({});
        } else {
          res.json({ "rokotetta": maara[0].rokotetta, "tilausta": maara[0].tilausta });
        }
        
      }
    );
  },

  // Kuinka monta rokotetta käytetty, päivämäärä rajauksella
  howManyVaccinations: (req, res) => {
    // Url reitistä saatu päivämäärät alku- ja loppupäivä
    let saatuPaivaAlku = req.params.dateStart;
    let saatuPaivaLoppu = req.params.dateEnd;

    Vaccinations.countDocuments(
      { vaccinationDate: { $gt: saatuPaivaAlku, $lt: saatuPaivaLoppu } },
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json({ "kaytetytRokotteet": maara });
      }
    );
  },

  // Kuinka monta tilausta / rokotetta tuottajaa kohdin, tiettynä aikavälinä
  manyOrderAndVaccinesPerProducer: (req, res) => {
    // Url reitistä saatu päivämäärät alku- ja loppupäivä
    let saatuPaivaAlku = req.params.dateStart;
    let saatuPaivaLoppu = req.params.dateEnd;

    Vaccines.aggregate(
      [
        { $match: { arrived: { $gt: saatuPaivaAlku, $lt: saatuPaivaLoppu } } },
        {
          $group: {
            _id: { rokote: "$vaccine" },
            rokotteita: { $sum: "$injections" },
            tilauksia: { $sum: 1 },
          },
        },
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json(maara);
      }
    );
  },

  // Kuinka monta pulloa on vanhentunut tiettynä päivänä (muista, että pullo vanhenee 30 päivän kuluttua saapumisesta)
  howManyBottlesExpired: (req, res) => {
    // Haetaan paivamuunnosMiinus functiosta muutettu päiväarvo
    let saatuPaiva = paivamuunnosMiinus(req.params.date, 30);

    Vaccines.aggregate(
      [
        { $match: { arrived: { $lt: saatuPaiva } } },
        { $group: { _id: { rokote: "$vaccine" }, kpl: { $sum: 1 } } },
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json(maara);
      }
    );
  },

  // Kuinka monta rokotetta on vanhentunut ennen käyttöä -> muista vähentää käytettyjen injektioiden määrää vanhentuneesta pullosta
  howManyVaccinesExpired: (req, res) => {
    // Haetaan paivamuunnosMiinus functiosta muutettu päiväarvo
    let saatuPaiva = paivamuunnosMiinus(req.params.date, 30);

    Vaccines.aggregate(
      [
        { $match: { arrived: { $lt: saatuPaiva } } }, // Saadusta päivästä -30 päivää taaksepäin
        { $unwind: "$id" }, // Purkaa dokumenttien alirakenteiden taulukot erillisiksi dokumenteiksi
        {
          // Liitetään vaccines collectionin id sarake vaccinations collectionin sourceBottle sarakkeeseen nimellä rokotetut
          $lookup: { // Vasen ulkoliitos kahden collectionin välille
            from: "vaccinations",
            localField: "id",
            foreignField: "sourceBottle",
            as: "rokotetut",
          },
        },
        {
          // Lasketaan jokaisen rokotteen pullot ja rokotteet yhteensä. Käytetyt rokotteet saadaan laskettua miten monta rokotetut sarakkeessa rivejä
          $group: {
            _id: { rokote: "$vaccine" },
            pullojaYhteensa: { $sum: 1 },
            rokotteitaYhteensa: { $sum: "$injections" },
            rokotteetKaytetyt: {
              $sum: { $size: "$rokotetut" },
            },
          },
        },
        {
          $addFields: {
            rokotteetVanhentuneet: {
              $subtract: ["$rokotteitaYhteensa", "$rokotteetKaytetyt"],
            },
          },
        },
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json(maara);
      }
    );
  },

  // Kuinka monta rokotetta on jäljellä?
  howManyVaccinesAreLeftToUse: (req, res) => {
    // Url reitistä saatu päivämäärä. Haetaan tiedot päivämäärästä 30 päivää taaksepäin
    // Haetaan paivamuunnosMiinus functiosta muutettu päiväarvo aloituspäiväksi
    let saatuPaiva = paivamuunnosMiinus(req.params.date, 30);

    Vaccines.aggregate(
      [
        { $match: { arrived: { $gt: saatuPaiva } } }, // Saadusta päivästä -30 päivää eteenpäin
        { $unwind: "$id" },
        {
          $lookup: {
            from: "vaccinations",
            localField: "id",
            foreignField: "sourceBottle",
            as: "rokotetut",
          },
        },
        {
          $group: {
            _id: { rokote: "$vaccine" },
            pullojaYhteensa: { $sum: 1 },
            rokotteitaYhteensa: { $sum: "$injections" },
            rokotteetKaytetyt: {
              $sum: { $size: "$rokotetut" },
            },
          },
        },
        {
          $addFields: {
            rokotteitaJaljella: {
              $subtract: ["$rokotteitaYhteensa", "$rokotteetKaytetyt"],
            },
          },
        }
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json(maara);
      }
    );
  },

  // Kuinka monta rokotetta vanhenee seuraavan 10 päivän aikana?
  howManyVaccinesExpireNext10Days: (req, res) => {
    // Url reitistä saatu päivämäärä
    // Haetaan paivamuunnosMiinus functiosta muutettu päiväarvo
    let saatuPaivaAlku = paivamuunnosMiinus(req.params.date, 30);

    // Haetaan paivamuunnosMiinus functiosta muutettu päiväarvo
    let saatuPaivaLoppu = paivamuunnosMiinus(req.params.date, 20);

    Vaccines.aggregate(
      [
        { $match: { arrived: { $gt: saatuPaivaAlku, $lt: saatuPaivaLoppu } } },
        { $unwind: "$id" },
        {
          $lookup: {
            from: "vaccinations",
            localField: "id",
            foreignField: "sourceBottle",
            as: "rokotetut",
          },
        },
        {
          $group: {
            _id: { rokote: "$vaccine" },
            pullojaYhteensa: { $sum: 1 },
            rokotteitaYhteensa: { $sum: "$injections" },
            rokotteetKaytetyt: {
              $sum: { $size: "$rokotetut" },
            },
          },
        },
        {
          $addFields: {
            rokotteetVanhenevat: {
              $subtract: ["$rokotteitaYhteensa", "$rokotteetKaytetyt"],
            },
          },
        }
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json(maara);
      }
    );
  },

  // Kuinka monta mitäkin rokotetta on sairaaloissa
  howManyVaccinesAreLeftToUsePerHealth: (req, res) => {
    // Url reitistä saatu päivämäärä. Haetaan tiedot päivämäärästä 30 päivää taaksepäin
    // Haetaan paivamuunnosMiinus functiosta muutettu päiväarvo aloituspäiväksi
    let alkuPaivaMuunnos = paivamuunnosMiinus(req.params.date, 30);
    let saatuPaiva = req.params.date;

    Vaccines.aggregate(
      [
        { $match: { arrived: { $gte: alkuPaivaMuunnos, $lte: saatuPaiva } } }, // Saadusta päivästä -30 päivää eteenpäin saatuun päivään
        {
          $lookup: {
            from: "vaccinations",
            localField: "id",
            foreignField: "sourceBottle",
            as: "rokotetut",
          },
        },
        {
          $group: {
            _id: {
              sairaala: "$healthCareDistrict",
              rokote: "$vaccine"

            },
            pullojaYhteensa: { $sum: 1 },
            rokotteitaYhteensa: { $sum: "$injections" },
            rokotteetKaytetyt: {
              $sum: { $size: "$rokotetut" },
            },
          },
        },
        {
          $addFields: {
            rokotteitaJaljella: {
              $subtract: ["$rokotteitaYhteensa", "$rokotteetKaytetyt"],
            },
          },
        }
      ],
      (error, maara) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }

        res.json(maara);
      }
    );
  },

  // Millä rokotteella on missäkin sairaalassa rokotettu sukupuolen mukaan
  howManyGenderVaccinationsPerHealth: (req, res) => {
    // Url reitistä saatu päivämäärä
    let saatuPaiva = req.params.date;

    Vaccinations.aggregate([
      { $match: { vaccinationDate: { $lt: saatuPaiva } } },
      { $unwind: "$_id" },
      {
        $lookup: {
          from: "vaccines",
          localField: "sourceBottle",
          foreignField: "id",
          as: "sairaala",
        },
      },
      { $group: { 
        _id: { 
          sairaala: "$sairaala.healthCareDistrict", rokote: "$sairaala.vaccine", sukupuoli: "$gender" }, 
          count: { $sum: 1 } 
        } 
      },

    ],
    (error, maara) => {
      if (error) {
        console.log(error); // Lähetetään virhe myös konsoliin.
        res.json(error); // Palautetaan virhe JSON muodossa.
      }

      // Alustetaan tyhjä taulukko
      let taulukkoKoko = [];
      
      // Käydään saatu data läpi ja muotoillaan, että yhdessä objecktissa on sairaala, rokote, sukupuoli ja määrä
      for (let x = 0; x < maara.length; x++) {
        let taulukkoKerta = []; // Alustetaan joka kerta taulukkoKerta tyhjänä
        taulukkoKerta.push(["sairaala", maara[x]._id.sairaala.join()]) // Lisätään taulukkoon .join()-arvolla saadaan muutettu taulukko arvo ei taulukoksi
        taulukkoKerta.push(["rokote", maara[x]._id.rokote.join()])
        taulukkoKerta.push(["sukupuoli", maara[x]._id.sukupuoli])
        taulukkoKerta.push(["maara", maara[x].count])

        // Tehdään taulukkoKerta taulukosta objeckti ja tallennetaan taulukkoKoko taulukkoon
        let taulukkoKertaToObject = Object.fromEntries(new Map(taulukkoKerta));
        taulukkoKoko.push(taulukkoKertaToObject);
      }
      res.json(taulukkoKoko);
    });
  },

  // Kuinka monta mitäkin sukupuolta on rokotettu
  howManyGenderVaccinations: (req, res) => {
    // Url reitistä saatu päivämäärä
    let saatuPaiva = req.params.date;

    Vaccinations.aggregate([
      { $match: { vaccinationDate: { $lt: saatuPaiva } } },
      { $group: {
        _id: 
          { sukupuoli: "$gender" }, 
          count: { $sum: 1 }
        }
      }
    ],
    (error, maara) => {
      if (error) {
        console.log(error); // Lähetetään virhe myös konsoliin.
        res.json(error); // Palautetaan virhe JSON muodossa.
      }
      res.json(maara);
    }
  );
  }
};

// Url osoitteesta saadaan haluttu päiväystieto esim. 2021-04-12T05:33:37.642901Z. Josta vähennetään haluttu päivämäärä määrä, joka saadaan miinusPaivaMaara muuttujasta
function paivamuunnosMiinus(paivaSaatu, miinusPaivaMaara) {
  // Otetaan saadusta tiedosta 11. merkistä eteenpäin merkit esim. T05:33:37.642901Z
  let paivaLoppu = paivaSaatu.substr(10);

  // Vähennetään 30 päivää kokopaiva muuttujasta päivät * tunnit * minuutit
  // Tästä saadaan arvoksi esim. 1628467200000, joka on Unix time
  let paivamiinuskolmekymmenta =
    new Date(paivaSaatu) - miinusPaivaMaara * 24 * 60 * 60 * 1000;

  // Muutetaan takaisin muotoon esim. "2021-09-08T00:00:00.000Z"
  let muunnos = new Date(paivamiinuskolmekymmenta);

  // Oteteaan takaisin muutetusta päivätiedosta vuosi, kuukausi ja päivä omiin muuttujiin.
  // Jos tätä ei tehdä niin paluu arvo on Date muodossa
  let muunnosVuosi = muunnos.getFullYear();
  let muunnosKuukausi = muunnos.getMonth() + 1; // Jostakin syystä näyttää yhden kuukauden liian vähän
  let muunnosPaiva = muunnos.getDate();

  // Jos päivä on pienempi kuin 10 lisätään nolla eteen
  if (muunnosPaiva < 10) {
    muunnosPaiva = "0" + muunnosPaiva;
  }

  // Jos kuukausi on pienempi kuin 10 lisätään nolla eteen
  if (muunnosKuukausi < 10) {
    muunnosKuukausi = "0" + muunnosKuukausi;
  }

  // Tehdään lopullinen päivä arvo
  let lopullinenPaiva =
    muunnosVuosi + "-" + muunnosKuukausi + "-" + muunnosPaiva + paivaLoppu;

  console.log('paivaSaatu: ' + paivaSaatu); // Tulostetaan saatu päiväarvo
  console.log('paivaLopullinen: ' + lopullinenPaiva); // Tulostetaan muunnoksen jälkeen

  // Palautetaan 30 päivää vähennetty päivä takaisin
  return lopullinenPaiva;
}

module.exports = VaccinesController;
