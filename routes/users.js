const express = require('express');
const router = express.Router();
const db = require('../db.js');
const md5 = require('md5');
const helpers = require('../utils/helpers');

/* NEW user form */
router.get('/', function(req, res, next) {
  res.render('new_user', {
    link:"", 
    title: "Ny dagbok", 
    admin: helpers.is_admin(req),
  } );
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  var hash = md5(Date.now()).slice(0,12);
  db.run(`INSERT INTO users (hash) VALUES (?)`,[hash], function(err){
    var newlink = helpers.link_to(req, `${this.lastID}/${hash}`)
    res.set('X-diary-url', newlink)
    res.render('new_user', { 
      link: newlink, 
      hash: hash, 
      title: "Ny dagbok", 
      admin: helpers.is_admin(req),
    });
  })
});

// UPDATE User
router.post('/:id/update', function(req, res){
  var params = [req.body.windown, req.body.winup, req.params.id];
  if(params[0].length != 5 && params[1].length != 5) return res.json({error: "fails!!"});
    db.run("UPDATE users SET windown=?, winup=? WHERE id=?", params, function(err){
      if(err) return res.json({error: err});
      res.redirect('/')
      });
});

module.exports = router;
