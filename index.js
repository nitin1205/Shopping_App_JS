const express = require('express');
const parseBody = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(parseBody.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['vgxuysdf67dfgsdfb489'] }));
app.use(authRouter);

app.listen(3000, () => {
  console.log('listening');
});
