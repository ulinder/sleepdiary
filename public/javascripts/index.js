$(document).ready( function(){

  $('.clockpicker').clockpicker();

  // $('#awake-slider').on('input', function(){ // Wake slider change
  //   let awake = $('#awake-slider').val();
  //   let mess = "";
  //   if(awake > 0){
  //     let awake_arr = awake.split(".");
  //     mess = `${awake_arr[0]} timmar`;
  //     if(awake_arr[1]){
  //       mess = mess + `, ${ (awake - awake_arr[0]) *60  } minuter`;
  //     }
  //   }
  //   $('#awake-slider-target').val(mess);
  // });

  $('#awake-slider').on('input', function(){ // Wake slider change
    let awake = $('#awake-slider').val();
    let mess = "";
    if(awake > 0){
      let awake_arr = String(awake/60).split(".");
      mess = `${awake_arr[0]} timmar`;
      if(awake_arr[1]){
        mess = mess + `, ${ String( awake - (awake_arr[0]*60) ).split(".")[0]  } minuter`;
      }
    }
    $('#awake-slider-target').val(mess);
  });



  $('#hidden_postdata').on( 'input', check_form() );
  // check_form();

});

const check_form = function() {
  // CHECK IF SELECTED DATE WAS REGISTRED ALREADY
  if( $('#morning_date').length && $('#hidden_postdata').length ){

    var post_array = JSON.parse($('#hidden_postdata').val());
    var set_date_find = post_array.find(el => el.date == $('#morning_date').val());
    if(set_date_find){ 
      console.log(set_date_find); 
      $('.disabler').hide();
      $('.message-div').append("<strong>Denna dag finns sparad sedan innan</strong>")

    } else {
      $('.disabler').show();
      $('.message-div').empty();
      
    }
  }
}

