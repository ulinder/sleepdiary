var express = require('express');
var router = express.Router();
var db = require('../db.js');
var moment = require('moment'); //.locale('sv');
const data_table = require('../utils/data_table');

/* index start page. */
router.get('/', async(req, res, next) => {
  try{
    if(!req.cookies.user) return res.render('401');
    var admin = (req.cookies.admin) ? true : false ;
    const user = await db.query("SELECT * FROM users WHERE id=?", req.cookies.user);
    var posts = await db.query("SELECT * FROM posts WHERE user_id = ? ORDER BY down ASC", [req.cookies.user]);
    posts = data_table.bake(posts);
    res.render('index', { 
      title: 'Sömndagboken', 
      flash: req.cookies, 
      notice: {what: 'default'},
      user: user[0], 
      admin: admin,
      posts: posts,
      this_week: posts.data_table.filter( p => p.week === posts.current_week)
    });

  } catch(e) { console.error(e); res.render('error'); }
  
});

/* HANDLE login */
router.get('/:id/:hash', (req, res, next) => {
    db.get("SELECT * FROM users WHERE id=?", [req.params.id], (err, user) =>{
      if(err){ console.log(err); }
      console.log("User: ", user);
      if(user && user.hash == req.params.hash){
        if(req.query.admin && req.query.admin == user.hash) {
          res.cookie('admin', req.params.hash);
        } else {
          res.clearCookie("admin");
        }
        res.cookie('user', req.params.id);
        res.cookie('user_hash', req.params.hash);
        res.redirect('/');
      } else {
        res.render('401', {title: "Ej behörig"})
      }
    });
});

/* GET manual page. */
router.get('/manual', (req, res) => {
  if(!req.cookies.user) return res.render('401');
    res.render('manual', { title: 'manual - Sömndagboken'} );
});

module.exports = router;
