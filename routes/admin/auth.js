const express = require('express');
const userRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send('Email already exists.');
  }

  if (password !== confirmPassword) {
    return res.send('Passwords must be same.');
  }

  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  res.send('user added');
});

router.get('/signout', (req, res) =>  {
  req.session = null;
  res.send('You are Logged Out!!');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
  const {email, password } =  req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.validateUser(user.password, password);
  if (!validPassword) {
    return res.send('Invalid password');
  }

  req.session.id = user.id;

  res.send('You are singed in');
});

module.exports = router;