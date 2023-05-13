const Seat = require('../models/seat.model');
exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const s = await Seat.findOne().skip(rand);
    if (!s) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(s);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const s = await Seat.findById(req.params.id);
    if (!s) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(s);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  const { day, seat, client, email } = req.body;

  const checkAvailability = async (day, seat) => {
    try {
      const s = await Seat.findOne({ day: day, seat: seat });
      return s;
    } catch (err) {
      throw new Error(err);
    }
  };

  const seatAvailable = await checkAvailability(day, seat);

  if (day && seat && client && email) {
    if (!seatAvailable) {
      try {
        const newSeat = await Seat.create({ day, seat, client, email });
        const seats = await Seat.find();
        req.io.emit('seatsUpdated', seats);
        res.json({ message: 'OK', newSeat: newSeat });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    } else {
      res.status(400).send({ message: 'The slot is already taken...' });
    }
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
};

exports.update = async (req, res) => {
  const { day, seat, client, email } = req.body;

  const checkAvailability = async (day, seat) => {
    try {
      const s = await Seat.findOne({ _id: { $ne: req.params.id }, day, seat });
      return s;
    } catch (err) {
      throw new Error(err);
    }
  };

  const seatAvailable = await checkAvailability(day, seat);

  if (!seatAvailable) {
    try {
      const updatedFields = {
        ...(day && { day }),
        ...(seat && { seat }),
        ...(client && { client }),
        ...(email && { email }),
      };
      const s = await Seat.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
      if (s) {
        res.json({ message: 'OK', updatedSeat: s });
      } else {
        res.status(404).json({ message: 'Not found...' });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  } else {
    res.status(400).send({ message: 'The slot is already taken...' });
  }
};

exports.delete = async (req, res) => {
  try {
    const s = await Seat.findByIdAndDelete(req.params.id);
    if (s) {
      res.json({ message: 'OK', deletedSeat: s });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
