var express = require('express');
var router = express.Router();
var db = require('../db.js');
// var moment = require('../utils/moment')
var moment = require('moment'); //.locale('sv');

var seconds_to_text = (time) => {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + "h ";
    }
    ret += "" + mins + "min";   
    return ret;
}

var data_table = (dbresults) =>{
  if(!dbresults || dbresults.length == 0) return [];
  
  var first_date_str = moment( dbresults[0].down, "X" ).format("YYYY-MM-DD").toString(),
      this_down_date,
      table = [],
      found,
      seconds_in_bed,
      seconds_asleep,
      raw_table;

  for (var i=0; i < 60; i++) {
      this_down_date = moment(first_date_str).add(i, 'days').format("YYYY-MM-DD").toString();
      

      if( moment(dbresults[0].down, "X").format("YYYY-MM-DD") == this_down_date){
        found = dbresults.shift();
        seconds_in_bed = found.up - found.down;
        seconds_asleep = seconds_in_bed - found.awake
        table.push( {
                  week: moment(this_down_date).format("ww"),
                  day: this_down_date, 
                  show: true,
                  time_to_bed: moment(found.down, "X").format("YYYY-MM-DD HH:MM"), 
                  time_up_from_bed: moment(found.up, "X").format("YYYY-MM-DD HH:MM"), 
                  seconds_in_bed: seconds_to_text(seconds_in_bed),
                  sleep_rate: found.rate,
                  seconds_awake: seconds_to_text(found.awake),
                  seconds_asleep: seconds_to_text(seconds_asleep),
                  sleep_efficiency: ( seconds_asleep/seconds_in_bed*100 ).toString().split(".")[0]
                  } );
      } else {
        table.push( {day: this_down_date } );        
      }
      if(dbresults.length === 0) break;
  }

  raw_table = dbresults.map( (row)=>{
    row.up = moment(row.up, "X").toString();
    row.down = moment(row.down, "X").toString();
    return row;
  });

  return table
}

var meta_info = (dataTable) => { 
  return {
    min_week: dataTable[0].week
    // max_week: dataTable[ dataTable.lastIndexOf() ].week
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {

  if(!req.cookies.user) return res.render('401')

  db.all("SELECT * FROM posts WHERE user_id = ? ORDER BY down ASC", [req.cookies.user], (error, dbresults) =>{
    if(error) console.log(error);
    dataTable = data_table(dbresults);
    res.render('index', { title: 'Sömndagboken', data_table: dataTable, meta: meta_info(dataTable) });
    // res.json({ posts_table: data_table })
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
        res.render('401', {title: "Ej behörig"})
      }

    });
});

module.exports = router;
