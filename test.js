function format(time) {   
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + "h ";
    }
    ret += "" + mins + "min";   
    return ret;
}


// console.log(Date.now()/3600000/24/365);
m = require('moment');

console.log( format(7340) );
