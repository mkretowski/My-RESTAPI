const Testimonial = require('../testimonial.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Testimonial', () => {
  it('should throw an error if no args', () => {
    const testim = new Testimonial({}); // create new Testimonial, but don't set attr values

    testim.validate((err) => {
      expect(err.errors.author).to.exist;
      expect(err.errors.text).to.exist;
    });
  });
  it('should throw an error if args are not a string', () => {
    const cases = ['', null, undefined, [], {}];
    for (let name of cases) {
      const testim1 = new Testimonial({ author: name, text: 'text' });
      const testim2 = new Testimonial({ author: 'John Doe', text: name });

      testim1.validate((err) => {
        expect(err.errors.author).to.exist;
        expect(err.errors.text).to.not.exist;
      });
      testim2.validate((err) => {
        expect(err.errors.author).to.not.exist;
        expect(err.errors.text).to.exist;
      });
    }
  });
  it('should not throw an error if args are okay', () => {
    const cases = [
      { author: 'John Doe', text: 'text' },
      { author: 'Amanda Doe', text: 'text' },
      { author: 'Adam Doe', text: 'text' },
    ];
    for (let name of cases) {
      const testim = new Testimonial(name);
      testim.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
