const Workshop = require('../workshop.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Workshop', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/NewWaveDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testWorkshopOne = new Workshop({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      await testWorkshopOne.save();

      const testWorkshopTwo = new Workshop({ name: 'Workshop 2', concertId: '4fd6g4df6g54df66df4g89h' });
      await testWorkshopTwo.save();
    });
    it('should return all the data with "find" method', async () => {
      const workshops = await Workshop.find();
      const expectedLength = 2;
      expect(workshops.length).to.be.equal(expectedLength);
    });
    it('should return a proper document by "name" with "findOne" method', async () => {
      const workshop = await Workshop.findOne({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      const expectedName = 'Workshop 1';
      const expectedConcertId = '4fd6g4df6g54df66df4g6df';
      expect(workshop.name).to.be.equal(expectedName);
      expect(workshop.concertId).to.be.equal(expectedConcertId);
    });
    after(async () => {
      await Workshop.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const workshop = new Workshop({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      await workshop.save();
      expect(workshop.isNew).to.be.false;
    });

    after(async () => {
      await Workshop.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const testWorkshopOne = new Workshop({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      await testWorkshopOne.save();

      const testWorkshopTwo = new Workshop({ name: 'Workshop 2', concertId: '4fd6g4df6g54df66df4g89h' });
      await testWorkshopTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Workshop.updateOne(
        { name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' },
        { $set: { name: 'Workshop 3' } }
      );
      const updatedWorkshop = await Workshop.findOne({ name: 'Workshop 3' });
      expect(updatedWorkshop).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const workshop = await Workshop.findOne({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      workshop.name = 'Workshop 3';
      await workshop.save();

      const updatedWorkshop = await Workshop.findOne({ name: 'Workshop 3' });
      expect(updatedWorkshop).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Workshop.updateMany({}, { $set: { name: 'Updated!', concertId: 'Updated!' } });
      const workshops = await Workshop.find({ name: 'Updated!', concertId: 'Updated!' });
      expect(workshops.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Workshop.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testWorkshopOne = new Workshop({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      await testWorkshopOne.save();

      const testWorkshopTwo = new Workshop({ name: 'Workshop 2', concertId: '4fd6g4df6g54df66df4g89h' });
      await testWorkshopTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Workshop.deleteOne({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      const updatedWorkshop = await Workshop.findOne({ firstName: 'John' });
      expect(updatedWorkshop).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const workshop = await Workshop.findOne({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      await workshop.remove();
      const removedWorkshop = await Workshop.findOne({ name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' });
      expect(removedWorkshop).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Workshop.deleteMany();
      const workshops = await Workshop.find();
      expect(workshops.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Workshop.deleteMany();
    });
  });
});
