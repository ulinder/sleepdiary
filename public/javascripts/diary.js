
// ##### diary.js
// #####  gör: hämtar json-posts från användaren till --> window.diaryData
// #####  draw_veckans_tips
// #####  draw_veckans_inlagg
// #####  draw_graph
// ##### document.ready



function draw_veckans_tips(data) {
  var prev_week_int = parseInt(data.current_week) - 1,
      prev_week_data,
      clon ;

  prev_week_data = data.weeks.find( x => x.w == prev_week_int );

  console.log(prev_week_data)
  temp = document.getElementById("template-veckans-tips");
  clon = temp.content.cloneNode(true);
  clon.querySelector('.effektivitet')
  .innerHTML = prev_week_data.val.avg + '%';

  document.getElementById('append_veckans_tips')
    .appendChild(clon);
}

function draw_veckans_inlagg(data) {
  var temp, clon, template, n_this_week = 0;

  data.data_table.forEach( function(element, index) {

    // TABLE with all posts
      moment.locale('sv');
      delete_button = (element.data.id) ? [{'<>':'button', 'data-id': element.data.id, class:'delete-post-button', 'html':'<i class="fa fa-trash"></i>' }]: '';
      template = {'<>':'tr','html': [
        {'<>':'td', 'html': moment(element.day).format('ww') },
        {'<>':'td', 'html': moment(element.day).format('ddd Do MMMM') },
        {'<>':'td', 'html': element.data.time_to_bed},
        {'<>':'td', 'html': element.data.time_up_from_bed},
        {'<>':'td', 'html': element.data.time_awake},
        {'<>':'td', 'html': element.data.sleep_efficiency},
        {'<>':'td', 'html': element.data.time_asleep},
        {'<>':'td', 'html': element.data.sleep_rate},
        {'<>':'td', 'html': delete_button },
      ]}

      document.getElementById('all_posts_table')
      .querySelector('tbody')
      .insertAdjacentHTML('beforeend', json2html.render({},template) );


    if(element.week === data.current_week){ // Add CARDS
      if(element.found){
        n_this_week++
        temp = document.getElementById("template-veckans-inlagg");
        clon = temp.content.cloneNode(true);
        clon.querySelector('.inlagg-datum').innerText = moment(element.day).format('ddd Do MMMM');
        clon.querySelector('.inlagg-down').innerText = `${element.data.time_to_bed} (${moment(element.data.date_to_bed).format('ddd')})`;
        clon.querySelector('.inlagg-up').innerText = `${element.data.time_up_from_bed} (${moment(element.data.date_up_from_bed).format('ddd')})`;
        clon.querySelector('.inlagg-awake').innerText = element.data.time_awake;
        clon.querySelector('.inlagg-asleep').innerText = element.data.time_asleep;
        clon.querySelector('.inlagg-rate').innerText = times(element.data.sleep_rate, '★')
        // ( for(var i=0; i<element.data.sleep_rate; i++){ return '★'} );
        clon.querySelector('.inlagg-efficiency').innerText = element.data.sleep_efficiency;
        clon.querySelector('.edit-post-link').href = `/posts/${element.data.id}/edit`;
      }
      else
      {
        temp = document.getElementsByClassName("template-veckans-inlagg-empty")[0];
        clon = temp.content.cloneNode(true);
        clon.querySelector('.inlagg-datum').innerText = element.day;
        // clon.querySelector('.edit-post-link').className = "collapse" !BUG

      }
        document.getElementById("inlagg_taget_div").appendChild(clon);
    }
  })

  // When this week is empty
  if(n_this_week == 0) document.getElementById("inlagg_taget_div").innerHTML += '<p><strong>Inga dagboksinlägg för denna vecka</strong></p>'
}


function draw_graph(data){

        document.getElementById("graphrow").classList.remove("collapse");

        var data = {
            labels: data.weeks.map( x => { return 'V' + x.w }),
            datasets:[
                {
                    label: 'Genomsnittlig sömneffektivitet',
                    fill: false,
                    backgroundColor: '#CD99D1',
                    pointRadius: 6,
                    borderColor: '#CD99D1',
                    data: data.weeks.map( x => { if(x.val.posts.length > 1) return x.val.avg })
                }
            ]
        }

        var ctx = document.getElementById('sleep-graph-canvas');
        var chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options:{
              responsive: true,
              scales: {
                y: {
                  min: 30,
                  max: 100,
                  ticks: {
                    color: 'white'
                  }
                },
                x: {
                  ticks: {
                    color: 'white'
                  }
                }
              }

            }
        });
}


function delete_post(id){

  var xhr1 = new XMLHttpRequest();
  xhr1.open('DELETE', "/posts/"+ id, true);
  xhr1.onreadystatechange = function() {
      if (this.status == 200 && this.readyState == 4) {
          console.log('Deleting looks good...');
      }
  };//end onreadystate
   xhr1.send();
}


$(document).ready( ()=>{
    const user_id = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      .split('=')[1];

      var request = new XMLHttpRequest();
      request.open('GET', '/posts/' + user_id + '/json', true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          var data = JSON.parse(this.response);
          window.diaryData = data;

          if(data.weeks.length > 0) {
            draw_veckans_inlagg(data);
            draw_graph(data);
            // draw_veckans_tips(data);
          }
          $('.delete-post-button').on('click', (el)=>{ // add after table render
            el.target.parentElement.parentElement.className = "collapse";
            console.log(el.target.dataset.id);
            delete_post(el.target.dataset.id);
          });
        } else {
          consol.error("No data was sent from server")
          // We reached our target server, but it returned an error
        }
      };

      request.onerror = function() {
        console.error("Error when trying to fetch posts from user");
      };

      request.send();

     

});

