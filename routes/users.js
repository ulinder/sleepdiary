const express = require('express');
const router = express.Router();
const db = require('../db.js');
const md5 = require('md5');
const helpers = require('../utils/helpers');

/* NEW user form */
router.get('/', function(req, res, next) {
  res.render('new_user', {link:"", title: "Ny dagbok"} );
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  var hash = md5(Date.now()).slice(0,12);
  db.run(`INSERT INTO users (hash) VALUES (?)`,[hash], function(err){
    res.render('new_user', { link: helpers.link_to(req, `${this.lastID}/${hash}`), hash: hash, title: "Ny dagbok" });
  }) 
});

// UPDATE User
router.post('/:id/update', function(req, res){
  var params = [req.body.windown, req.body.winup, req.params.id];
  if(params[0].length != 5 && params[1].length != 5) return res.json({error: "fails!!"});
    
    console.log();
    db.run("UPDATE users SET windown=?, winup=? WHERE id=?", params, function(err){
      if(err) return res.json({error: err});
      res.redirect('/')
      }); 
});

/* SUPERADMIN  */
router.get('/admin123', function(req, res, next) {
  db.all(`SELECT U.*, count(D.id) as dpcount FROM users as U 
          LEFT JOIN posts as D ON U.id = D.user_id
          GROUP BY D.user_id 
          ORDER BY t DESC`, (error, dbresults) =>{
    if(error) return res.json({error: error})            
    res.render('admin', { title: 'Admin', dbresults: dbresults });
  });

});

module.exports = router;
