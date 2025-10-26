const axios = require('axios');

const COUNTRIES_API_URL = 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

async function fetchCountriesData() {
    try {
        const response = await axios.get(COUNTRIES_API_URL, { timeout: 30000 });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Countries API request timed out');
        }
        throw new Error(`Could not fetch data from RestCountries API: ${error.message}`);
    }
}

async function fetchExchangeRates() {
    try {
        const response = await axios.get(EXCHANGE_RATE_API_URL, { timeout: 30000 });
        return response.data.rates;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Exchange Rate API request timed out');
        }
        throw new Error(`Could not fetch data from Exchange Rate API: ${error.message}`);
    }
}

module.exports = {
    fetchCountriesData,
    fetchExchangeRates
};
