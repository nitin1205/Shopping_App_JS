const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [
    check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must be a valid email')
      .custom(async email => {
        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
          throw new Error('Email already in use');
        }
      }),
    check('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Must be between 4 and 20 charaters'),
    check('confirmPassword')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Must be between 4 and 20 characters')
      .custom((confirmPassword, { req }) => {
        if  (confirmPassword !== req.body.password) {
          throw new Error('Passwords must be same.');
        }
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);	  
    const { email, password, confirmPassword } = req.body;





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
