const express = require('express');
const router = express.Router();
const { runSimulation } = require('../controllers/simulationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/run/:module', runSimulation);

module.exports = router;
