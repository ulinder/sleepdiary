/* ###  Rules for all fields ###

  Common: 
    all fields should have right format
    sleep-times should not overlap others, except when editing and saving and old one. 


  flags: I = instant, d = dependant, 
  down_date 
    max: can't be after now -I
    min: can't be older than 3 days -I
    dep: can't be after up_date
  down_time
    belongs to down_date
  up_date
    max: can't be after now -I
    min: can't be before down_date -I
  up_time
    belongs to up_date
  awake_hours 
  awake_minutes
    dep: can't be more than Time In Bed -I
  rate
    should be set -I

*/



window.formErrors = new Set();
const fe = window.formErrors;
const is_update = ( ge('update') ) ? true : false;
const formFields = ['down_date', 'down_time', 'awake_hours', 'awake_minutes', 'up_date', 'up_time', 'star1', 'star2', 'star3', 'star4', 'star5'];

const err_miss_rate = "Du behöver skatta din sömnkvalitét med antal stjärnor.",
      err_down_3_day = "Du kan inte göra en sömnregistrering av ett datum som ligger mer än 3 dagar bakåt i tiden.",
      err_reverse_time = "Datum och tid du klev upp behöver vara efter du gick i säng.",
      err_time_travel_down = "Du kan inte ange datum för sänggång framåt i tiden.",
      err_time_travel_up = "Du kan inte ange datum för uppstigning framåt i tiden.",
      err_awake_overflow = "Du har angett att du låg vaken längre tid än du spenderat i sängen.",
      err_downtime_invalid = "Vänligen fyll i det klockslag du gick i säng.",
      err_uptime_invalid = "Vänligen fyll i det klockslag du klev upp från sängen."

const down_unix = () => { return new Date( `${ge('down_date').value} ${ge('down_time').value}`).getTime()/1000  }
const up_unix = () => { return new Date( `${ge('up_date').value} ${ge('up_time').value}`).getTime()/1000      }
const seconds_in_bed = () => {  return ( up_unix() - down_unix() ) }
const awake_seconds = () => { return ( Number(gev('awake_hours')) + Number(gev('awake_minutes' )) )  } 
const n_valid = () => { return (Array.from(document.querySelectorAll('[required=required]'))).filter( el => el.value.length > 0).length }
const append_to_error_collection = (str) => { 
  let li = document.createElement('li');
  li.innerHTML = str;
  ge('errors_collection_warning').appendChild(li);
}

const catch_change = (e)=>{ 
// Every time values change - a common and a specific action is taken.
// moment().diff('bakåt_i_tiden') = positivt nummer. Distans i sekunder från NU till diff(datum).
// moment().diff('farmåt_i_tiden') = negativt nummer
  var id = e.target.id;
  switch (id) {
    case 'down_date':
      ( moment().diff( gev(id), 'seconds') < 0 )  ? fe.add(err_time_travel_down) : fe.delete(err_time_travel_down);
      ( moment().diff( gev(id), 'days') > 3 ) ? fe.add(err_down_3_day) : fe.delete(err_down_3_day);
      break;
    
    case 'down_time':
      
      break;
    
    case 'up_date':
      ( moment().diff( gev(id), 'seconds') < 0 )  ? fe.add(err_time_travel_up) : fe.delete(err_time_travel_up); // after today
      break;

    case 'up_time':
      break;

    case 'awake_hours':
    case 'awake_minutes':
      console.log('Sekunder i sängen: ', seconds_in_bed(), 'Sekunder vaken: ', awake_seconds() );
      ( seconds_in_bed() < awake_seconds() ) ? fe.add(err_awake_overflow) : fe.delete(err_awake_overflow);
      break;
    
    case 'star1':
    case 'star2':
    case 'star3':
    case 'star4':
    case 'star5':
      ( down_unix() > up_unix() ) ? fe.add(err_reverse_time) : fe.delete(err_reverse_time);
      break;
    
    default:
      console.error('no match')
      break;
  }

  ge('errors_collection_warning').innerHTML = "";

  if(fe.size > 0) {
    ge('save_diary_button').className = "btn btn-primary btn-spara collapse";
    fe.forEach( ent => append_to_error_collection(ent) ) ;
  } else if(fe.size === 0 && document.querySelector(' [name=rate]:checked') && n_valid() >= 4 ){
    ge('save_diary_button').className = "btn btn-primary btn-spara";
  } else {
    ge('save_diary_button').className = "btn btn-primary btn-spara collapse";
  }

}

formFields.forEach( (name)=>{ ge(name).addEventListener('change', catch_change ) });
ge('down_time').addEventListener('click', catch_change );
ge('up_time').addEventListener('click', catch_change );
