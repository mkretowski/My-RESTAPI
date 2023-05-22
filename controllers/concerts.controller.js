const Concert = require('../models/concert.model');
const Seats = require('../models/seat.model');
const Workshops = require('../models/workshop.model'); //import necessary for populate method
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find().populate('workshops');
    const seats = await Seats.find();

    const seatsByDay = seats.reduce((obj, seat) => {
      if (!obj[seat.day]) {
        obj[seat.day] = [];
      }
      obj[seat.day].push(seat);
      return obj;
    }, {});

    const con = concerts.map((concert) => {
      const tickets = seatsByDay[concert.day]?.length || 0;
      return { ...concert.toObject(), tickets }; //toObject converts Mongoose object to plain JS object
    });

    res.json(con);
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

exports.searchByPerformer = async (req, res) => {
  try {
    const con = await Concert.find({ performer: req.params.performer });
    if (!con) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(con);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.searchByGenre = async (req, res) => {
  try {
    const con = await Concert.find({ genre: req.params.genre });
    if (!con) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(con);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.searchByDay = async (req, res) => {
  try {
    const con = await Concert.find({ day: req.params.day });
    if (!con) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(con);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.searchByPrice = async (req, res) => {
  try {
    const priceMin = req.params.price_min;
    const priceMax = req.params.price_max;
    const con = await Concert.find({ price: { $gte: priceMin, $lte: priceMax } });
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
    const performer = sanitize(req.body.performer);
    const genre = sanitize(req.body.genre);
    const price = sanitize(req.body.price);
    const day = sanitize(req.body.day);
    const image = sanitize(req.body.image);
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
