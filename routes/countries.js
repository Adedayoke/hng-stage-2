const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// POST /countries/refresh
router.post('/refresh', countryController.refreshCountries);

// GET /countries/image - Must come before /:name to avoid conflicts
router.get('/image', countryController.getSummaryImage);

// GET /countries
router.get('/', countryController.getCountries);

// GET /countries/:name
router.get('/:name', countryController.getCountryByName);

// DELETE /countries/:name
router.delete('/:name', countryController.deleteCountry);

module.exports = router;
