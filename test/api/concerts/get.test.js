const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /concerts', () => {
  before(async () => {
    const testConOne = new Concert({
      _id: '5d9f1140f10a81216cfd4408',
      performer: 'John Doe',
      genre: 'Genre',
      price: 25,
      day: 1,
      image: 'image',
    });
    await testConOne.save();

    const testConTwo = new Concert({
      _id: '5d9f1159f81ce8d1ef2bee48',
      performer: 'John Doe',
      genre: 'Genre',
      price: 18,
      day: 1,
      image: 'image',
    });
    await testConTwo.save();
  });
  it('/ should return all concerts with property "tickets"', async () => {
    const res = await request(server).get('/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
    res.body.map((concert) => {
      expect(concert).to.have.property('tickets');
    });
  });

  it('/:id should return one concert by :id ', async () => {
    const res = await request(server).get('/concerts/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });

  it('/random should return one random concert', async () => {
    const res = await request(server).get('/concerts/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });

  it('/:id should return concerts by :performer ', async () => {
    const res = await request(server).get('/concerts/performer/John%20Doe');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.not.be.null;
  });

  it('/:id should return concerts by :genre ', async () => {
    const res = await request(server).get('/concerts/genre/Genre');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.not.be.null;
  });

  it('/:id should return concerts by :day ', async () => {
    const res = await request(server).get('/concerts/day/1');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.not.be.null;
  });

  it('/:id should return concerts by :price ', async () => {
    const res = await request(server).get('/concerts/price/15/30');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.not.be.null;
  });

  after(async () => {
    await Concert.deleteMany();
  });
});
