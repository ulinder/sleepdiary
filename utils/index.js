module.exports = {
  link_to: function(req, path)
    {
    return `${req.protocol}://${req.get('host')}/${path}`
    }
} 

// Convert time going to bed to MINUTES SINCE START OF DAY 
// Asuming that to go to bed before getting up in the morning
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
