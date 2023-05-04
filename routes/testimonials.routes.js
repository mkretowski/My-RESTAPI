const uuid = require('uuid');
const express = require('express');
const { db } = require('../db/db');
const router = express.Router();

router.route('/testimonials').get((req, res) => {
  res.send(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const id = Math.floor(Math.random() * db.testimonials.length + 1).toString();
  const testimonial = db.testimonials.find((item) => item.id === id);
  if (testimonial) {
    res.send(testimonial);
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

router.route('/testimonials/:id').get((req, res) => {
  const id = req.params.id;
  const testimonial = db.testimonials.find((item) => item.id === id);
  if (testimonial) {
    res.send(testimonial);
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body;

  if (author && text) {
    const id = uuid.v1();
    const testimonial = { id, author, text };
    db.testimonials.push(testimonial);
    res.redirect('/testimonials');
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
});

router.route('/testimonials/:id').put((req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;

  const testimonial = db.testimonials.find((item) => item.id === id);
  if (testimonial) {
    testimonial.author = author;
    testimonial.text = text;
    res.redirect('/testimonials');
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

router.route('/testimonials/:id').delete((req, res) => {
  const id = req.params.id;

  const index = db.testimonials.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.testimonials.splice(index, 1);
    res.redirect('/testimonials');
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

module.exports = router;
