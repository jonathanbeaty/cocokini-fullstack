var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
const path = require('path');
var cookieParser = require('cookie-parser');

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  const {
    _raw,
    _json,
    ...userProfile
  } = req.user;
  res.render('user', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page'
  });
  console.log('Cookies: ', req.cookies);
});



module.exports = router;