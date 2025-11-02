import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/trasactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All transaction routes require authentication
router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);

router.route("/:id").put(updateTransaction).delete(deleteTransaction);

export default router;
