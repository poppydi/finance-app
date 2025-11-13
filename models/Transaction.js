
const db = require('./db');

class Transaction {
  static async create(transactionData) {
    const { type, amount, from_user, to_user, description } = transactionData;
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO transactions (type, amount, from_user, to_user, description)
         VALUES (?, ?, ?, ?, ?)`,
        [type, amount, from_user, to_user, description || null],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM transactions ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Transaction;