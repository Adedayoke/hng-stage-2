# Quick Setup & Deployment Guide

## ✅ What's Been Built

Complete RESTful API with all required features:
- ✓ POST /countries/refresh - Fetch and cache country data
- ✓ GET /countries - List with filters (region, currency) and sorting
- ✓ GET /countries/:name - Get single country
- ✓ DELETE /countries/:name - Delete country
- ✓ GET /status - Show total and last refresh
- ✓ GET /countries/image - Serve generated summary image
- ✓ MySQL database with auto-setup
- ✓ Image generation with Jimp
- ✓ Error handling (400, 404, 500, 503)
- ✓ Comprehensive README

## 🚀 Quick Local Setup

### 1. Set up MySQL Database

**Install MySQL** (if not installed):
- Download from: https://dev.mysql.com/downloads/mysql/
- Or use XAMPP/WAMP/MAMP

**Create Database:**
```sql
CREATE DATABASE countries_db;
```

### 2. Configure Environment

Edit `.env` file with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=countries_db
```

### 3. Start the Server

```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

### 4. Test the API

1. **Populate data first:**
   ```bash
   curl -X POST http://localhost:3000/countries/refresh
   ```

2. **Get all countries:**
   ```bash
   curl http://localhost:3000/countries
   ```

3. **Filter by region:**
   ```bash
   curl http://localhost:3000/countries?region=Africa
   ```

4. **Check status:**
   ```bash
   curl http://localhost:3000/status
   ```

## 🌐 Deployment Options

### Option 1: Railway (Recommended)

1. **Sign up:** https://railway.app/
2. **Create New Project** → Deploy from GitHub
3. **Add MySQL Database:**
   - Click "New" → Database → MySQL
   - Railway will auto-configure connection
4. **Set Environment Variables:**
   ```
   PORT=3000
   DB_HOST=<railway-mysql-host>
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=<railway-mysql-database>
   ```
5. **Deploy** - Railway auto-deploys from GitHub

**Get connection details:**
- Click on MySQL service → Variables tab
- Copy the connection details to your environment variables

### Option 2: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add MySQL Database (ClearDB):**
   ```bash
   heroku addons:create cleardb:ignite
   ```

4. **Get Database URL:**
   ```bash
   heroku config:get CLEARDB_DATABASE_URL
   ```

5. **Parse and Set Variables:**
   ```bash
   # From: mysql://user:pass@host/dbname
   heroku config:set DB_HOST=<host>
   heroku config:set DB_USER=<user>
   heroku config:set DB_PASSWORD=<password>
   heroku config:set DB_NAME=<dbname>
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 3: AWS Elastic Beanstalk

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize:**
   ```bash
   eb init
   ```

3. **Create RDS MySQL:**
   - Go to AWS RDS Console
   - Create MySQL database
   - Note connection details

4. **Set Environment Variables:**
   ```bash
   eb setenv DB_HOST=<rds-endpoint> DB_USER=admin DB_PASSWORD=<password> DB_NAME=countries_db
   ```

5. **Deploy:**
   ```bash
   eb create
   eb deploy
   ```

### Option 4: DigitalOcean App Platform

1. **Sign up:** https://www.digitalocean.com/
2. **Create App** → Connect GitHub repo
3. **Add Database:**
   - Create → Database → MySQL
   - Get connection details
4. **Set Environment Variables** in App Settings
5. **Deploy**

## 📝 Testing Your Deployed API

Replace `YOUR_DEPLOYED_URL` with your actual URL:

```bash
# Refresh data
curl -X POST https://YOUR_DEPLOYED_URL/countries/refresh

# Get countries
curl https://YOUR_DEPLOYED_URL/countries?region=Africa&sort=gdp_desc

# Get single country
curl https://YOUR_DEPLOYED_URL/countries/Nigeria

# Get status
curl https://YOUR_DEPLOYED_URL/status

# Get image
curl https://YOUR_DEPLOYED_URL/countries/image --output summary.png
```

## 🎯 Submission Checklist

- [ ] MySQL database set up
- [ ] API running locally
- [ ] All endpoints tested
- [ ] Deployed to hosting platform (Railway/Heroku/AWS)
- [ ] GitHub repo pushed with latest code
- [ ] README.md complete
- [ ] .env.example included (not .env)
- [ ] Test deployment URL from different network
- [ ] Submit via `/stage-two-backend` command in Slack

## ⚡ Common Issues & Fixes

### Database Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Fix:** Update DB_PASSWORD in `.env` file

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Fix:** Change PORT in `.env` or kill process using port 3000

### External API Timeout
**Fix:** Check internet connection, APIs might be down temporarily

### Image Not Generated
**Fix:** Ensure `cache/` directory exists (created automatically)

## 📞 Support

- Check logs in terminal
- Verify MySQL is running
- Ensure all dependencies installed: `npm install`
- Check `.env` configuration

Good luck with your submission! 🚀
