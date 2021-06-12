const session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);

const connection = require('./db');

var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

module.exports = sessionStore
