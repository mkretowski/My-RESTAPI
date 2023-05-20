const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /concerts', () => {
  it('/ should insert new document to db and return success', async () => {
    const res = await request(server)
      .post('/concerts')
      .send({ performer: 'John Doe', genre: 'Genre', price: 25, day: 1, image: 'image' });
    const newConcert = await Concert.findOne({ performer: 'John Doe' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newConcert).to.not.be.null;
  });
  after(async () => {
    await Concert.deleteMany();
  });
});
