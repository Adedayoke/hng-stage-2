const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// GET /status
router.get('/', countryController.getStatus);

module.exports = router;
