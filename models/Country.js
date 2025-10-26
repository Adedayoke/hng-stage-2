const { pool } = require('../config/database');

class Country {
    static async upsert(countryData) {
        const {
            name,
            capital,
            region,
            population,
            currency_code,
            exchange_rate,
            estimated_gdp,
            flag_url
        } = countryData;

        const query = `
            INSERT INTO countries (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                capital = VALUES(capital),
                region = VALUES(region),
                population = VALUES(population),
                currency_code = VALUES(currency_code),
                exchange_rate = VALUES(exchange_rate),
                estimated_gdp = VALUES(estimated_gdp),
                flag_url = VALUES(flag_url),
                last_refreshed_at = NOW()
        `;

        const [result] = await pool.execute(query, [
            name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url
        ]);

        return result;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM countries WHERE 1=1';
        const params = [];

        if (filters.region) {
            query += ' AND region = ?';
            params.push(filters.region);
        }

        if (filters.currency) {
            query += ' AND currency_code = ?';
            params.push(filters.currency);
        }

        // Sorting
        if (filters.sort) {
            if (filters.sort === 'gdp_desc') {
                query += ' ORDER BY estimated_gdp DESC';
            } else if (filters.sort === 'gdp_asc') {
                query += ' ORDER BY estimated_gdp ASC';
            } else if (filters.sort === 'name_asc') {
                query += ' ORDER BY name ASC';
            } else if (filters.sort === 'name_desc') {
                query += ' ORDER BY name DESC';
            }
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByName(name) {
        const query = 'SELECT * FROM countries WHERE LOWER(name) = LOWER(?) LIMIT 1';
        const [rows] = await pool.execute(query, [name]);
        return rows[0];
    }

    static async deleteByName(name) {
        const query = 'DELETE FROM countries WHERE LOWER(name) = LOWER(?)';
        const [result] = await pool.execute(query, [name]);
        return result;
    }

    static async count() {
        const query = 'SELECT COUNT(*) as total FROM countries';
        const [rows] = await pool.execute(query);
        return rows[0].total;
    }

    static async getTopByGDP(limit = 5) {
        const query = `SELECT * FROM countries WHERE estimated_gdp IS NOT NULL ORDER BY estimated_gdp DESC LIMIT ${parseInt(limit)}`;
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async updateRefreshMetadata() {
        const total = await this.count();
        await pool.execute(
            'UPDATE refresh_metadata SET last_refreshed_at = NOW(), total_countries = ? WHERE id = 1',
            [total]
        );
    }

    static async getRefreshMetadata() {
        const [rows] = await pool.execute('SELECT * FROM refresh_metadata WHERE id = 1');
        return rows[0];
    }
}

module.exports = Country;
