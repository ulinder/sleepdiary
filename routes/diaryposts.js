var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'bagbokspost' });
});

/* CREATE diarypost */
router.post('/', function(req, res, next) {

  console.log([req.cookies.user, req.body.down_date, req.body.down_time, req.body.awake, req.body.up_date, req.body.up_time, req.body.rate]);
  // var insert_diary = db.prepare("INSERT INTO diaryposts (user_id, date, down, awake, up, rate) VALUES(?,?,?,?,?,?)");
  // insert_diary.run([req.cookies.user, req.body.down_date, req.body.down_time, req.body.awake, req.body.up_date, req.body.up_time, req.body.rate], (err) =>{
  //   if(err) console.warn(err);
  //   res.redirect('/');
  // });
  
});

module.exports = router;
