function draw_graph(data){

        document.getElementById("graphrow").classList.remove("collapse");

        var data1 = {
            labels: data.weeks.map( x => { return 'V' + x.w }),
            datasets:[
                {
                    label: 'Genomsnittlig sömneffektivitet',
                    fill: false,
                    backgroundColor: '#CD99D1',
                    pointRadius: 6,
                    borderColor: '#CD99D1',
                    data: data.weeks.map( x => { if(x.val.se_arr.length > 1) return x.val.avg_sleep_efficiency })
                },
            ]
        }


        var data_avg_sleptime = {
            labels: data.weeks.map( x => { return 'V' + x.w }),
            datasets:[
                {
                    label: 'Genomsnittlig sömntid',
                    fill: false,
                    backgroundColor: '#6E90C4',
                    pointRadius: 6,
                    borderColor: '#6E90C4',
                    data: data.weeks.map( x => { if(x.val.sleep_time_arr.length > 1) return x.val.avg_sleep_time })
                }
            ]
        }

        console.log(data_avg_sleptime);

        var se_graph = new Chart(document.getElementById('sleep-efficiency-canvas'), {
            type: 'line',
            data: data1,
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

        var se_graph = new Chart(document.getElementById('avg-sleep-time-canvas'), {
            type: 'line',
            data: data_avg_sleptime,
            options:{
              responsive: true,
              scales: {
                y: {
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


} // draw-graph-function