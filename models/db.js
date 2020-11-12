const mysql = require('mysql');

// create a connection pool to be shared in all of my routes/files
// TODO: Figure out how to create a pool with the connection string
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '142.11.202.232',
    user: 'ihpcevsl_OneLineUser',
    password: 'mM95cuXTeV$t',
    database: 'ihpcevsl_OneLine'
});

module.exports = pool;