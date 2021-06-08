const session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);

const connection = require('./db');

var options = {
    host:'127.0.0.1',
    user:'root',
    password:'7Fb!Ve35',
    database: 'M4'
};

var sessionStore = new MySQLStore(options);

module.exports = sessionStore
