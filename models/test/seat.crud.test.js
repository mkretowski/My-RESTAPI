const Seat = require('../seat.model');
//const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Seat', () => {
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
      const testSeatOne = new Seat({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      await testSeatOne.save();

      const testSeatTwo = new Seat({ day: 1, seat: 2, client: 'Amanda Doe', email: 'amandadoe@example.com' });
      await testSeatTwo.save();
    });
    it('should return all the data with "find" method', async () => {
      const seats = await Seat.find();
      const expectedLength = 2;
      expect(seats.length).to.be.equal(expectedLength);
    });
    it('should return a proper document by "name" with "findOne" method', async () => {
      const seat = await Seat.findOne({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      const expectedDay = 1;
      const expectedSeat = 1;
      const expectedClient = 'John Doe';
      const expectedEmail = 'johndoe@example.com';
      expect(seat.day).to.be.equal(expectedDay);
      expect(seat.seat).to.be.equal(expectedSeat);
      expect(seat.client).to.be.equal(expectedClient);
      expect(seat.email).to.be.equal(expectedEmail);
    });
    after(async () => {
      await Seat.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const seat = new Seat({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      await seat.save();
      expect(seat.isNew).to.be.false;
    });

    after(async () => {
      await Seat.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const testSeatOne = new Seat({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      await testSeatOne.save();

      const testSeatTwo = new Seat({ day: 1, seat: 2, client: 'Amanda Doe', email: 'amandadoe@example.com' });
      await testSeatTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Seat.updateOne(
        { day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' },
        { $set: { client: 'Adam Smith' } }
      );
      const updatedSeat = await Seat.findOne({ client: 'Adam Smith' });
      expect(updatedSeat).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const seat = await Seat.findOne({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      seat.client = 'Adam Smith';
      await seat.save();

      const updatedSeat = await Seat.findOne({ client: 'Adam Smith' });
      expect(updatedSeat).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Seat.updateMany({}, { $set: { client: 'Updated!', email: 'Updated!' } });
      const seats = await Seat.find({ client: 'Updated!', email: 'Updated!' });
      expect(seats.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Seat.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testSeatOne = new Seat({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      await testSeatOne.save();

      const testSeatTwo = new Seat({ day: 1, seat: 2, client: 'Amanda Doe', email: 'amandadoe@example.com' });
      await testSeatTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Seat.deleteOne({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      const updatedSeat = await Seat.findOne({ firstName: 'John' });
      expect(updatedSeat).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const seat = await Seat.findOne({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      await seat.remove();
      const removedSeat = await Seat.findOne({ day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      expect(removedSeat).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Seat.deleteMany();
      const seats = await Seat.find();
      expect(seats.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Seat.deleteMany();
    });
  });
});
