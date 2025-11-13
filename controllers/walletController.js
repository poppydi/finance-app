
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const USER = 'user1'; 
exports.index = async (req, res) => {
    try {
      const balance = await Wallet.getBalance(USER);
      const transactions = await Transaction.getAll();
      res.render('index', { balance, transactions, user: USER });
    } catch (err) {
      res.status(500).send('Ошибка сервера');
    }
  };

exports.deposit = async (req, res) => {
  const { amount } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).send('Некорректная сумма');
  }

  try {
    const balance = await Wallet.getBalance(USER);
    const newBalance = balance + numAmount;
    await Wallet.updateBalance(USER, newBalance);
    await Transaction.create({
      type: 'deposit',
      amount: numAmount,
      from_user: null,
      to_user: USER,
      description: 'Пополнение кошелька'
    });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Ошибка пополнения');
  }
};


exports.pay = async (req, res) => {
  const { amount, description } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).send('Некорректная сумма');
  }

  try {
    const balance = await Wallet.getBalance(USER);
    if (balance < numAmount) {
      return res.status(400).send('Недостаточно средств');
    }

    const newBalance = balance - numAmount;
    await Wallet.updateBalance(USER, newBalance);
    await Transaction.create({
      type: 'payment',
      amount: numAmount,
      from_user: USER,
      to_user: null,
      description: description || 'Покупка'
    });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Ошибка оплаты');
  }
};


exports.transfer = async (req, res) => {
  const { to_user, amount } = req.body;
  const numAmount = parseFloat(amount);

  if (!to_user || to_user === USER) {
    return res.status(400).send('Некорректный получатель');
  }
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).send('Некорректная сумма');
  }

  try {
    const balance = await Wallet.getBalance(USER);
    if (balance < numAmount) {
      return res.status(400).send('Недостаточно средств');
    }

  
    await Wallet.updateBalance(USER, balance - numAmount);

    const recipientBalance = await Wallet.getBalance(to_user);
    if (recipientBalance === null) {
     
      const newDb = require('../models/db'); 
      newDb.run('INSERT INTO wallets (user_name, balance) VALUES (?, ?)', [to_user, numAmount]);
    } else {
      await Wallet.updateBalance(to_user, recipientBalance + numAmount);
    }

    await Transaction.create({
      type: 'transfer',
      amount: numAmount,
      from_user: USER,
      to_user: to_user,
      description: 'Перевод средств'
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка перевода');
  }
};