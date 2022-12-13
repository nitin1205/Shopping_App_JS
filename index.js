const express = require('express');
const parseBody = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

app.use(express.static('public'));
app.use(parseBody.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['vgxuysdf67dfgsdfb489'] }));
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log('listening');
});
