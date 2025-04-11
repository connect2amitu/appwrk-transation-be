const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["credit", "debit"],
        message: "Type must be either credit or debit",
      },
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
transactionSchema.index({ date: -1 }); // For sorting by date

// Pre-save middleware to calculate the remaining balance
transactionSchema.pre("save", async function (next) {
  try {
    // Skip if this is not a new transaction (to avoid recalculating on updates)
    if (!this.isNew) {
      return next();
    }

    // Find the most recent transaction to get the current balance
    const lastTransaction = await this.constructor
      .findOne()
      .sort({ date: -1, createdAt: -1 })
      .exec();

    let currentBalance = lastTransaction ? lastTransaction.remainingBalance : 0;

    // Update the balance based on transaction type
    if (this.type === "credit") {
      currentBalance += this.amount;
    } else {
      currentBalance -= this.amount;
    }

    // Set the remaining balance for this transaction
    this.remainingBalance = currentBalance;
    next();
  } catch (error) {
    next(error);
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
