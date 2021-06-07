window.formErrors = new Set();


const err_miss_rate = "Du behöver skatta din sömnkvalitét med antal stjärnor.",
      err_down_5_day = "Du kan inte göra en skattning efter det gått 5 dagar.",
      err_reverse_time = "Du kan inte ange att du gått och lagt dig efter datumet för när du klev upp.",
      err_time_travel = "Du har anget att du gått och lagt dig, eller klivit upp efter idag."

function validateForm(event){
  // event.preventDefault();
  var fe = window.formErrors,
      form_valid;
  console.log('Starting to validate form');
  // Look for rated stars
  document.getElementsByName("rate").forEach( (el)=>{ if(el.checked) form_valid=true })
  if(!form_valid){
    fe.add(err_miss_rate)
    document.getElementById('rate_warning').classList.remove('collapse');
  } else {
    document.getElementById('rate_warning').classList.add('collapse');
    fe.delete(err_miss_rate)
  }
  
  if(fe.size > 0)
  {
    event.preventDefault();
    console.error(fe);
    alert('Innan du sparar behöver du åtgärda följande fel: ' + fe )
  } 

  return true;
  
}

function validate_sleep_date(){
  
  let downDate = document.getElementById('down_date').value;
  var fe = window.formErrors;

  if(moment().diff(downDate, 'days') > 5){ 
    fe.add(err_down_5_day);
    document.getElementById('down_date_5_days_warning').classList.remove('collapse');
  } else { 
    fe.delete(err_down_5_day);
    document.getElementById('down_date_5_days_warning').classList.add('collapse');
  }
  
  if( moment().format('x') < moment(downDate).format('x') ) 
  {
    fe.add( err_time_travel );
    alert('Fel: Du har angett ett datum framåt i tiden! Vänligen ändra detta för att gå vidare.');
  } else{
    fe.delete( err_time_travel );
  }

}

function validate_up_date(){ 

  var fe = window.formErrors,
      downDate = document.getElementById('down_date').value,
      upDate = document.getElementById('up_date').value;

    if(moment(downDate) > moment(upDate)) {
      fe.add(err_reverse_time)
      alert('Fel: Du har angett att du la dig i sängen efter du klev upp. Kontrollera dina datum innan du går vidare');
    } else{
      fe.delete(err_reverse_time)
    }

    if( (window.diaryData.data_table.find( d => d.day == upDate )).found ) { // If date was found since before
      document.getElementById('up_date_warning').classList.remove('collapse');
      console.error('Found old date: ', upDate);
    } else {
      document.getElementById('up_date_warning').classList.add('collapse');
    }
}