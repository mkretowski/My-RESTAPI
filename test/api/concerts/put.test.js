const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('PUT /concerts', () => {
  before(async () => {
    const testDepOne = new Concert({
      _id: '5d9f1140f10a81216cfd4408',
      performer: 'John Doe',
      genre: 'Genre',
      price: 25,
      day: 1,
      image: 'image',
    });
    await testDepOne.save();
  });
  it('/:id should update chosen document and return success', async () => {
    const res = await request(server).put('/concerts/5d9f1140f10a81216cfd4408').send({ performer: 'Fred Doe' });
    const updatedConcert = await Concert.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(updatedConcert.performer).to.be.equal('Fred Doe');
  });
  after(async () => {
    await Concert.deleteMany();
  });
});
