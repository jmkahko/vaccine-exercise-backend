require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua

// Löytyykö .env tiedoston ja muuttujien tarkistus
describe('Enviroment .env tiedoston muuttujat', function () {
  it('MONGODB_URL muuttujassa on merkkijono', function (done) {
    // Tarkistetaan, onko merkkijono pidempi kuin 1
    if (process.env.MONGODB_URL.length > 1) {
      done();
    }
  });

  it('PAIKALLINEN_MONGODB muuttujassa on merkkijono', function (done) {
    // Tarkistetaan, onko merkkijono pidempi kuin 1
    if (process.env.PAIKALLINEN_MONGODB.length > 1) {
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