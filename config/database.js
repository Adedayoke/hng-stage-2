const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'countries_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection and create table if it doesn't exist
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        
        // Create countries table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS countries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                capital VARCHAR(255),
                region VARCHAR(100),
                population BIGINT NOT NULL,
                currency_code VARCHAR(10),
                exchange_rate DECIMAL(20, 6),
                estimated_gdp DECIMAL(30, 2),
                flag_url VARCHAR(500),
                last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_region (region),
                INDEX idx_currency (currency_code),
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        
        // Create a table to store last refresh timestamp
        await connection.query(`
            CREATE TABLE IF NOT EXISTS refresh_metadata (
                id INT PRIMARY KEY DEFAULT 1,
                last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                total_countries INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        
        // Insert initial metadata row if not exists
        await connection.query(`
            INSERT IGNORE INTO refresh_metadata (id, total_countries) VALUES (1, 0);
        `);
        
        connection.release();
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Database initialization error:', error.message);
        throw error;
    }
}

module.exports = { pool, initializeDatabase };
