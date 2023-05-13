const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
