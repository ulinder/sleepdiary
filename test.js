function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0) ;
}

let i = Number("12");

var avg_quality_cal = (quality_array) => { 
    return (quality_array.slice(-7)
    .reduce( (accumulator, currentValue) => { return accumulator + currentValue }) / quality_array.slice(-7).length );
}

moment = require('moment');

d = moment( Date.now() ).subtract(0, 'days').format("YYYY-MM-DD");

var t = [1,2,3,4,5,6,7,8,9,10,11,12]
var s = []

console.log(t.length);
console.log( avg_quality_cal(t) );

