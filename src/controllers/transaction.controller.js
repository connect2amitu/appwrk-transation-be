const Transaction = require("../models/transaction.model");
const { validationResult } = require("express-validator");

/**
 * Helper function to recalculate balances for all transactions after a specific date
 * @param {Date} startDate - The date to start recalculation from
 */
async function recalculateBalances(startDate) {
  try {
    // Find all transactions on or after the given date, sorted by date (oldest first)
    const transactions = await Transaction.find({ date: { $gte: startDate } })
      .sort({ date: 1, createdAt: 1 })
      .exec();

    if (transactions.length === 0) return;

    // Get the last transaction before the start date to determine the starting balance
    const previousTransaction = await Transaction.findOne({ date: { $lt: startDate } })
      .sort({ date: -1, createdAt: -1 })
      .exec();

    let currentBalance = previousTransaction ? previousTransaction.remainingBalance : 0;

    // Update each transaction with the new balance
    for (const transaction of transactions) {
      // Calculate new balance
      if (transaction.type === "credit") {
        currentBalance += transaction.amount;
      } else {
        currentBalance -= transaction.amount;
      }

      // Update the transaction with the new balance
      await Transaction.findByIdAndUpdate(transaction._id, { remainingBalance: currentBalance });
    }
  } catch (error) {
    console.error("Error recalculating balances:", error);
    throw error;
  }
}

/**
 * Get all transactions with running balance
 * @route GET /api/transactions
 */
exports.getAllTransactions = async (req, res) => {
  try {
    // Get all transactions sorted by date (newest first)
    const transactions = await Transaction.find().sort({ date: -1 });

    // Format transactions for response
    const transactionsWithBalance = transactions.map(transaction => ({
      _id: transaction._id,
      date: transaction.date,
      description: transaction.description,
      credit: transaction.type === "credit" ? transaction.amount : null,
      debit: transaction.type === "debit" ? transaction.amount : null,
      runningBalance: transaction.remainingBalance,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: transactionsWithBalance.length,
      data: transactionsWithBalance,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};

/**
 * Get a single transaction
 * @route GET /api/transactions/:id
 */
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transaction",
      error: error.message,
    });
  }
};

/**
 * Create a new transaction
 * @route POST /api/transactions
 */
exports.createTransaction = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { description, amount, type, date } = req.body;

    // Create new transaction
    const transaction = await Transaction.create({
      description,
      amount,
      type,
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error creating transaction",
      error: error.message,
    });
  }
};

/**
 * Update a transaction
 * @route PUT /api/transactions/:id
 */
exports.updateTransaction = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { description, amount, type, date } = req.body;

    // First get the original transaction
    const originalTransaction = await Transaction.findById(req.params.id);
    if (!originalTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Find and update transaction
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id, 
      { description, amount, type, date }, 
      { new: true, runValidators: true }
    );

    // Recalculate balances for all transactions after this one
    await recalculateBalances(transaction.date);

    // Fetch the updated transaction with the new balance
    const updatedTransaction = await Transaction.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message,
    });
  }
};

/**
 * Delete a transaction
 * @route DELETE /api/transactions/:id
 */
exports.deleteTransaction = async (req, res) => {
  try {
    // First find the transaction to get its date
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Store the date for recalculation
    const transactionDate = transaction.date;

    // Delete the transaction
    await Transaction.findByIdAndDelete(req.params.id);

    // Recalculate balances for all transactions after this one
    await recalculateBalances(transactionDate);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
      error: error.message,
    });
  }
};
