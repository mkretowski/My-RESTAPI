const Concert = require('../models/concert.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Concert.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const con = await Concert.findOne().skip(rand);
    if (!con) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(con);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (!con) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(con);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    const newConcert = await Concert.create({ performer, genre, price, day, image });
    res.json({ message: 'OK', newConcert: newConcert });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.update = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  try {
    const con = await Concert.findByIdAndUpdate(
      req.params.id,
      { $set: { performer: performer, genre: genre, price: price, day: day, image: image } },
      { new: true }
    );
    if (con) {
      res.json({ message: 'OK', updatedConcert: con });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const con = await Concert.findByIdAndDelete(req.params.id);
    if (con) {
      res.json({ message: 'OK', deletedConcert: con });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
