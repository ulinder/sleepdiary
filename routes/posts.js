const express = require('express');
const router = express.Router();
const db = require('../db.js');
const helpers = require('../utils/helpers');
const data_table = require('../utils/data_table');
const moment = require('moment'); //.locale('sv');
      moment.locale('sv');


/* GET data_table */
router.get('/:user_id/json', function(req, res, next) {
  db.all("SELECT * FROM posts WHERE user_id = ? ORDER BY down ASC", [req.params.user_id], (error, dbresults) =>{
    if(error) res.json({ error: error })
    res.json( data_table.bake(dbresults) )
  });
});

// NEW POST
router.get('/new', function(req, res, next) {
  db.get("SELECT * FROM users WHERE id=?", req.cookies.user, (error, user)=>{
      if(error) res.json({ error: error });
      res.render('diary_form', { 
        title: 'Sömndagboken - Skapa nytt inlägg', 
        user: user, 
        admin: helpers.is_admin(req),
      })
  });

});


// EDIT POST
router.get('/:id/edit', function(req, res, next) {
  db.get("SELECT * FROM users WHERE id=?", req.cookies.user, (err, user)=>{
    db.get("SELECT * FROM posts left join users where posts.id=?", req.params.id, (error, dbresults) =>{
      if(error) res.json({ error: error });
      dbresults.minutes_awake = helpers.seconds_to_block_of("m", dbresults.awake);
      dbresults.hours_awake = helpers.seconds_to_block_of("h", dbresults.awake);
      console.log(dbresults);
      res.render('diary_form', { 
        title: 'Sömndagboken - Redigera inlägg', 
        post: dbresults, 
        user: user, 
        post_id: req.params.id, 
        admin: helpers.is_admin(req),
      })

    });
  });
});



/* CREATE/UPDATE diarypost */
router.post('/', function(req, res, next) {

    if(req.body.down_time === '' || req.body.up_time === '') return res.json({error: 'timeless'})
    // parse times to seconds
    var down  = moment([req.body.down_date, req.body.down_time].join(" ") ).format("X");
    var up    = moment([req.body.up_date, req.body.up_time].join(" ") ).format("X");
    var awake = parseInt(req.body.awake_hours) + parseInt(req.body.awake_minutes);

    // BACKEND-VALIDATION 
    if( up > moment().format('x') || down > moment().format('x') ) return res.json({'error': 'Future sleeper'}); 
    if(down > up) return res.json({'error': 'reverser'}); 
    if(req.body.rate === null) res.status(403);


    if(req.body.update){ // UPDATE POST
      var values = [
          down, 
          up, 
          ( awake ), 
          req.body.rate,
          req.body.windown,
          req.body.winup,
          req.body.id 
          ]

        console.log("Updating: ", values);
        var insert_diary = db.prepare( `UPDATE posts SET down=?, up=?, awake=?, rate=?, windown=?, winup=? WHERE id=?;` );

    } else { // CREATE NEW POST
      var values = [
          req.cookies.user, 
          down, 
          up, 
          ( awake ), 
          req.body.rate,
          req.body.windown,
          req.body.winup
          ]

      console.log("Create new post: ", values);
      var insert_diary = db.prepare( `INSERT INTO posts (user_id, down, up, awake, rate, windown, winup) VALUES(?, ?, ?, ?, ?, ?, ?) ` );
    }  
    // Common DB execution
    insert_diary.run( values, (err) =>{ 
      if(err) console.warn(err);
      res.redirect('/?flash=postCreated');
    });
    
});



router.delete('/:id', function (req, res) {
    db.run('DELETE FROM posts WHERE id=?', req.params.id, (err)=>{
      if(err) console.log(err);
      res.send('DELETED post ' + req.params.id)
    });
});


module.exports = router;
