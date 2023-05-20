const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  performer: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  day: { type: Number, required: true },
  image: { type: String, required: true },
});

// define virtual field "workshops" for "Concert"
concertSchema.virtual('workshops', {
  ref: 'Workshop', // reference model
  localField: '_id', // reference field in model Concert
  foreignField: 'concertId', // reference field in model Workshop
});

concertSchema.set('toObject', { virtuals: true }); //include virtual in toObject() output
concertSchema.set('toJSON', { virtuals: true }); //include virtual in toJSON() output

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;
