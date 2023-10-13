const prisma = require('../libs/prisma');
const { createTransactionSchema } = require('../validations/transactions.validation');

const createTransaction = async (req, res, next) => {
  try {
    const { amount, source_account_id, destination_account_id } = req.body;
    const { value, error } = await createTransactionSchema.validate({
      amount,
      source_account_id,
      destination_account_id,
    });

    if (error) return res.status(400).json({ success: false, message: error.message, data: null });

    const sourceAccount = await prisma.bank_Accounts.findUnique({
      where: {
        id: value.source_account_id,
      },
    });

    if (!sourceAccount) return res.status(404).json({ success: false, message: 'Source account Id Not Found', data: null });

    const destinationAccount = await prisma.bank_Accounts.findUnique({
      where: {
        id: value.destination_account_id,
      },
    });

    if (!destinationAccount) return res.status(404).json({ success: false, message: 'Destination account Id Not Found', data: null });

    // validasi saldo cukup
    if (sourceAccount.balance < value.amount) return res.status(400).json({ success: false, message: 'Balance less', data: null });

    // kurangi saldo
    await prisma.bank_Accounts.update({
      where: {
        id: sourceAccount.id,
      },
      data: {
        balance: Number(sourceAccount.balance) - value.amount,
      },
    });

    // tambah saldo penerima
    await prisma.bank_Accounts.update({
      where: {
        id: destinationAccount.id,
      },
      data: {
        balance: Number(destinationAccount.balance) + value.amount,
      },
    });

    // jika berhasil tambah data pada tabel transaction
    const transaction = await prisma.transactions.create({
      data: {
        amount: value.amount,
        source_account_id: value.source_account_id,
        destination_account_id: value.destination_account_id,
      },
    });

    res.status(201).json({ success: true, message: 'Created', data: transaction });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.transactions.findMany();

    res.status(200).json({ success: true, message: 'OK ', data: transactions });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        destinationAccountId: {
          select: {
            user_id: true,
            userId: {
              select: {
                name: true,
              },
            },
            bank_name: true,
          },
        },
        sourceAccountId: {
          select: {
            user_id: true,
            userId: {
              select: {
                name: true,
              },
            },
            bank_name: true,
          },
        },
      },
    });

    if (!transaction) return res.status(404).json({ success: false, message: 'Not Found', data: null });
    transaction.source_account_detail = {
      user_id: transaction.sourceAccountId.user_id,
      ...transaction.sourceAccountId.userId,
      bank_name: transaction.sourceAccountId.bank_name,
    };

    transaction.destination_account_detail = {
      user_id: transaction.destinationAccountId.user_id,
      ...transaction.destinationAccountId.userId,
      bank_name: transaction.destinationAccountId.bank_name,
    };

    delete transaction.sourceAccountId;
    delete transaction.destinationAccountId;

    res.status(200).json({ success: true, message: 'OK ', data: transaction });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
};
