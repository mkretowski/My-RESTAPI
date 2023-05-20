const Testimonial = require('../testimonial.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
describe('Testimonial', () => {
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
      const testTestimonialOne = new Testimonial({ author: 'John Doe', text: 'text' });
      await testTestimonialOne.save();

      const testTestimonialTwo = new Testimonial({ author: 'Amanda Doe', text: 'text' });
      await testTestimonialTwo.save();
    });
    it('should return all the data with "find" method', async () => {
      const testimonials = await Testimonial.find();
      const expectedLength = 2;
      expect(testimonials.length).to.be.equal(expectedLength);
    });
    it('should return a proper document by "name" with "findOne" method', async () => {
      const testimonial = await Testimonial.findOne({ author: 'John Doe', text: 'text' });
      const expectedAuthor = 'John Doe';
      const expectedText = 'text';
      expect(testimonial.author).to.be.equal(expectedAuthor);
      expect(testimonial.text).to.be.equal(expectedText);
    });
    after(async () => {
      await Testimonial.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const testimonial = new Testimonial({ author: 'John Doe', text: 'text' });
      await testimonial.save();
      expect(testimonial.isNew).to.be.false;
    });

    after(async () => {
      await Testimonial.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const testTestimonialOne = new Testimonial({ author: 'John Doe', text: 'text' });
      await testTestimonialOne.save();

      const testTestimonialTwo = new Testimonial({ author: 'Amanda Doe', text: 'text' });
      await testTestimonialTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Testimonial.updateOne({ author: 'John Doe', text: 'text' }, { $set: { author: 'Adam Smith' } });
      const updatedTestimonial = await Testimonial.findOne({ author: 'Adam Smith' });
      expect(updatedTestimonial).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const testimonial = await Testimonial.findOne({ author: 'John Doe', text: 'text' });
      testimonial.author = 'Adam Smith';
      await testimonial.save();

      const updatedTestimonial = await Testimonial.findOne({ author: 'Adam Smith' });
      expect(updatedTestimonial).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Testimonial.updateMany({}, { $set: { author: 'Updated!', text: 'Updated!' } });
      const testimonials = await Testimonial.find({ author: 'Updated!', text: 'Updated!' });
      expect(testimonials.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Testimonial.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testTestimonialOne = new Testimonial({ author: 'John Doe', text: 'text' });
      await testTestimonialOne.save();

      const testTestimonialTwo = new Testimonial({ author: 'Amanda Doe', text: 'text' });
      await testTestimonialTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Testimonial.deleteOne({ author: 'John Doe', text: 'text' });
      const updatedTestimonial = await Testimonial.findOne({ firstName: 'John' });
      expect(updatedTestimonial).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const testimonial = await Testimonial.findOne({ author: 'John Doe', text: 'text' });
      await testimonial.remove();
      const removedTestimonial = await Testimonial.findOne({ author: 'John Doe', text: 'text' });
      expect(removedTestimonial).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Testimonial.deleteMany();
      const testimonials = await Testimonial.find();
      expect(testimonials.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Testimonial.deleteMany();
    });
  });
});
