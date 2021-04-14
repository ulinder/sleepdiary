var express = require('express');
var router = express.Router();
var db = require('../db.js');
var md5 = require('md5');
var utils = require('../utils');

/* NEW user */
router.get('/', function(req, res, next) {
  res.render('new_user', {link:""} );
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  var hash = md5(Date.now()).slice(0,12);
  db.run(`INSERT INTO users (hash) VALUES (?)`,[hash], function(err){
    
    res.render('new_user', { link: utils.link_to(req, `${this.lastID}/${hash}`) });
    
  }) 
});

module.exports = router;
