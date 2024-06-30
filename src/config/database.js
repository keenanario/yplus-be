let mysql = require('mysql')

let connection = mysql.createConnection({
    host:       'localhost',
    port:       8889,
    user:       'root',
    password:   'root',
    database:   'yplus'
})

connection.connect(function(error){
    if(!!error){
        console.log(error)
    }else{
        console.log('Database Connection Success!')
    }
})

module.exports = connection