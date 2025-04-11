# Office Transaction System

A backend API for managing office transactions including cash inflow and outflow.

## Introduction

You are going to build Transaction system for an office where Account Manager will be Managing Daily Expenses for Cash Inflow / Outflow.

## Details

There will be two screens as following:

### 1. Office Transactions Grid

with 5 columns Date, Description, Credit, Debit & Running Balance should be displayed as following and Sorting should be done in such a way that latest transactions should come on the top.

### Notes

- Running balance should be the balance that is remaining in the account.
- Example:
  - First entry (on 17 Feb) from the bottom in the table above is showing that 5000 have been credited to Office account so balance is 5k.
  - On 18 Feb, There was an expense of 500 on snacks party so entry should be 500 to Debit column and running balance is now 4500.
  - On 18 Feb, there is another expense of printing sheets worth 285, so running balance is 4215.
  - On 20 Feb, There are some misc. expense worth 300 so now the running balance should be 1215.

### 2. Add Transaction Page

When user clicks on "+ Add Transaction Page" it will show the "New Transaction Page".

#### Transaction type

will be dropdown with one option can be selected at one time (Credit/Debit), Amount & Description should be required field.

#### On Click of Save

it will create new transaction record in Database and redirect to Office Transactions page

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd account-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/office-transactions
   NODE_ENV=development
   ```

### Running the Application

- For development with auto-restart:
  ```
  npm run dev
  ```

- For production:
  ```
  npm start
  ```

- The server will run on http://localhost:3000 (or the PORT specified in your .env file)
- Health check endpoint: http://localhost:3000/health

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- More endpoints available in API_README.md

## Technologies Used

### Dependencies

- **express** (^4.18.2): Web framework for Node.js
- **mongoose** (^7.5.0): MongoDB object modeling tool
- **cors** (^2.8.5): Enable Cross-Origin Resource Sharing
- **dotenv** (^16.3.1): Load environment variables from .env file
- **express-validator** (^7.0.1): Validation middleware for Express
- **helmet** (^7.0.0): Secure Express apps by setting HTTP headers
- **morgan** (^1.10.0): HTTP request logger middleware

### Dev Dependencies

- **nodemon** (^3.0.1): Utility for auto-restarting the server during development
