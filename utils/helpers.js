
var down_time_to_minutes = (timeStr)=>{
    timeStr = timeStr.split(":");
    timeStr[0] = (timeStr[0] < 12) ? (timeStr[0] + 24) : timeStr[0]; // convert to 48 hour clock
    timeStr[0] = timeStr[0] * 60 // convert hours to minutes
    return Number(timeStr[0]) + Number(timeStr[1]); // return as minutes
}

var up_time_to_minutes = (timeStr)=>{ // simulating a 48 hour clock
    timeStr = timeStr.split(":");
    timeStr[0] = (Number(timeStr[0]) + 24); // asuming you get up after midnight
    timeStr[0] = timeStr[0] * 60 // convert hours to minutes
    return Number(timeStr[0]) + Number(timeStr[1]); // return as minutes
}

var quality_calc = (down, up, awake) => {
    var minutes_in_bed = (up_time_to_minutes(up) - down_time_to_minutes(down));
    return Number( ((minutes_in_bed - awake)/minutes_in_bed*100).toFixed(0) );
}

var avg_quality_cal = (quality_array) => { 
    return ( quality_array.slice(-7)
    .reduce( (accumulator, currentValue) => { return accumulator + currentValue }) / quality_array.slice(-7).length ).toFixed(0);
}

const seconds_to_text = (time) => {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + "h ";
    }
    ret += "" + mins + "min";   
    return ret;
}

const arrSum = (accumulator, currentValue) => accumulator + currentValue;  

const link_to = (req, path) =>{
  return `${req.protocol}://${req.get('host')}/${path}`
}

const seconds_to_block_of = (type, seconds) => { // type => [h/m]
  if(type.match(/h|m/)){
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    return (type == "h") ? hrs : mins;
  } 
  console.error('Fail in seconds to block');
}

function times(count, callbackOrScalar) {
    let type = typeof callbackOrScalar
    let sum
    if (type === 'number') sum = 0
    else if (type === 'string') sum = ''

    for (let j = 0; j < count; j++) {
        if (type === 'function') {
            const callback = callbackOrScalar
            const result = callback(j, count)
            if (typeof result === 'number' || typeof result === 'string')
                sum = sum === undefined ? result : sum + result
        }
        else if (type === 'number' || type === 'string') {
            const scalar = callbackOrScalar
            sum = sum === undefined ? scalar : sum + scalar
        }
    }
    return sum
}
module.exports = { arrSum, link_to, seconds_to_block_of, seconds_to_text, times }
