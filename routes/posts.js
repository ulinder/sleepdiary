var express = require('express');
var router = express.Router();
var db = require('../db.js');
var moment = require('moment'); //.locale('sv');
moment.locale('sv');

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

var seconds_to_block_of = (type, seconds)=>{ // type => [h/m]
  if(type.match(/h|m/)){
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    return (type == "h") ? hrs : mins;
  } 
  console.error('Fail in seconds to block');
}

var data_table = (dbresults) =>{
  if(!dbresults || dbresults.length == 0) return [];
  
  var first_date_str = moment( dbresults[0].up, "X" ).format("YYYY-MM-DD").toString(),
      first_week_str = moment( dbresults[0].up, "X" ).format("ww").toString(),
      this_up_date,
      posts_table = [],
      weeks = new Map(),
      found,
      seconds_in_bed,
      seconds_asleep;

  var found_dummy = {
            id: "",
            date_to_bed: "",
            time_to_bed: "",
            date_up_from_bed: "",
            time_up_from_bed: "",
            time_in_bed: "",
            sleep_rate: "",
            time_awake: "",
            time_asleep: "",
            sleep_efficiency: ""
  }
   

  for (var i=0; i < 60; i++) {
      this_up_date = moment(first_date_str).add(i, 'days').format("YYYY-MM-DD").toString();
      
      if( moment(dbresults[0].up, "X").format("YYYY-MM-DD") == this_up_date){ // this date has a post? 

        found = dbresults.shift();
        seconds_in_bed = found.up - found.down;
        seconds_asleep = seconds_in_bed - found.awake
        posts_table.push( {
          week: moment(this_up_date).format("ww"),
          day: this_up_date, 
          found: {
              id: found.id, 
              date_to_bed: moment(found.down, "X").format("YYYY-MM-DD"), 
              time_to_bed: moment(found.down, "X").format("HH:MM"), 
              date_up_from_bed: moment(found.up, "X").format("YYYY-MM-DD"), 
              time_up_from_bed: moment(found.up, "X").format("HH:MM"), 
              time_in_bed: seconds_to_text(seconds_in_bed),
              sleep_rate: found.rate,
              time_awake: seconds_to_text(found.awake),
              time_asleep: seconds_to_text(seconds_asleep),
              sleep_efficiency: ( seconds_asleep/seconds_in_bed*100 ).toString().split(".")[0] + '%'
            }
        } );
      } else {
        posts_table.push( { week: moment(this_up_date).format("ww"), day: this_up_date, found: null } ); 
      }
    if(dbresults.length == 0) break;
  } // for 

  const arrAvg = (accumulator, currentValue) => accumulator + currentValue;  

  // Build Weeks object 
  posts_table.map( (day)=>{ 
    if(weeks.has(day.week) === false){ weeks.set(day.week, { avg: 0, posts: [] } ); } // set current week to 0 in map if doesnt exist
    
    if(day.found){ 
      arr = weeks.get(day.week).posts;
      arr.push( parseInt(day.found.sleep_efficiency) );
      weeks.set( day.week, { posts: arr, avg: Math.round( arr.reduce(arrAvg)/arr.length) } ); 
    } 
  });

  let weeks_arr = [];
  weeks.forEach((v,k)=> weeks_arr.push({w: k, val: v}) );
  
  return { 
    data_table: posts_table,
    current_week: moment().format('ww'),
    first_week: first_week_str,
    // weeks: Array.fromEntries( weeks )    // 
    weeks: weeks_arr // <- turn Map into Obj
  }
  
}

/* GET home page. */
router.get('/:user_id/json', function(req, res, next) {
    db.all("SELECT * FROM posts WHERE user_id = ? ORDER BY down ASC", [req.params.user_id], (error, dbresults) =>{
      if(error) res.json({ error: error })
      res.json( data_table(dbresults) )
      });
});

// EDIT POST
router.get('/:id/edit', function(req, res, next) {
  db.get("SELECT * FROM posts where id= ?", req.params.id, (error, dbresults) =>{
    if(error) res.json({ error: error });
    dbresults.minutes_awake = seconds_to_block_of("m", dbresults.awake);
    dbresults.hours_awake = seconds_to_block_of("h", dbresults.awake);
    res.render('edit_post', { title: 'Sömndagboken - Redigera inlägg', post: dbresults })
    // res.json( dbresults ); 
  });
});

/* CREATE/UPDATE diarypost */
router.post('/', function(req, res, next) {

    // if(req.body.update){ return res.json({body: req.body}) }
    console.log(req.body); 

    var values = [
        moment([req.body.down_date, req.body.down_time].join(" ") ).format("X"), 
        moment([req.body.up_date, req.body.up_time].join(" ") ).format("X"), 
        ( parseInt(req.body.awake_hours) + parseInt(req.body.awake_minutes) ), 
        req.body.rate,
        req.body.id ]

    if(req.body.update){
      var insert_diary = db.prepare( `UPDATE posts SET down=?, up=?, awake=?, rate=? WHERE id=?;` );
    } else {
      var insert_diary = db.prepare( `INSERT INTO posts (user_id, down, up, awake, rate) VALUES(?, ?, ?, ?, ?) ` );
    }
    
    insert_diary.run( values, (err) =>{ 
      if(err) console.warn(err);
      res.redirect('/?flash=crude');
    });
    
});

module.exports = router;
