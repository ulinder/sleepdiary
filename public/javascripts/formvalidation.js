window.formErrors = new Set();
const fe = window.formErrors;

const err_miss_rate = "Glöm inte att du behöver skatta din sömnkvalitét med antal stjärnor.",
      err_down_3_day = "Du kan inte göra en sömnregistrering av ett datum som ligger mer än 3 dagar bakåt i tiden.",
      err_reverse_time = "Du kan inte ange att du gått och lagt dig ett senare datum än det datum du angett att du klev upp.",
      err_time_travel = "Du kan inte ange att du lagt dig eller klivit upp på ett datum som ligger framåt i tiden"
      err_downtime_invalid = "Vänligen fyll i det klockslag du gick i säng."
      err_uptime_invalid = "Vänligen fyll i det klockslag du klev upp från sängen."


function show_warning(id){ document.getElementById(id).classList.remove('collapse');  }
function hide_warning(id){ document.getElementById(id).classList.add('collapse');  }

const validateForm = function (event){
  // event.preventDefault();

  console.log('staring form validation');

  // Check down / up times
  (document.getElementById("down_time").value.length != 5) ? fe.add(err_downtime_invalid) : fe.delete(err_downtime_invalid);
  (document.getElementById("up_time").value.length != 5) ? fe.add(err_uptime_invalid) : fe.delete(err_uptime_invalid);

  // Look for rated stars, by taking all stars, convert to array and see if more than 0 are checked
  if(Array.from(document.getElementsByName("rate")).filter( el => el.checked === true).length == 0){
    fe.add(err_miss_rate);
    show_warning('rate_warning');
  } else {
    hide_warning('rate_warning');
    fe.delete(err_miss_rate);
  }
  validate_sleep_date();
  validate_up_date();

  // Test distances


  if(fe.size > 0){
    event.preventDefault();
    console.error(fe);
    document.getElementById('errors-collection').innerHTML = ""
    fe.forEach( (x) => {
      li = document.createElement('li');
      li.appendChild(document.createTextNode(x));
      document.getElementById('errors-collection').appendChild(li);
    });
  } else {
    return true;
  }
}


function validate_sleep_date(){

  let downDate = document.getElementById('down_date').value;
  if(moment().diff(downDate, 'days') < 0){
    show_warning('time_travel_warning');
    fe.add(err_time_travel);
  }else {
    hide_warning('time_travel_warning');
    fe.delete(err_time_travel);
  }


  if(moment().diff(downDate, 'days') > 3){
    fe.add(err_down_3_day);
    show_warning('down_date_3_days_warning');
  } else {
    fe.delete(err_down_3_day);
    hide_warning('down_date_3_days_warning');
  }

  if( moment().format('x') < moment(downDate).format('x') )
  {
    fe.add( err_time_travel );
    // alert('Fel: Du har angett ett datum framåt i tiden! Vänligen ändra detta för att gå vidare.');
  } else{
    fe.delete( err_time_travel );
  }

}

function validate_up_date(){

    downDate = document.getElementById('down_date').value,
    up_date = document.getElementById('up_date').value;

    if( moment(up_date) > moment() ) return fe.add( err_time_travel );
    fe.delete( err_time_travel );

    if(moment(downDate) > moment(up_date)) {
      fe.add(err_reverse_time)
    } else {
      fe.delete(err_reverse_time)
    }

    if( window.diaryData.data_table.find( d => d.day === up_date  ) ){ // If date was found since before
      show_warning('up_date_warning');
      console.error('Found old date: ', up_date);
    } else {
      hide_warning('up_date_warning');
    }
}

function test_time_diff(){
    var down_date = document.getElementById('down_date').value,
        up_date = document.getElementById('up_date').value,
        up_time = document.getElementById('up_time').value,
        down_time = document.getElementById('down_time').value,
        up,
        down,
        h20 = 3600*12;

    console.log('Time diff: ', down_date, up_date, up_time, down_time);

    down = moment([down_date, down_time].join(" ") ).format("X");
    up = moment([up_date, up_time].join(" ") ).format("X");
    console.log('Time diff: ', (up - down) );
    if( (up - down) > h20 ) alert('Det verkar som du sovit längre än 12 timmar, om det inte stämmer, kontrollera dina angivna datum.')

}
