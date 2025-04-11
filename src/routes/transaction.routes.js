const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { validateTransaction, validateTransactionUpdate } = require('../middleware/validation.middleware');

// GET all transactions
router.get('/', transactionController.getAllTransactions);

// GET single transaction
router.get('/:id', transactionController.getTransaction);

// POST create new transaction
router.post('/', validateTransaction, transactionController.createTransaction);

// PUT update transaction
router.put('/:id', validateTransactionUpdate, transactionController.updateTransaction);

// DELETE transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
