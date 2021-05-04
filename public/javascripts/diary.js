function validateDiary(){
  console.log("validating form");
  var form_validity = false;
  // Look for rated stars
  document.getElementsByName("rate").forEach( (el)=>{ if(el.checked) form_validity=true })
  console.log("Form valid: ", form_validity);
  return form_validity;
}

$(document).ready( ()=>{
    const user_id = document.cookie  .split('; ')  .find(row => row.startsWith('user='))  .split('=')[1];

      var request = new XMLHttpRequest();
      request.open('GET', '/posts/' + user_id + '/json', true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          var data = JSON.parse(this.response);
          draw_veckans_inlagg(data.posts_table);

        } else {
          // We reached our target server, but it returned an error
        }
      };

      request.onerror = function() {
        console.error("Error when fetching posts from user");
      };

      request.send();
})

function draw_veckans_inlagg(data) {
  data.forEach( function(element, index) {
      var temp = document.getElementsByClassName("template-veckans-inlagg")[0];
      var clon = temp.content.cloneNode(true);
      document.getElementById("inlagg_taget_div").appendChild(clon);
  });
}
