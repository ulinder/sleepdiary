const reducer = (accumulator, currentValue) => accumulator + currentValue;

var m = {"weeks":{"map":{"14":[84],"15":[90,88],"16":[89],"17":[92,88,84,83,87,98],"18":[88],"19":[98,83]},"current_week":"19"}}

m["weeks"]["map"].forEach( (element, key, map)=>{
  console.log(element.reduce(reducer));
});
