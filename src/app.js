require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('../config/database');
const countriesRoutes = require('../routes/countries');
const statusRoutes = require('../routes/status');
const { errorHandler, notFound, logger } = require('../middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Country Currency & Exchange API',
        version: '1.0.0',
        endpoints: {
            refresh: 'POST /countries/refresh',
            getCountries: 'GET /countries',
            getCountry: 'GET /countries/:name',
            deleteCountry: 'DELETE /countries/:name',
            status: 'GET /status',
            image: 'GET /countries/image'
        }
    });
});

app.use('/countries', countriesRoutes);
app.use('/status', statusRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 3000;

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
            console.log(`✓ Database initialized`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });

module.exports = app;
