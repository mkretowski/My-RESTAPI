const Workshop = require('../workshop.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Workshop', () => {
  it('should throw an error if no args', () => {
    const workshop = new Workshop({}); // create new Workshop, but don't set attr values

    workshop.validate((err) => {
      expect(err.errors.name).to.exist;
      expect(err.errors.concertId).to.exist;
    });
  });
  it('should throw an error if args are not a string', () => {
    const cases = ['', null, undefined, [], {}];
    for (let name of cases) {
      const workshop1 = new Workshop({ name: name, concertId: '4fd6g4df6g54df66df4g6df' });
      const workshop2 = new Workshop({ name: 'Workshop', concertId: name });

      workshop1.validate((err) => {
        expect(err.errors.name).to.exist;
        expect(err.errors.concertId).to.not.exist;
      });
      workshop2.validate((err) => {
        expect(err.errors.name).to.not.exist;
        expect(err.errors.concertId).to.exist;
      });
    }
  });
  it('should not throw an error if args are okay', () => {
    const cases = [
      { name: 'Workshop 1', concertId: '4fd6g4df6g54df66df4g6df' },
      { name: 'Workshop 2', concertId: '4fd6g4df6g54df66df4g89h' },
      { name: 'Workshop 3', concertId: '4fd6g4df6g54df66df4g675' },
    ];
    for (let name of cases) {
      const workshop = new Workshop(name);
      workshop.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
