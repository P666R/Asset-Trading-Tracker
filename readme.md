# Asset Marketplace API

This project is a Node.js and Express-based API for managing a marketplace where users can create, update, and trade assets. The API allows for the listing of assets, submitting purchase requests, and managing purchase negotiations.

## Table of Contents

- [Asset Marketplace API](#asset-marketplace-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Setup](#setup)
  - [API Endpoints](#api-endpoints)
    - [Auth Routes](#auth-routes)
    - [Asset Routes](#asset-routes)

## Features

- User authentication with JWT
- Asset creation and updating
- Listing assets on a marketplace
- Purchase request management
- Purchase request negotiation
- Asset trading history tracking

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- dotenv for environment variable management

## Project Structure

- 📂 **asset\-trading\-tracker**
  - 📂 **config**
    - 📄 [db.js](config/db.js)
  - 📂 **controllers**
    - 📄 [assetController.js](controllers/assetController.js)
    - 📄 [authController.js](controllers/authController.js)
  - 📂 **middleware**
    - 📄 [authMiddleware.js](middleware/authMiddleware.js)
  - 📂 **models**
    - 📄 [Asset.js](models/Asset.js)
    - 📄 [Request.js](models/Request.js)
    - 📄 [User.js](models/User.js)
  - 📄 [package.json](package.json)
  - 📄 [readme.md](readme.md)
  - 📂 **routes**
    - 📄 [assets.js](routes/assets.js)
    - 📄 [auth.js](routes/auth.js)
  - 📄 [server.js](server.js)

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/asset-marketplace-api.git
   cd asset-marketplace-api
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   The server will start on http://localhost:5000.

## API Endpoints

### Auth Routes

- `POST /api/auth/signup` - Register a new user.
- `POST /api/auth/login` - Log in an existing user.

### Asset Routes

- `POST /api/assets` - Create a new asset.
- `PUT /api/assets/:id` - Update an existing asset.
- `PUT /api/assets/:id/publish` - List an asset on the marketplace.
- `GET /api/assets/:id` - Get details of an asset.
- `GET /api/assets/user/assets` - Get all assets of the current user.
- `GET /api/assets/marketplace/assets` - Get all assets listed on the marketplace.
- `POST /api/assets/:id/request` - Submit a purchase request for an asset.
- `PUT /api/assets/request/:id/negotiate` - Negotiate a purchase request.
- `PUT /api/assets/request/:id/accept` - Accept a purchase request.
- `PUT /api/assets/request/:id/deny` - Deny a purchase request.
- `GET /api/assets/user/requests` - Get all purchase requests made by the current user.
