const mysql = require('mysql');

// create a connection pool to be shared in all of my routes/files
// TODO: Figure out how to create a pool with the connection string
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mariadb',
    user: 'user',
    password: 'test',
    database: 'oneline-db'
});

module.exports = pool;