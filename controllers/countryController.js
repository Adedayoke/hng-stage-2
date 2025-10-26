const Country = require('../models/Country');
const { fetchCountriesData, fetchExchangeRates } = require('../services/externalApi');
const { generateSummaryImage } = require('../services/imageGenerator');

// POST /countries/refresh
exports.refreshCountries = async (req, res) => {
    try {
        // Fetch data from external APIs
        const [countriesData, exchangeRates] = await Promise.all([
            fetchCountriesData(),
            fetchExchangeRates()
        ]);

        let processedCount = 0;

        // Process each country
        for (const countryData of countriesData) {
            let currencyCode = null;
            let exchangeRate = null;
            let estimatedGDP = 0;

            // Extract currency code
            if (countryData.currencies && countryData.currencies.length > 0) {
                currencyCode = countryData.currencies[0].code;

                // Get exchange rate if currency exists in rates
                if (currencyCode && exchangeRates[currencyCode]) {
                    exchangeRate = exchangeRates[currencyCode];

                    // Calculate estimated GDP
                    const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
                    estimatedGDP = (countryData.population * randomMultiplier) / exchangeRate;
                } else {
                    // Currency code not found in exchange rates
                    exchangeRate = null;
                    estimatedGDP = null;
                }
            }

            // Prepare country object
            const country = {
                name: countryData.name,
                capital: countryData.capital || null,
                region: countryData.region || null,
                population: countryData.population,
                currency_code: currencyCode,
                exchange_rate: exchangeRate,
                estimated_gdp: estimatedGDP,
                flag_url: countryData.flag || null
            };

            // Insert or update
            await Country.upsert(country);
            processedCount++;
        }

        // Update refresh metadata
        await Country.updateRefreshMetadata();

        // Generate summary image
        const totalCountries = await Country.count();
        const topCountries = await Country.getTopByGDP(5);
        const metadata = await Country.getRefreshMetadata();

        await generateSummaryImage({
            totalCountries,
            topCountries,
            lastRefreshed: metadata.last_refreshed_at
        });

        res.json({
            message: 'Countries data refreshed successfully',
            total_processed: processedCount,
            total_countries: totalCountries
        });

    } catch (error) {
        console.error('Refresh error:', error);
        
        // Check if it's an external API error
        if (error.message.includes('Could not fetch data from')) {
            return res.status(503).json({
                error: 'External data source unavailable',
                details: error.message
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// GET /countries
exports.getCountries = async (req, res) => {
    try {
        const { region, currency, sort } = req.query;

        const filters = {};
        if (region) filters.region = region;
        if (currency) filters.currency = currency;
        if (sort) filters.sort = sort;

        const countries = await Country.findAll(filters);

        res.json(countries);
    } catch (error) {
        console.error('Get countries error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// GET /countries/:name
exports.getCountryByName = async (req, res) => {
    try {
        const { name } = req.params;

        const country = await Country.findByName(name);

        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        res.json(country);
    } catch (error) {
        console.error('Get country error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// DELETE /countries/:name
exports.deleteCountry = async (req, res) => {
    try {
        const { name } = req.params;

        // Check if country exists first
        const country = await Country.findByName(name);
        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        await Country.deleteByName(name);

        res.json({
            message: 'Country deleted successfully',
            deleted: name
        });
    } catch (error) {
        console.error('Delete country error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// GET /status
exports.getStatus = async (req, res) => {
    try {
        const metadata = await Country.getRefreshMetadata();

        res.json({
            total_countries: metadata.total_countries,
            last_refreshed_at: metadata.last_refreshed_at
        });
    } catch (error) {
        console.error('Get status error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// GET /countries/image
exports.getSummaryImage = async (req, res) => {
    try {
        const path = require('path');
        const fs = require('fs').promises;

        const imagePath = path.join(__dirname, '..', 'cache', 'summary.png');

        // Check if image exists
        try {
            await fs.access(imagePath);
        } catch {
            return res.status(404).json({
                error: 'Summary image not found'
            });
        }

        res.sendFile(imagePath);
    } catch (error) {
        console.error('Get image error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
