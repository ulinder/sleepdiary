var express = require('express');
var router = express.Router();
var db = require('../db.js');
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
  
  var first_date_str = moment( dbresults[0].up, "X" ).format("YYYY-MM-DD").toString(),
      this_up_date,
      table = [],
      found,
      seconds_in_bed,
      seconds_asleep,
      raw_table;

  for (var i=0; i < 60; i++) {
      this_up_date = moment(first_date_str).add(i, 'days').format("YYYY-MM-DD").toString();
      

      if( moment(dbresults[0].up, "X").format("YYYY-MM-DD") == this_up_date){
        found = dbresults.shift();
        seconds_in_bed = found.up - found.down;
        seconds_asleep = seconds_in_bed - found.awake
        table.push( {
                  week: moment(this_up_date).format("ww"),
                  day: this_up_date, 
                  found: {
                    id: found.id,
                    time_to_bed: moment(found.down, "X").format("YYYY-MM-DD HH:MM"), 
                    time_up_from_bed: moment(found.up, "X").format("YYYY-MM-DD HH:MM"), 
                    time_in_bed: seconds_to_text(seconds_in_bed),
                    sleep_rate: found.rate,
                    time_awake: seconds_to_text(found.awake),
                    time_asleep: seconds_to_text(seconds_asleep),
                    sleep_efficiency: ( seconds_asleep/seconds_in_bed*100 ).toString().split(".")[0]
                    }
                  } );
      } else {
        table.push( { week: moment(this_up_date).format("ww"), day: this_up_date, found: null } ); 
      }
    if(dbresults.length == 0) break;
  } // for 

  raw_table = dbresults.map( (row)=>{
    row.up = moment(row.up, "X").toString();
    row.down = moment(row.down, "X").toString();
    return row;
  });

  return table
}


/* GET home page. */
router.get('/:id/json', function(req, res, next) {

    db.all("SELECT * FROM posts WHERE user_id = ? ORDER BY down ASC", [req.params.id], (error, dbresults) =>{
    if(error) res.json({ error: error })
    res.json({ posts_table: data_table(dbresults) })
    });

});

/* CREATE diarypost */
router.post('/', function(req, res, next) {

    var values = [
        req.cookies.user, 
        moment([req.body.down_date, req.body.down_time].join(" ") ).format("X"), 
        moment([req.body.up_date, req.body.up_time].join(" ") ).format("X"), 
        ( parseInt(req.body.awake_hours) + parseInt(req.body.awake_minutes) ), 
        req.body.rate
      ]

    var insert_diary = db.prepare(
      `INSERT INTO posts 
      (user_id, down, up, awake, rate) 
      VALUES(?, ?, ?, ?, ?) `
    );
    
    insert_diary.run( values, (err) =>{
      if(err) console.warn(err);
      res.redirect('/');
    });
    
});

module.exports = router;
