const express = require('express');
const cors = require('cors');
const app = express();

// import routes
const seatsRoutes = require('./routes/seats.routes');
const concertsRoutes = require('./routes/concerts.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');

app.use(cors());
app.use(express.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(express.json()); //form-data
app.use('/', seatsRoutes); // add seats routes to server
app.use('/', concertsRoutes); // add concerts routes to server
app.use('/', testimonialsRoutes); // add testimonials routes to server

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
