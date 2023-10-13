const express = require('express');
const router = express.Router();
const { createTransaction, getTransactionById, deleteTransaction, getTransactions, updateTransaction } = require('../controllers/transactions.controller');

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);

module.exports = router;
