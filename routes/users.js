var express = require('express');
var router = express.Router();
var db = require('../db.js');
var md5 = require('md5');
var utils = require('../utils');

/* NEW user */
router.get('/', function(req, res, next) {
  res.render('new_user', {link:"", title: "Ny dagbok"} );
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  var hash = md5(Date.now()).slice(0,12);
  db.run(`INSERT INTO users (hash) VALUES (?)`,[hash], function(err){
    
    res.render('new_user', { link: utils.link_to(req, `${this.lastID}/${hash}`), title: "Ny dagbok" });
    
  }) 
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

// type,name,tbl_name,rootpage,sql
// table,users,users,2,"CREATE TABLE users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT, 
//     hash TEXT)"
// table,posts,posts,4,"CREATE TABLE posts (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER,
//     date TEXT,
//     down TEXT, 
//     awake REAL, 
//     up text,
//     rate INTEGER,
//     status TEXT,
//     t TIMESTAMP
//     DEFAULT CURRENT_TIMESTAMP
//     )"
