const uuid = require('uuid');
const express = require('express');
const { db } = require('../db/db');
const router = express.Router();

router.route('/concerts').get((req, res) => {
  res.send(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const id = req.params.id;
  const concert = db.concerts.find((item) => item.id === id);
  if (concert) {
    res.send(concert);
  } else {
    res.status(404).send({ message: 'Concert not found' });
  }
});

router.route('/concerts/random').get((req, res) => {
  const id = Math.floor(Math.random() * db.concerts.length + 1).toString();
  const concert = db.concerts.find((item) => item.id === id);
  if (concert) {
    res.send(concert);
  } else {
    res.status(404).send({ message: 'Concert not found' });
  }
});

router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (performer && genre && price && day && image) {
    const id = uuid.v1();
    const concert = { id, performer, genre, price, day, image };
    db.concerts.push(concert);
    res.redirect('/concerts');
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
});

router.route('/concerts/:id').put((req, res) => {
  const id = req.params.id;
  const { performer, genre, price, day, image } = req.body;

  const concert = db.concerts.find((item) => item.id === id);
  if (concert) {
    concert.performer = performer;
    concert.genre = genre;
    concert.price = price;
    concert.day = day;
    concert.image = image;
    res.redirect('/concerts');
  } else {
    res.status(404).send({ message: 'Concert not found' });
  }
});

router.route('/concerts/:id').delete((req, res) => {
  const id = req.params.id;

  const index = db.concerts.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.concerts.splice(index, 1);
    res.redirect('/concerts');
  } else {
    res.status(404).send({ message: 'Concert not found' });
  }
});

module.exports = router;
