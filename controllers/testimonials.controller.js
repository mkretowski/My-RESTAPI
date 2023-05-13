const Testimonial = require('../models/testimonial.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Testimonial.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const tes = await Testimonial.findOne().skip(rand);
    if (!tes) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(tes);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const tes = await Testimonial.findById(req.params.id);
    if (!tes) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(tes);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  const { author, text } = req.body;

  if (author && text) {
    try {
      const newTestimonial = await Testimonial.create({ author, text });
      res.json({ message: 'OK', newTestimonial: newTestimonial });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
};

exports.update = async (req, res) => {
  const { author, text } = req.body;

  try {
    const tes = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: { author: author, text: text } },
      { new: true }
    );
    if (tes) {
      res.json({ message: 'OK', updatedTestimonial: tes });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const tes = await Testimonial.findByIdAndDelete(req.params.id);
    if (tes) {
      res.json({ message: 'OK', deletedTestimonial: tes });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
