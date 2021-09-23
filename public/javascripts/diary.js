$(document).ready( ()=>{

  $('.clockpicker').clockpicker();

  if(document.getElementById('diaryform')) document.getElementById('diaryform').onsubmit = validateForm;

    const user_id = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
    .split('=')[1];

      var request = new XMLHttpRequest();
      request.open('GET', '/posts/' + user_id + '/json', true);
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var data = JSON.parse(this.response);
          window.diaryData = data;
          if(data.data_table.length > 0) {
            draw_graphs(data);
            draw_streaks(data);
            // draw_veckans_inlagg(data);
            // draw_veckans_tips(data);
          }  
        }else{
          consol.error("No data was sent from server")
        }
      };
      request.onerror = function() {
        console.error("Error when trying to fetch posts from user");
      };
      request.send();

  $('.delete-me').on('click', (el)=>{ // add after table render
    var target_id = el.currentTarget.value;
    if(target_id){
      if(confirm('Är du säker att du vill radera denna dag?')) {
        delete_post(target_id, `row-for-${target_id}` );
      }
    } else {
      console.error(`No id for delete: ${target_id}`)
    } 
  });
     

});

