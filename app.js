
const express = require('express');
const path = require('path');
const walletController = require('./controllers/walletController');

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', walletController.index);
app.post('/deposit', walletController.deposit);
app.post('/pay', walletController.pay);
app.post('/transfer', walletController.transfer);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});