var express = require('express');
var router = express.Router();
var db = require('../db.js');
// var moment = require('../utils/moment')
var moment = require('moment'); //.locale('sv');

var date_table = (dbresults) =>{
  if(!dbresults || dbresults.length == 0) return [];
  // create a table of dates between first and last post
  // TABLE
  // date, down, up, rate, sleep_length, sleep_efficiency, awake_time
  //
  
  var first_date = dbresults[0].date,
      last_date = dbresults[dbresults.length -1].date,
      current_date,
      table = [],
      found;

  for (var i=0; i < 60; i++) {

      current_date = moment( dbresults[0].date ).add(i, 'days').format("YYYY-MM-DD");

      found = dbresults.find( (row)=> row.date == current_date);
      found = found ?
        [current_date, found.down, found.up, found.rate] : [current_date,"","","","","",""];

      table.push( found );
      if(current_date == moment(last_date).format("YYYY-MM-DD")) break;
  }
  console.log(table);
  return table;
}


/* GET home page. */
router.get('/', (req, res, next) => {
  console.log(req.baseUrl);
  db.all("SELECT * FROM posts WHERE user_id = ? ORDER BY date ASC", [req.cookies.user], (error, dbresults) =>{
    res.render('index', { title: 'Sömndagboken', posts: dbresults, table: date_table(dbresults) });
    // res.json({time: moment( Date.now() ).locale('sv').format('LLLL')})
  });
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
        res.render('401')
      }

    });
});

module.exports = router;
