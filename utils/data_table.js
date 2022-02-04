const moment = require('moment'); //.locale('sv');
moment.locale('sv');
const helpers = require('../utils/helpers');

function bake(dbresults){
  if(!dbresults || dbresults.length == 0) return {current_week: moment().format('ww'), first_week: moment().format('ww'), data_table: [], weeks:[]};
  
  // Define all variables that will be sent in the json-payload
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
      window_down_hit,
      window_up_hit,
      unix_down,
      unix_up,      
      week_arr = [],
      i = 0,
      _dummy = { id: "", date_to_bed: "", time_to_bed: "", date_up_from_bed: "", time_up_from_bed: "", time_in_bed: "", sleep_rate: "", time_awake: "", time_asleep: "", sleep_efficiency: "", windown:"", winup:""};

  
  while (dbresults.length > 0) { 


      if(dbresults[0] && moment(dbresults[0].up, "X").format("YYYY-MM-DD") != this_up_date){
        posts_table.push( { week: moment(this_up_date).format("ww"), day: this_up_date, day_name: moment(this_up_date).format("ddd Do MMMM"), data: _dummy, found: false } ); 
      }

      while( dbresults[0] && moment(dbresults[0].up, "X").format("YYYY-MM-DD") == this_up_date){ 
      
        found = dbresults.shift();

        seconds_in_bed = found.up - found.down;
        seconds_asleep = seconds_in_bed - found.awake;
        week_num = moment(this_up_date).format("ww");
        se = seconds_asleep/seconds_in_bed*100;
        time_to_bed = moment(found.down, "X").format("HH:mm");
        time_up_from_bed = moment(found.up, "X").format("HH:mm");
        window_down_hit = ( Math.abs(moment(time_to_bed, "HH:mm").diff( moment(found.windown,"HH:mm"), "minutes") )     < 10);
        window_up_hit =   ( Math.abs(moment(time_up_from_bed, "HH:mm").diff( moment(found.winup,"HH:mm"), "minutes") )  < 10);

        posts_table.push( {
          week: week_num,
          day: this_up_date, 
          day_name: moment(this_up_date).format("ddd Do MMMM"),
          found: true, 
          data: { 
              id: found.id, 
              unix_down: found.down,
              unix_up: found.up,
              date_to_bed: moment(found.down, "X").format("YYYY-MM-DD"), 
              time_to_bed: time_to_bed, 
              date_up_from_bed: moment(found.up, "X").format("YYYY-MM-DD"), 
              time_up_from_bed: time_up_from_bed, 
              time_in_bed: helpers.seconds_to_text(seconds_in_bed), 
              sleep_rate: found.rate, 
              sleep_rate_stars: helpers.times(found.rate, '★'), 
              time_awake: helpers.seconds_to_text(found.awake), 
              time_asleep: helpers.seconds_to_text(seconds_asleep), 
              seconds_asleep: seconds_asleep, 
              windown: found.windown, 
              window_down_hit: window_down_hit,
              window_up_hit: window_up_hit,
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
      
  } // while - dbresults

  // Finish Weeks avg calculations
  Object.keys(weeks).forEach( (n) => { 
    week_arr.push({w: n, val: {
      sleep_time_arr: weeks[n].sleep_time_arr, 
      se_arr: weeks[n].se_arr,
      avg_sleep_time: Math.round( ((weeks[n].sleep_time_arr.reduce(helpers.arrSum) / weeks[n].sleep_time_arr.length)/60/60) ),
      avg_sleep_efficiency: Math.round( (weeks[n].se_arr.reduce(helpers.arrSum) / weeks[n].se_arr.length) ),
    } });
  });
  
  return { 
    data_table: posts_table.reverse(),
    current_week: moment().format('ww'),
    first_week: first_week_str,
    weeks: week_arr 
  }
} // function data-table

module.exports = {bake}