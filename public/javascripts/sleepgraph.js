
// SLEEPING for now 
// 
// $(document).ready(function(){

//         var color = Chart.helpers.color;
//         var quality;
//         var data = {
//             labels: [],
//             datasets:[
//                 {
//                     label: 'Daglig sömnkvalitét',
//                     fill: false,
//                     backgroundColor: 'blue',
//                     borderColor: 'blue',
//                     data: []
//                 },
//                 {
//                     label: 'Genomsnittlig sömnkvalitét',
//                     fill: false,
//                     backgroundColor: 'green',
//                     borderColor: 'green',
//                     data: []
//                 }
//             ]
//         }

//         var first_date = 0, 
//             last_date, 
//             posts_table = [], 
//             week_table = [],
//             current_date;
//         // GENERATE DATA
//         JSON.parse($('#hidden_postdata').val()).map( (post) => {
//             quality = quality_calc(post.down, post.up, post.awake);
//             data.datasets[0].data.push(quality)
//             data.datasets[1].data.push( avg_quality_cal(data.datasets[0].data) )
//             console.log(data.datasets[0].data, data.datasets[1].data);
//             data.labels.push( moment(post.date).format("DD MMM") );
//             if(first_date == 0) first_date = post.date;
//             last_date = post.date;
//             // data.datasets[1].data.push({x: post.date, y: post.rate})    
//         });


//         var ctx = document.getElementById('sleepcanvas');
//         var chart = new Chart(ctx, {
//             type: 'line',
//             data: data,
//             options:{
//                 plugins:{
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Sömnkvalitét'
//                     },
//                 },
//                 animations: {
//                   tension: {
//                     duration: 1000,
//                     easing: 'linear',
//                     from: 1,
//                     to: 0,
//                     loop: true
//                   }
//                 },
//                 layout:{
//                     padding: {
//                         left: 20,
//                         right: 20,
//                         top: 20,
//                     }
//                 }
//             }
//         });
// });
