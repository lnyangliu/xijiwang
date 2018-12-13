var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Look at me now',data:[1,2,3,4,5,6,7,8,9,0] });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/xblogin', function(req, res, next) {
  res.render('xblogin');
});
router.get('/xbregister', function(req, res, next) {
  res.render('xbregister');
});

router.get('/hualogin', function(req, res, next) {
  res.render('hualogin');
});
router.get('/huaregister', function(req, res, next) {
  res.render('huaregister');
});
module.exports = router;
