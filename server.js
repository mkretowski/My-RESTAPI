const uuid = require('uuid');
const express = require('express');
const path = require('path');

const db = [
  { id: '1', author: 'John Doe', text: 'This company is worth every coin!' },
  { id: '2', author: 'Amanda Doe', text: 'They really know how to make you happy.' },
];

const app = express();

app.use(express.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(express.json()); //form-data

app.get('/testimonials', (req, res) => {
  res.send(db);
});

app.get('/testimonials/:id', (req, res) => {
  const id = req.params.id === 'random' ? Math.floor(Math.random() * db.length + 1).toString() : req.params.id;
  const testimonial = db[id - 1];
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
    db.push(testimonial);
    res.redirect('/testimonials');
  } else {
    res.status(400).send({ message: 'Invalid data.' });
  }
});

app.put('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;

  const testimonial = db.find((item) => item.id === id);
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

  const index = db.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.splice(index, 1);
    res.redirect('/testimonials');
  } else {
    res.status(404).send({ message: 'Testimonial not found' });
  }
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
