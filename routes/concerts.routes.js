const express = require('express');
const router = express.Router();
const ConcertController = require('../controllers/concerts.controller');

router.get('/concerts', ConcertController.getAll);
router.get('/concerts/random', ConcertController.getRandom);
router.get('/concerts/:id', ConcertController.getOne);
router.get('/concerts/performer/:performer', ConcertController.searchByPerformer);
router.get('/concerts/genre/:genre', ConcertController.searchByGenre);
router.get('/concerts/day/:day', ConcertController.searchByDay);
router.get('/concerts/price/:price_min/:price_max', ConcertController.searchByPrice);
router.post('/concerts', ConcertController.postNew);
router.put('/concerts/:id', ConcertController.update);
router.delete('/concerts/:id', ConcertController.delete);

module.exports = router;
