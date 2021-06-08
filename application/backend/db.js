 const mysql = require('mysql2');

const connection = mysql.createPool({
    connectionLimit: 100,
    host:'127.0.0.1',
    user:'root',
    password:'7Fb!Ve35',
    database: 'M4'
});

module.exports = connection

