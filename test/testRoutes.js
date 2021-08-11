// Testausta varten tarvittavat
const supertest = require("supertest");
const should = require("should");

// Mistä osoitteesta serveri löytyy
const server = supertest.agent('http://localhost:3000');

describe('Reittien testaus', function () {
  const dateStart = '2021-01-01T00:00:01.000000Z'
  const dateEnd = '2021-10-11T09:00:00.000000Z'

  it('Tilaukset ja rokotteet', function (done) {
    server
      .get(`/vaccines/manyOrderAndVaccines/${dateStart}/${dateEnd}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });

  it('Käytetyt rokotteet', function (done) {
    server
      .get(`/vaccines/howManyVaccinations/${dateStart}/${dateEnd}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });

  it('Tilaukset/rokotteet tuottajittain', function (done) {
    server
      .get(`/vaccines/manyOrderAndVaccinesPerProducer/${dateStart}/${dateEnd}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });

  it('Vanhentuneet pullot', function (done) {
    server
      .get(`/vaccines/howManyBottlesExpired/${dateStart}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });

  it('Vanhenevat rokotteet', function (done) {
    server
      .get(`/vaccines/howManyVaccinesExpired/${dateStart}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });

  it('Rokotteita jäljellä', function (done) {
    server
      .get(`/vaccines/howManyVaccinesAreLeftToUse/${dateEnd}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });

  it('10 päivässä vanhenevat rokotteet', function (done) {
    server
      .get(`/vaccines/howManyVaccinesExpireNext10Days/${dateStart}`)
      .expect("Content-type", /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        res.status.should.equal(200); // Palautuuko vastaus statusCode 200
        done();
      });
  });
});