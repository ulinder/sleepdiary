var express = require('express');
var router = express.Router();
var db = require('../db.js');
// var moment = require('../utils/moment')
var moment = require('moment'); //.locale('sv');

/* GET home page. */
router.get('/', (req, res, next) => {
  if(!req.cookies.user) return res.render('401')
  res.render('index', { title: 'Sömndagboken'} );
});

/* HANDLE login */
router.get('/:id/:hash', (req, res, next) => {
    db.get("SELECT * FROM users WHERE id=?", [req.params.id], (err, user) =>{
      if(err){ console.log(err); }
      console.log("User: ", user);
      if(user && user.hash == req.params.hash){
        res.cookie('user', req.params.id);
        res.cookie('user_hash', req.params.hash);
        res.redirect('/');
      } else {
        res.render('401', {title: "Ej behörig"})
      }

    });
});

module.exports = router;
