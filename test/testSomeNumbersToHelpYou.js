// Supertestaukseen
const supertest = require("supertest");
var should = require("should");

// Mistä osoitteesta serveri löytyy
const server = supertest.agent('http://localhost:3000');

describe('Jotkut numerot auttavat sinua', function () {
  it('Tilausten kokonaismäärä', function (done) {
    server
      .get("/vaccines/manyOrderAndVaccines/2021-01-01T00:00:01.000000Z/2021-10-11T09:00:00.000000Z")
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        res.text.should.equal('{"rokotetta":25015,"tilausta":5000}');
        done();
      });
  });

  it('Tehdyt rokotukset', function (done) {
    server
      .get("/vaccines/howManyVaccinations/2021-01-01T00:00:01.000000Z/2021-10-11T09:00:00.000000Z")
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        res.text.should.equal('{"kaytetytRokotteet":7000}');
        done();
      });
  });

  it('20.3.2021 saapui 61 tilausta', function (done) {
    server
      .get("/vaccines/manyOrderAndVaccines/2021-03-20T00:00:00.000000Z/2021-03-20T23:59:59.000000Z")
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        res.text.should.equal('{"rokotetta":300,"tilausta":61}');
        done();
      });
  });

  
  //Tässä reitissä kestää liian kauan ja testi päätyy timeout virheeseen.
  it('"2021-04-12T11:10:06.473587Z" aikaan mennessä 12590 rokotetta on vanhentunut', function (done) {
    server
    .get("/vaccines/howManyVaccinesExpired/2021-04-12T11:10:06.473587Z")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200); // Palautuuko vastaus statusCode 200
      res.text.should.equal('[{"_id":{"rokote":"Antiqua"},"pullojaYhteensa":1150,"rokotteitaYhteensa":4600,"rokotteetKaytetyt":1283,"rokotteetVanhentuneet":3317},{"_id":{"rokote":"SolarBuddhica"},"pullojaYhteensa":1163,"rokotteitaYhteensa":6978,"rokotteetKaytetyt":1937,"rokotteetVanhentuneet":5041},{"_id":{"rokote":"Zerpfy"},"pullojaYhteensa":1169,"rokotteitaYhteensa":5845,"rokotteetKaytetyt":1613,"rokotteetVanhentuneet":4232}]');
      done();
    });
  });
});