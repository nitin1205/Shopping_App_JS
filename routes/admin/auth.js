const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail, 
  requirePassword,
  requireConfirmPassword,
  requireEmailExists,
  requireValidPasswordForUser
} = require('./validator');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [
    requireEmail,
    requirePassword,
    requireConfirmPassword
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));  
    }
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

router.post(
  '/signin',
  [ 
    requireEmailExists,
    requireValidPasswordForUser
  ],	
   async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email } =  req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.id = user.id;

    res.send('You are singed in');
});

module.exports = router;
