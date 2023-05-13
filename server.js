const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const socket = require('socket.io');

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id - ' + socket.id);
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  });
  console.log("I've added a listener on message and disconnect events \n");
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// import routes
const seatsRoutes = require('./routes/seats.routes');
const concertsRoutes = require('./routes/concerts.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');

app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build'))); // Serve static files from the React app
app.use(express.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(express.json()); //form-data
app.use('/', seatsRoutes); // add seats routes to server
app.use('/', concertsRoutes); // add concerts routes to server
app.use('/', testimonialsRoutes); // add testimonials routes to server

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

// connects our backend code with the database
mongoose.connect('mongodb://localhost:27017/NewWaveDB', { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', (err) => console.log('Error ' + err));
