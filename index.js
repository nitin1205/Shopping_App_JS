const express = require('express');
const parseBody = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
app.use(parseBody.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['vgxuysdf67dfgsdfb489'] }));
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartRouter);

app.listen(3000, () => {
  console.log('listening');
});
