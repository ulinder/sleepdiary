var express = require('express');
var router = express.Router();
var db = require('../db.js');
var moment = require('moment')


/* HANDLE login */
router.get('/:id/:hash', (req, res, next) => {
  
    db.get("SELECT * FROM users WHERE id=?", [req.params.id], (err, user) =>{
      console.log("db user: ", user);  
      if(user && user.hash == req.params.hash){
        res.cookie('user', req.params.id);
        res.cookie('user_hash', req.params.hash);
        res.redirect('/');      
      } else {
        res.render('401')
      }
    
    });    
});


/* GET home page. */
router.get('/', (req, res, next) => {
  db.all("SELECT * FROM diaryposts WHERE user_id = ? ORDER BY date ASC", [req.cookies.user], (error, results) =>{
    console.log(results);
    res.render('index', { title: 'Sömndagboken', posts: results });
  });
});

module.exports = router;
