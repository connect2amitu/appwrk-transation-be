# Office Transaction System API

## Introduction

This is a RESTful API for an office transaction system where Account Managers can manage daily expenses for cash inflow/outflow. The API is built with Node.js, Express, and MongoDB.

## Requirements

- Node.js (v14 or higher)
- MongoDB (v4 or higher)

## Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/office_transactions
   NODE_ENV=development
   ```
4. Start the server
   ```bash
   npm run dev
   ```

## API Endpoints

### Transactions

#### GET /api/transactions
- Description: Get all transactions with running balance
- Response: List of transactions sorted by date (newest first) with running balance

#### GET /api/transactions/:id
- Description: Get a single transaction by ID
- Response: Single transaction object

#### POST /api/transactions
- Description: Create a new transaction
- Request Body:
  ```json
  {
    "description": "Office supplies",
    "amount": 500,
    "type": "debit",
    "date": "2023-08-15T10:30:00Z" // Optional, defaults to current date
  }
  ```
- Validation:
  - `description`: Required, 3-100 characters
  - `amount`: Required, numeric, greater than 0
  - `type`: Required, must be either "credit" or "debit"
  - `date`: Optional, must be a valid ISO 8601 date

#### PUT /api/transactions/:id
- Description: Update a transaction
- Request Body: Same as POST but all fields are optional

#### DELETE /api/transactions/:id
- Description: Delete a transaction

## Running Balance Calculation

The running balance is calculated as follows:
- For credit transactions: Add the amount to the running balance
- For debit transactions: Subtract the amount from the running balance

Example:
- First entry: 5000 credited to office account, balance is 5000
- Second entry: 500 debited for snacks party, balance is 4500
- Third entry: 285 debited for printing sheets, balance is 4215
- Fourth entry: 300 debited for misc expenses, balance is 3915
