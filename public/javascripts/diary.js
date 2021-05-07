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

$(document).ready( ()=>{ 
    const user_id = document.cookie  .split('; ')  .find(row => row.startsWith('user='))  .split('=')[1];

      var request = new XMLHttpRequest();
      request.open('GET', '/posts/' + user_id + '/json', true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          var data = JSON.parse(this.response);
          draw_veckans_inlagg(data);
          if(data.weeks.length > 0) draw_graph(data);
            
          
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
  var temp, clon, template;

  data.data_table.forEach( function(element, index) {

    // TABLE with all posts
    
    if(element.found == null) element.found = found_dummy; // catch found = null
      moment.locale('sv');
      template = {'<>':'tr','html': [
        {'<>':'td', 'html': moment(element.day).format('ww') },
        {'<>':'td', 'html': moment(element.day).format('ddd MM') },
        {'<>':'td', 'html': element.found.time_to_bed},
        {'<>':'td', 'html': element.found.time_up_from_bed},
        {'<>':'td', 'html': element.found.time_awake},
        {'<>':'td', 'html': element.found.sleep_efficiency},
        {'<>':'td', 'html': element.found.time_asleep},
        {'<>':'td', 'html': element.found.sleep_rate},
      ]}
      
      document.getElementById('all_posts_table')
      .querySelector('tbody')
      .insertAdjacentHTML('beforeend', json2html.render({},template) );


    if(element.week === data.current_week){ // Add CARDS
      if(element.found){ 
        temp = document.getElementsByClassName("template-veckans-inlagg")[0];
        clon = temp.content.cloneNode(true);
        clon.querySelector('.inlagg-datum').innerText = element.day;
        clon.querySelector('.inlagg-down').innerText = element.found.time_to_bed;
        clon.querySelector('.inlagg-up').innerText = element.found.time_up_from_bed;
        clon.querySelector('.inlagg-awake').innerText = element.found.time_awake;
        clon.querySelector('.inlagg-asleep').innerText = element.found.time_asleep;
        clon.querySelector('.inlagg-asleep').innerText = element.found.time_asleep;
        clon.querySelector('.inlagg-efficiency').innerText = element.found.sleep_efficiency;
      } 
      else
      {
        temp = document.getElementsByClassName("template-veckans-inlagg-empty")[0];
        clon = temp.content.cloneNode(true);
        clon.querySelector('.inlagg-datum').innerText = element.day;
      }
        document.getElementById("inlagg_taget_div").appendChild(clon);
        }
  })
}


function draw_graph(data){

        var data = {
            labels: data.weeks.map( x => { return 'V' + x.w }),
            datasets:[
                {
                    label: 'Genomsnittlig sömneffektivitet',
                    fill: false,
                    backgroundColor: '#CD99D1',
                    pointRadius: 6,
                    borderColor: '#CD99D1',
                    data: data.weeks.map( x => { return x.val.avg })
                }
            ]
        }

        var ctx = document.getElementById('sleep-graph-canvas');
        Chart.defaults.global.defaultFontColor='white';
        Chart.defaults.global.defaultFontSize=14;
        var chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options:{
                scales:{
                  y:{
                    suggestedMin: 0,
                    suggestedMax: 100
                  }
                },
                plugins:{
                    legend: {
                        // position: 'top',
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Sömnkvalitét'
                    },
                },
                animations: {
                  tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                  }
                },
                layout:{
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                    }
                }
            }
        });
}

function validateDiary(){
  console.log("validating form");
  var form_validity = false;
  // Look for rated stars
  document.getElementsByName("rate").forEach( (el)=>{ if(el.checked) form_validity=true })
  console.log("Form valid: ", form_validity);
  return form_validity;
}
