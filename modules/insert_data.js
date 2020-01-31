const db = require('./db_connect')
function insertData(query, params) {
    return new Promise(resolve => {
        db.query(query, params, function (err, result) {
            if (err) throw err
            resolve(JSON.parse(JSON.stringify(result)))
        })
    })
}
module.exports = insertData