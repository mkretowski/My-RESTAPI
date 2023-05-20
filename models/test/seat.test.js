const Seat = require('../seat.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Seat', () => {
  it('should throw an error if no args', () => {
    const seat = new Seat({}); // create new Seat, but don't set attr values

    seat.validate((err) => {
      expect(err.errors.day).to.exist;
      expect(err.errors.seat).to.exist;
      expect(err.errors.client).to.exist;
      expect(err.errors.email).to.exist;
    });
  });
  it('should throw an error if args are not a string', () => {
    const cases = ['', null, undefined, [], {}];
    for (let name of cases) {
      const seat1 = new Seat({ day: name, seat: 1, client: 'John Doe', email: 'johndoe@example.com' });
      const seat2 = new Seat({ day: 1, seat: name, client: 'John Doe', email: 'johndoe@example.com' });
      const seat3 = new Seat({ day: 1, seat: 1, client: name, email: 'johndoe@example.com' });
      const seat4 = new Seat({ day: 1, seat: 1, client: 'John Doe', email: name });
      seat1.validate((err) => {
        expect(err.errors.day).to.exist;
        expect(err.errors.seat).to.not.exist;
        expect(err.errors.client).to.not.exist;
        expect(err.errors.email).to.not.exist;
      });
      seat2.validate((err) => {
        expect(err.errors.day).to.not.exist;
        expect(err.errors.seat).to.exist;
        expect(err.errors.client).to.not.exist;
        expect(err.errors.email).to.not.exist;
      });
      seat3.validate((err) => {
        expect(err.errors.day).to.not.exist;
        expect(err.errors.seat).to.not.exist;
        expect(err.errors.client).to.exist;
        expect(err.errors.email).to.not.exist;
      });
      seat4.validate((err) => {
        expect(err.errors.day).to.not.exist;
        expect(err.errors.seat).to.not.exist;
        expect(err.errors.client).to.not.exist;
        expect(err.errors.email).to.exist;
      });
    }
  });
  it('should not throw an error if args are okay', () => {
    const cases = [
      { day: 1, seat: 1, client: 'John Doe', email: 'johndoe@example.com' },
      { day: 2, seat: 2, client: 'Amanda Doe', email: 'amandadoe@example.com' },
      { day: 3, seat: 3, client: 'Adam Doe', email: 'adamoe@example.com' },
    ];
    for (let name of cases) {
      const seat = new Seat(name);
      seat.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
