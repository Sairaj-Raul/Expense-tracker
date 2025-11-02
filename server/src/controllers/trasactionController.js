import Transaction from "../models/transaction.js";

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filters = {
      user: req.user._id, // Only get transactions for authenticated user
    };

    if (type) filters.type = type;
    if (category) filters.category = category;
    if (startDate && endDate)
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure user owns the transaction
      req.body,
      { new: true }
    );
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Ensure user owns the transaction
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    next(err);
  }
};
