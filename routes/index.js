var express = require('express');
var router = express.Router();
var db = require('../db.js');
var moment = require('moment'); //.locale('sv');
const helpers = require('../utils/helpers');
const data_table = require('../utils/data_table');

/* index start page. */
router.get('/', async(req, res, next) => {
  try{
    if(!req.cookies.user) return res.render('landing');
    
    const user = await db.query("SELECT * FROM users WHERE id=?", req.cookies.user);
    var posts = await db.query("SELECT * FROM posts WHERE user_id = ? ORDER BY down ASC", [req.cookies.user]);
    posts = data_table.bake(posts);
    res.render('index', { 
      title: 'Sömndagboken', 
      notice: helpers.notice_mess(posts, req.cookies.settings), // TODO: aktivera sömnfönster så det switchar igång feedback
      flash:'',
      user: user[0], 
      admin: helpers.is_admin(req),
      posts: posts,
      this_week: posts.data_table.filter( p => p.week === posts.current_week)
    });

  } catch(e) { console.error(e); res.render('error',{ message: e, error: {status: e.message}  }); }
});

router.get('/inspect', async(req, res, next) => {
  const user = await db.query("SELECT * FROM users WHERE id=?", req.cookies.user);
  res.status(200).send({user: user})
  
  console.log("Settings: ", req.cookies.settings );
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
        res.cookie('settings', JSON.parse(user.settings) );
        res.redirect('/');
      } else {
        res.render('401', {title: "Ej behörig"})
      }
    });
});

/* GET manual page. */
router.get('/manual', (req, res) => {
  if(!req.cookies.user) return res.render('401');
    res.render('manual', { 
      title: 'manual - Sömndagboken', 
      admin: helpers.is_admin(req),
    } );
});

/* SUPERADMIN  */
router.get('/admin123', function(req, res, next) {
  db.all(`SELECT U.*, count(D.id) as dpcount FROM users as U
          LEFT JOIN posts as D ON U.id = D.user_id
          GROUP BY D.user_id
          ORDER BY t DESC`, (error, dbresults) =>{
    if(error) return res.json({error: error})
    res.render('admin', { 
      title: 'Admin', 
      dbresults: dbresults, 
      admin: helpers.is_admin(req),
    });
  });

});

module.exports = router;
