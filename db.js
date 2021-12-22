var sqlite3 = require('sqlite3').verbose()
var _env = (process.env.NODE_ENV) ? process.env.NODE_ENV : "development";
const DBSOURCE = `${__dirname}/${_env}.sleepdiary.sqlite`

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) { // Cannot open database
      console.error(err.message)
      throw err
    }
});

db.query = function (sql, params) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error)
        reject(error);
      else
        resolve(rows);
    });
  });
};

db.firstUser = function () {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.get("SELECT * FROM users LIMIT 1", function(error, row){
      if (error)
        reject(error);
      else
        resolve(row);
    });
  })
}

if(process.env.NODE_ENV === "development") db.on('trace', trace => console.log(trace) )

module.exports = db
