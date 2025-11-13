
const db = require('./db');

class Wallet {
  static async getBalance(user) {
    return new Promise((resolve, reject) => {
      db.get('SELECT balance FROM wallets WHERE user_name = ?', [user], (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.balance : null);
      });
    });
  }

  static async updateBalance(user, newBalance) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE wallets SET balance = ? WHERE user_name = ?', [newBalance, user], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = Wallet;