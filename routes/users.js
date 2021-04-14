var express = require('express');
var router = express.Router();
var db = require('../db.js');
var md5 = require('md5')

function link_to(req, path){
  return `${req.protocol}://${req.hostname}/${path}`  // `${this.lastID}/${hash}`  
}


/* NEW user */
router.get('/', function(req, res, next) {
  res.render('new_user', {link:""} );
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  var hash = md5(Date.now()).slice(0,12);
  db.run(`INSERT INTO users (hash) VALUES (?)`,[hash], function(err){
    console.warn(err);
    console.log( link_to(`${this.lastID}/${hash}`) );
    res.render('new_user', { link: link_to(req, `${this.lastID}/${hash}`) });
  }) 
});

module.exports = router;
