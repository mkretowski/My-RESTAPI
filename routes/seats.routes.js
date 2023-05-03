const uuid = require('uuid');
const express = require('express');
const { db } = require('../db/db');
const router = express.Router();

router.route('/seats').get((req, res) => {
  res.send(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const seat = db.seats.find((item) => item.id === id);
  if (seat) {
    res.send(seat);
  } else {
    res.status(404).send({ message: 'Seat not found' });
  }
});

router.route('/seats/random').get((req, res) => {
  const id = Math.floor(Math.random() * db.seats.length + 1).toString();
  const seat = db.seats.find((item) => item.id === id);
  if (seat) {
    res.send(seat);
  } else {
    res.status(404).send({ message: 'Seat not found' });
  }
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;

  if (day && seat && client && email) {
    const id = uuid.v1();
    const seat_ = { id, day, seat, client, email };
    db.seats.push(seat_);
    res.redirect('/seats');
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
});

router.route('/seats/:id').put((req, res) => {
  const id = req.params.id;
  const { day, seat, client, email } = req.body;

  const seat_ = db.seats.find((item) => item.id === id);
  if (seat_) {
    seat_.day = day;
    seat_.seat = seat;
    seat_.client = client;
    seat_.email = email;
    res.redirect('/seats');
  } else {
    res.status(404).send({ message: 'Seat not found' });
  }
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;

  const index = db.seats.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.seats.splice(index, 1);
    res.redirect('/seats');
  } else {
    res.status(404).send({ message: 'Seat not found' });
  }
});

module.exports = router;
