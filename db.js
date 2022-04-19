require('dotenv').config()
var sqlite3 = require('sqlite3').verbose()
if(process.env.NODE_ENV == 'undefined') throw('process.env.NODE_ENV is undefined');
const DBSOURCE = `${__dirname}/${process.env.NODE_ENV}.sleepdiary.sqlite`;

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

db.getUserById = function (user_id) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.get("SELECT * FROM users WHERE id = ?", [user_id], function(error, row){
      if (error)
        reject(error);
      else
        resolve(row);
    });
  })
}

if(process.env.NODE_ENV === "development") db.on('trace', trace => console.log(trace) )

module.exports = db
