const Concert = require('../concert.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Concert', () => {
  it('should throw an error if no args', () => {
    const con = new Concert({}); // create new Concert, but don't set attr values

    con.validate((err) => {
      expect(err.errors.performer).to.exist;
      expect(err.errors.genre).to.exist;
      expect(err.errors.price).to.exist;
      expect(err.errors.day).to.exist;
      expect(err.errors.image).to.exist;
    });
  });
  it('should throw an error if args are not a string', () => {
    const cases = ['', null, undefined, [], {}];
    for (let name of cases) {
      const con1 = new Concert({ performer: name, genre: 'Rock', price: 20, day: 1, image: 'image' });
      const con2 = new Concert({ performer: 'John Doe', genre: name, price: 20, day: 1, image: 'image' });
      const con3 = new Concert({ performer: 'John Doe', genre: 'Rock', price: name, day: 1, image: 'image' });
      const con4 = new Concert({ performer: 'John Doe', genre: 'Rock', price: 20, day: name, image: 'image' });
      const con5 = new Concert({ performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: name });
      con1.validate((err) => {
        expect(err.errors.performer).to.exist;
        expect(err.errors.genre).to.not.exist;
        expect(err.errors.price).to.not.exist;
        expect(err.errors.day).to.not.exist;
        expect(err.errors.image).to.not.exist;
      });
      con2.validate((err) => {
        expect(err.errors.performer).to.not.exist;
        expect(err.errors.genre).to.exist;
        expect(err.errors.price).to.not.exist;
        expect(err.errors.day).to.not.exist;
        expect(err.errors.image).to.not.exist;
      });
      con3.validate((err) => {
        expect(err.errors.performer).to.not.exist;
        expect(err.errors.genre).to.not.exist;
        expect(err.errors.price).to.exist;
        expect(err.errors.day).to.not.exist;
        expect(err.errors.image).to.not.exist;
      });
      con4.validate((err) => {
        expect(err.errors.performer).to.not.exist;
        expect(err.errors.genre).to.not.exist;
        expect(err.errors.price).to.not.exist;
        expect(err.errors.day).to.exist;
        expect(err.errors.image).to.not.exist;
      });
      con5.validate((err) => {
        expect(err.errors.performer).to.not.exist;
        expect(err.errors.genre).to.not.exist;
        expect(err.errors.price).to.not.exist;
        expect(err.errors.day).to.not.exist;
        expect(err.errors.image).to.exist;
      });
    }
  });
  it('should not throw an error if args are okay', () => {
    const cases = [
      { performer: 'John Doe', genre: 'Rock', price: 20, day: 1, image: 'image' },
      { performer: 'Amanda Doe', genre: 'Pop', price: 20, day: 2, image: 'image' },
      { performer: 'Adam Doe', genre: 'Rap', price: 20, day: 3, image: 'image' },
    ];
    for (let name of cases) {
      const con = new Concert(name);
      con.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
