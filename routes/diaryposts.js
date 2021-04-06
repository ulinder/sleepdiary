var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'bagbokspost' });
});

/* CREATE diarypost */
router.post('/', function(req, res, next) {
  console.log(req.body);
  var insert_diary = db.prepare("INSERT INTO diaryposts (user_id, date, down, awake, up, rate) VALUES(?,?,?,?,?,?)");
  insert_diary.run([req.cookies.user, req.body.date, req.body.down, req.body.awake, req.body.up, req.body.rate], (err) =>{
    if(err) console.warn(err);
    res.redirect('/');
  });
  
});

module.exports = router;
