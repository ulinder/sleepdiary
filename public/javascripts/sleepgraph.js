var sleep_time_to_minutes = (timeStr)=>{
    timeStr = timeStr.split(":");
    timeStr[0] = (timeStr[0] < 12) ? (timeStr[0] + 24) : timeStr[0]; // convert to 60 hour clock
    timeStr[0] = timeStr[0] * 60 // convert hours to minutes
    return Number(timeStr[0]) + Number(timeStr[1]); // return as minutes
}

var wake_time_to_minutes = (timeStr)=>{
    timeStr = timeStr.split(":");
    timeStr[0] = (Number(timeStr[0]) + 24); // convert to 48 hour clock
    timeStr[0] = timeStr[0] * 60 // convert hours to minutes
    return Number(timeStr[0]) + Number(timeStr[1]); // return as minutes
}

var quality_calc = (down, up, awake) => {
    var minutes_in_bed = (wake_time_to_minutes(up) - sleep_time_to_minutes(down));
    return Number( ((minutes_in_bed - awake)/minutes_in_bed*100).toFixed(0) );
}

var avg_quality_cal = (quality_array) => { 
    return ( quality_array.slice(-7)
    .reduce( (accumulator, currentValue) => { return accumulator + currentValue }) / quality_array.slice(-7).length ).toFixed(0);
}


$(document).ready(function(){

        var color = Chart.helpers.color;
        var quality;
        var data = {
            labels: [],
            datasets:[
                {
                    label: 'Daglig sömnkvalitét',
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: []
                },
                {
                    label: 'Genomsnittlig sömnkvalitét',
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    data: []
                }
            ]
        }

        var first_date = 0, 
            last_date, 
            posts_table = [], 
            week_table = [],
            current_date;
        // GENERATE DATA
        JSON.parse($('#hidden_postdata').val()).map( (post) => {
            quality = quality_calc(post.down, post.up, post.awake);
            data.datasets[0].data.push(quality)
            data.datasets[1].data.push( avg_quality_cal(data.datasets[0].data) )
            console.log(data.datasets[0].data, data.datasets[1].data);
            data.labels.push( moment(post.date).format("DD MMM") );
            if(first_date == 0) first_date = post.date;
            last_date = post.date;
            // data.datasets[1].data.push({x: post.date, y: post.rate})    
        });
      
        // create a table of dates between first and last post
        // current_date = moment(first_date);
        for (var i=0; i < 60; i++) {
            current_date = moment(first_date).add(i, 'days').format("YYYY-MM-DD");
            posts_table.push( current_date );
            if(current_date == moment(last_date).format("YYYY-MM-DD")) break; 
        }

        let week;
        for (var i = 0; i < 10; i++) {
            week = posts_table.slice( (i*7), (i*7+7) );
            if(week.length == 0) break;
            week_table.push( week )
        }

        console.log(posts_table, week_table);

        var ctx = document.getElementById('sleepcanvas');
        var chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options:{
                plugins:{
                    legend: {
                        position: 'top',
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
});
