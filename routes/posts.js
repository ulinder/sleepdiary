var express = require('express');
var router = express.Router();
var db = require('../db.js');
var moment = require('moment'); //.locale('sv');
moment.locale('sv');

const arrSum = (accumulator, currentValue) => accumulator + currentValue;  

const seconds_to_text = (time) => {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + "h ";
    }
    ret += "" + mins + "min";   
    return ret;
}

const seconds_to_block_of = (type, seconds)=>{ // type => [h/m]
  if(type.match(/h|m/)){
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    return (type == "h") ? hrs : mins;
  } 
  console.error('Fail in seconds to block');
}

const data_table = (dbresults) =>{
  if(!dbresults || dbresults.length == 0) return [];
  
  var first_date_str = moment( dbresults[0].up, "X" ).format("YYYY-MM-DD").toString(),
      first_week_str = moment( dbresults[0].up, "X" ).format("ww").toString(),
      this_up_date = first_date_str,
      posts_table = [],
      weeks = {},
      week_num,
      found,
      seconds_in_bed,
      seconds_asleep,
      se,
      week_arr = [],
      i = 0,
      _dummy = { id: "", date_to_bed: "", time_to_bed: "", date_up_from_bed: "", time_up_from_bed: "", time_in_bed: "", sleep_rate: "", time_awake: "", time_asleep: "", sleep_efficiency: ""};

  
  while (dbresults.length > 0) { 

      if(dbresults[0] && moment(dbresults[0].up, "X").format("YYYY-MM-DD") != this_up_date){
        posts_table.push( { week: moment(this_up_date).format("ww"), day: this_up_date, data: _dummy, found: false } ); 
      }

      while( dbresults[0] && moment(dbresults[0].up, "X").format("YYYY-MM-DD") == this_up_date){ 
      
        found = dbresults.shift();

        seconds_in_bed = found.up - found.down;
        seconds_asleep = seconds_in_bed - found.awake;
        week_num = moment(this_up_date).format("ww");
        se = seconds_asleep/seconds_in_bed*100

        posts_table.push( {
          week: week_num,
          day: this_up_date, 
          found: true, 
          data: { 
              id: found.id, 
              date_to_bed: moment(found.down, "X").format("YYYY-MM-DD"), 
              time_to_bed: moment(found.down, "X").format("HH:mm"), 
              date_up_from_bed: moment(found.up, "X").format("YYYY-MM-DD"), 
              time_up_from_bed: moment(found.up, "X").format("HH:mm"), 
              time_in_bed: seconds_to_text(seconds_in_bed), 
              sleep_rate: found.rate, 
              time_awake: seconds_to_text(found.awake), 
              time_asleep: seconds_to_text(seconds_asleep), 
              seconds_asleep: seconds_asleep, 
              t: found.t, 
              sleep_efficiency: ( se ).toString().split(".")[0] + '%'
            }
        } ); // push into array 

        // SET/TEST this_week:
        // { 22: {avg_sleep_efficiency: 0, avg_sleep_time: 0, se_arr: [], sleep_time_arr: [] } }
        if( weeks[week_num] ){ 
          weeks[week_num].sleep_time_arr.push(seconds_asleep);
          weeks[week_num].se_arr.push(se);
        } else {
          weeks[week_num] = { se_arr: [se], sleep_time_arr: [seconds_asleep] };
        } 


      } // WHILE inner same day
    i++;
    this_up_date = moment(first_date_str).add(i, 'days').format("YYYY-MM-DD").toString();
    
  } // while 

  // Finish Weeks avg calculations
  Object.keys(weeks).forEach( (n) => { 
    week_arr.push({w: n, val: {
      sleep_time_arr: weeks[n].sleep_time_arr, 
      se_arr: weeks[n].se_arr,
      avg_sleep_time: ((weeks[n].sleep_time_arr.reduce(arrSum) / weeks[n].sleep_time_arr.length)/60/60),
      avg_sleep_efficiency: (weeks[n].se_arr.reduce(arrSum) / weeks[n].se_arr.length),
    } });
  });
  
  return { 
    data_table: posts_table,
    current_week: moment().format('ww'),
    first_week: first_week_str,
    weeks: week_arr 
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

    // check for future sleeper
    if( moment(req.body.up_date).format('x') > moment().format('x') || 
        moment(req.body.down_date).format('x') > moment().format('x') ) 
      { console.error('Future sleeper');
        return res.json({'error': 'Future sleeper'}); 
      }

    if(req.body.update){

      var values = [
          moment([req.body.down_date, req.body.down_time].join(" ") ).format("X"), 
          moment([req.body.up_date, req.body.up_time].join(" ") ).format("X"), 
          ( parseInt(req.body.awake_hours) + parseInt(req.body.awake_minutes) ), 
          req.body.rate,
          req.body.id 
          ]

        console.log("Updating: ", values);
        var insert_diary = db.prepare( `UPDATE posts SET down=?, up=?, awake=?, rate=? WHERE id=?;` );

    } else { // CREATE POST

      var values = [
          req.cookies.user, 
          moment([req.body.down_date, req.body.down_time].join(" ") ).format("X"), 
          moment([req.body.up_date, req.body.up_time].join(" ") ).format("X"), 
          ( parseInt(req.body.awake_hours) + parseInt(req.body.awake_minutes) ), 
          req.body.rate
          ]

      console.log("Inserting new post: ", values);
      var insert_diary = db.prepare( `INSERT INTO posts (user_id, down, up, awake, rate) VALUES(?, ?, ?, ?, ?) ` );
    }
    
    insert_diary.run( values, (err) =>{ 
      if(err) console.warn(err);
      res.redirect('/?flash=crude');
    });
    
});

router.delete('/:id', function (req, res) {
  res.send('Got a DELETE request at /post')
  db.run('DELETE FROM posts WHERE id=?', req.params.id, (err, res)=>{
    console.log(res);
  })
})


module.exports = router;
