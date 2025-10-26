# Country Currency & Exchange API

A RESTful API that fetches country data from external APIs, stores it in a MySQL database, and provides CRUD operations with currency exchange rate integration.

## Features

- Fetch country data from RestCountries API
- Integrate exchange rates from Open Exchange Rates API
- Calculate estimated GDP for each country
- MySQL database for data persistence
- CRUD operations with filtering and sorting
- Automatic image generation for data summary
- Comprehensive error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **External APIs**: 
  - RestCountries API
  - Open Exchange Rates API
- **Image Generation**: Jimp

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stage-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MySQL database**
   
   Create a new MySQL database:
   ```sql
   CREATE DATABASE countries_db;
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your MySQL credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=countries_db
   ```

5. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

The database tables will be created automatically on first run.

## API Endpoints

### 1. Refresh Countries Data
**POST** `/countries/refresh`

Fetches fresh data from external APIs and caches in database.

**Response:**
```json
{
  "message": "Countries data refreshed successfully",
  "total_processed": 250,
  "total_countries": 250
}
```

### 2. Get All Countries
**GET** `/countries`

Supports filtering and sorting via query parameters.

**Query Parameters:**
- `region` - Filter by region (e.g., `?region=Africa`)
- `currency` - Filter by currency code (e.g., `?currency=NGN`)
- `sort` - Sort results:
  - `gdp_desc` - Sort by GDP descending
  - `gdp_asc` - Sort by GDP ascending
  - `name_asc` - Sort by name A-Z
  - `name_desc` - Sort by name Z-A

**Example:**
```
GET /countries?region=Africa&sort=gdp_desc
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-26T18:00:00Z"
  }
]
```

### 3. Get Single Country
**GET** `/countries/:name`

Get a specific country by name (case-insensitive).

**Example:**
```
GET /countries/Nigeria
```

**Response:**
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-26T18:00:00Z"
}
```

### 4. Delete Country
**DELETE** `/countries/:name`

Delete a country record by name.

**Response:**
```json
{
  "message": "Country deleted successfully",
  "deleted": "Nigeria"
}
```

### 5. Get Status
**GET** `/status`

Returns total countries count and last refresh timestamp.

**Response:**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T18:00:00Z"
}
```

### 6. Get Summary Image
**GET** `/countries/image`

Returns a generated PNG image with summary statistics.

Returns the image file or:
```json
{
  "error": "Summary image not found"
}
```

## Error Responses

The API returns consistent JSON error responses:

**404 Not Found:**
```json
{
  "error": "Country not found"
}
```

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

**503 Service Unavailable:**
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from RestCountries API"
}
```

## Database Schema

### countries table
```sql
id (INT, PRIMARY KEY, AUTO_INCREMENT)
name (VARCHAR(255), UNIQUE, NOT NULL)
capital (VARCHAR(255), NULLABLE)
region (VARCHAR(100), NULLABLE)
population (BIGINT, NOT NULL)
currency_code (VARCHAR(10), NULLABLE)
exchange_rate (DECIMAL(20,6), NULLABLE)
estimated_gdp (DECIMAL(30,2), NULLABLE)
flag_url (VARCHAR(500), NULLABLE)
last_refreshed_at (TIMESTAMP)
```

### refresh_metadata table
```sql
id (INT, PRIMARY KEY)
last_refreshed_at (TIMESTAMP)
total_countries (INT)
```

## Project Structure

```
stage-2/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── countryController.js # Request handlers
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── Country.js           # Database operations
├── routes/
│   ├── countries.js         # Country routes
│   └── status.js            # Status route
├── services/
│   ├── externalApi.js       # External API calls
│   └── imageGenerator.js    # Image generation logic
├── src/
│   └── app.js              # Application entry point
├── cache/                   # Generated images (auto-created)
├── .env                     # Environment variables (create from .env.example)
├── .env.example            # Environment template
├── package.json
└── README.md
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Deployment

This API can be deployed to various platforms:

### Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add MySQL database service
4. Set environment variables
5. Deploy

### Heroku
1. Create a new Heroku app
2. Add ClearDB MySQL addon
3. Set environment variables
4. Deploy via Git

### AWS
Deploy using AWS Elastic Beanstalk with RDS MySQL instance.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | countries_db |

## Testing

Before deployment, test all endpoints:

1. Start the server locally
2. Call POST `/countries/refresh` to populate data
3. Test GET `/countries` with various filters
4. Test GET `/countries/:name` with a country name
5. Test DELETE `/countries/:name`
6. Test GET `/status`
7. Test GET `/countries/image`

## Notes

- The database tables are created automatically on first run
- Run POST `/countries/refresh` at least once to populate data
- The `estimated_gdp` is recalculated on each refresh with a new random multiplier
- Countries without currencies are stored with `null` values
- The summary image is regenerated on each refresh

## License

ISC

## Author

HNG Stage 2 Backend Task
