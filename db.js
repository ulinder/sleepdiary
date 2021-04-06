var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = __dirname + "/sleepdiary.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) { // Cannot open database
      console.error(err.message)
      throw err
    }   
});

module.exports = db
