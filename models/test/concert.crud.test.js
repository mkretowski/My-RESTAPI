const Concert = require('../concert.model');
const Workshop = require('../workshop.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
describe('Concert', () => {
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
      const testConcertOne = new Concert({ performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' });
      await testConcertOne.save();

      const testConcertTwo = new Concert({ performer: 'Amanda Doe', genre: 'Pop', price: 20, day: 2, image: 'image' });
      await testConcertTwo.save();
    });
    it('should return all the data with "find" method', async () => {
      const concerts = await Concert.find();
      const expectedLength = 2;
      expect(concerts.length).to.be.equal(expectedLength);
    });
    it('should return a proper document by "name" with "findOne" method', async () => {
      const concert = await Concert.findOne({
        performer: 'John Doe',
        genre: 'Rock',
        price: 20,
        day: 1,
        image: 'image',
      });
      const expectedPerformer = 'John Doe';
      const expectedGenre = 'Rock';
      const expectedPrice = 20;
      const expectedDay = 1;
      const expectedImage = 'image';
      expect(concert.performer).to.be.equal(expectedPerformer);
      expect(concert.genre).to.be.equal(expectedGenre);
      expect(concert.price).to.be.equal(expectedPrice);
      expect(concert.day).to.be.equal(expectedDay);
      expect(concert.image).to.be.equal(expectedImage);
    });
    after(async () => {
      await Concert.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const concert = new Concert({ performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' });
      await concert.save();
      expect(concert.isNew).to.be.false;
    });

    after(async () => {
      await Concert.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const testConcertOne = new Concert({ performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' });
      await testConcertOne.save();

      const testConcertTwo = new Concert({ performer: 'Amanda Doe', genre: 'Pop', price: 20, day: 2, image: 'image' });
      await testConcertTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Concert.updateOne(
        { performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' },
        { $set: { performer: 'Adam Smith' } }
      );
      const updatedConcert = await Concert.findOne({ performer: 'Adam Smith' });
      expect(updatedConcert).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const concert = await Concert.findOne({
        performer: 'John Doe',
        genre: 'Rock',
        price: 20,
        day: 1,
        image: 'image',
      });
      concert.performer = 'Adam Smith';
      await concert.save();

      const updatedConcert = await Concert.findOne({ performer: 'Adam Smith' });
      expect(updatedConcert).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Concert.updateMany({}, { $set: { performer: 'Updated!', genre: 'Updated!' } });
      const concerts = await Concert.find({ performer: 'Updated!', genre: 'Updated!' });
      expect(concerts.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Concert.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testConcertOne = new Concert({ performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' });
      await testConcertOne.save();

      const testConcertTwo = new Concert({ performer: 'Amanda Doe', genre: 'Pop', price: 20, day: 2, image: 'image' });
      await testConcertTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Concert.deleteOne({ performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' });
      const updatedConcert = await Concert.findOne({ firstName: 'John' });
      expect(updatedConcert).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const concert = await Concert.findOne({
        performer: 'John Doe',
        genre: 'Rock',
        price: 20,
        day: 1,
        image: 'image',
      });
      await concert.remove();
      const removedConcert = await Concert.findOne({
        performer: 'John Doe',
        genre: 'Rock',
        price: 20,
        day: 1,
        image: 'image',
      });
      expect(removedConcert).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Concert.deleteMany();
      const concerts = await Concert.find();
      expect(concerts.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Concert.deleteMany();
    });
  });
  describe('Workshops Population', () => {
    before(async () => {
      const workshops = new Workshop({ name: 'Workshop', concertId: '645e9b31f289c13a8a445575' });
      await workshops.save();
      const testConcertOne = new Concert({
        _id: ObjectId('645e9b31f289c13a8a445575'),
        performer: 'John Doe',
        genre: 'Rock',
        price: 20,
        day: 1,
        image: 'image',
      });
      await testConcertOne.save();
    });
    it('should populate workshops field with workshops array', async () => {
      const concert = await Concert.find().populate('workshops');
      expect(concert[0].workshops).to.be.an('array');
    });

    after(async () => {
      await Concert.deleteMany();
      await Workshop.deleteMany();
    });
  });
});
