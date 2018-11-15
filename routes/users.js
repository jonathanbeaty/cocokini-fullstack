var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
const path = require('path');

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  const {
    _raw,
    _json,
    ...userProfile
  } = req.user;
  res.sendFile('myAccount.html', {
    root: path.join(__dirname, '../public')
  });
});

module.exports = router;