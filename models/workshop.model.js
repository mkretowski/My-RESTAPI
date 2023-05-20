const mongoose = require('mongoose');

const workshopSchema = mongoose.Schema({
  name: { type: String, required: true },
  concertId: { type: String, required: true },
});

module.exports = mongoose.model('Workshop', workshopSchema);
