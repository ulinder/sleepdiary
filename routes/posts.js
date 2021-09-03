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
  if(!dbresults || dbresults.length == 0) return {current_week: moment().format('ww'), first_week: moment().format('ww'), data_table: [], weeks:[]};
  
  var first_date_str = moment( dbresults[0].up, "X" ).format("YYYY-MM-DD").toString(),
      first_week_str = moment( dbresults[0].up, "X" ).format("ww").toString(),
      this_up_date = first_date_str,
      posts_table = [],
      weeks = {},
      week_num,
      found,
      seconds_in_bed,
      seconds_asleep,
      time_to_bed,
      time_up_from_bed,
      se,
      window_hit,
      week_arr = [],
      i = 0,
      _dummy = { id: "", date_to_bed: "", time_to_bed: "", date_up_from_bed: "", time_up_from_bed: "", time_in_bed: "", sleep_rate: "", time_awake: "", time_asleep: "", sleep_efficiency: "", windown:"", winup:""};

  
  while (dbresults.length > 0) { 

      if(dbresults[0] && moment(dbresults[0].up, "X").format("YYYY-MM-DD") != this_up_date){
        posts_table.push( { week: moment(this_up_date).format("ww"), day: this_up_date, data: _dummy, found: false } ); 
      }

      while( dbresults[0] && moment(dbresults[0].up, "X").format("YYYY-MM-DD") == this_up_date){ 
      
        found = dbresults.shift();

        seconds_in_bed = found.up - found.down;
        seconds_asleep = seconds_in_bed - found.awake;
        week_num = moment(this_up_date).format("ww");
        se = seconds_asleep/seconds_in_bed*100;
        time_to_bed = moment(found.down, "X").format("HH:mm");
        time_up_from_bed = moment(found.up, "X").format("HH:mm");
        window_hit = (
            moment(time_to_bed, "HH:mm").diff( moment(found.windown,"HH:mm"), "minutes") +
            moment(time_up_from_bed, "HH:mm").diff( moment(found.winup,"HH:mm"), "minutes") < 15
          )

        posts_table.push( {
          week: week_num,
          day: this_up_date, 
          found: true, 
          data: { 
              id: found.id, 
              date_to_bed: moment(found.down, "X").format("YYYY-MM-DD"), 
              time_to_bed: time_to_bed, 
              date_up_from_bed: moment(found.up, "X").format("YYYY-MM-DD"), 
              time_up_from_bed: time_up_from_bed, 
              time_in_bed: seconds_to_text(seconds_in_bed), 
              sleep_rate: found.rate, 
              time_awake: seconds_to_text(found.awake), 
              time_asleep: seconds_to_text(seconds_asleep), 
              seconds_asleep: seconds_asleep, 
              windown: found.windown, 
              window_hit: window_hit,
              winup: found.winup,
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
      avg_sleep_time: Math.round( ((weeks[n].sleep_time_arr.reduce(arrSum) / weeks[n].sleep_time_arr.length)/60/60) ),
      avg_sleep_efficiency: Math.round( (weeks[n].se_arr.reduce(arrSum) / weeks[n].se_arr.length) ),
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

// NEW POST
router.get('/new', function(req, res, next) {

  db.get("SELECT * FROM users WHERE id=?", req.cookies.user, (error, user)=>{
      if(error) res.json({ error: error });
      res.render('diary_form', { title: 'Sömndagboken - Skapa nytt inlägg', user: user })
  });

});


// EDIT POST
router.get('/:id/edit', function(req, res, next) {
  db.get("SELECT * FROM users WHERE id=?", req.cookies.user, (err, user)=>{
    db.get("SELECT * FROM posts left join users where posts.id=?", req.params.id, (error, dbresults) =>{
      if(error) res.json({ error: error });
      dbresults.minutes_awake = seconds_to_block_of("m", dbresults.awake);
      dbresults.hours_awake = seconds_to_block_of("h", dbresults.awake);
      console.log(dbresults);
      res.render('diary_form', { title: 'Sömndagboken - Redigera inlägg', post: dbresults, user: user, post_id: req.params.id })
      // res.json( dbresults );
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
      res.redirect('/?flash=crude');
    });
    
});

router.delete('/:id', function (req, res) {
    db.run('DELETE FROM posts WHERE id=?', req.params.id, (err)=>{
      if(err) console.log(err);
      res.send('DELETED post ' + req.params.id)
      console.log(this);
    });
});


module.exports = router;
