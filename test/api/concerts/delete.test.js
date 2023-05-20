const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model.js');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /concerts', () => {
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
  });
  it('/:id should delete chosen document and return success', async () => {
    const res = await request(server).delete('/concerts/5d9f1140f10a81216cfd4408');
    const deletedConcert = await Concert.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(deletedConcert).to.be.null;
  });
  after(async () => {
    await Concert.deleteMany();
  });
});
