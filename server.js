const uuid = require('uuid');
const express = require('express');
const path = require('path');
const { db } = require('./db/db');
const app = express();

app.use(express.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(express.json()); //form-data

app.get('/testimonials', (req, res) => {
  res.send(db.testimonials);
});

app.get('/testimonials/:id', (req, res) => {
  const id =
    req.params.id === 'random' ? Math.floor(Math.random() * db.testimonials.length + 1).toString() : req.params.id;
  const testimonial = db.testimonials[id - 1];
  if (testimonial) {
    res.send(testimonial);
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

app.post('/testimonials', (req, res) => {
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

app.put('/testimonials/:id', (req, res) => {
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

app.delete('/testimonials/:id', (req, res) => {
  const id = req.params.id;

  const index = db.testimonials.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.testimonials.splice(index, 1);
    res.redirect('/testimonials');
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

app.get('/concerts', (req, res) => {
  res.send(db.concerts);
});

app.get('/concerts/:id', (req, res) => {
  const id = req.params.id === 'random' ? Math.floor(Math.random() * db.concerts.length + 1).toString() : req.params.id;
  const concert = db.concerts[id - 1];
  if (concert) {
    res.send(concert);
  } else {
    res.status(404).send({ message: 'Concert not found' });
  }
});

app.post('/concerts', (req, res) => {
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

app.put('/concerts/:id', (req, res) => {
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

app.delete('/concerts/:id', (req, res) => {
  const id = req.params.id;

  const index = db.concerts.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.concerts.splice(index, 1);
    res.redirect('/concerts');
  } else {
    res.status(404).send({ message: 'Concert not found' });
  }
});

app.get('/seats', (req, res) => {
  res.send(db.seats);
});

app.get('/seats/:id', (req, res) => {
  const id = req.params.id === 'random' ? Math.floor(Math.random() * db.seats.length + 1).toString() : req.params.id;
  const seat = db.seats[id - 1];
  if (seat) {
    res.send(seat);
  } else {
    res.status(404).send({ message: 'Seat not found' });
  }
});

app.post('/seats', (req, res) => {
  const { day, seat, client, email } = req.body;

  if (author && text) {
    const id = uuid.v1();
    const seat_ = { id, day, seat, client, email };
    db.seats.push(seat_);
    res.redirect('/seats');
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
});

app.put('/seats/:id', (req, res) => {
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

app.delete('/seats/:id', (req, res) => {
  const id = req.params.id;

  const index = db.seats.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.seats.splice(index, 1);
    res.redirect('/seats');
  } else {
    res.status(404).send({ message: 'Seat not found' });
  }
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
