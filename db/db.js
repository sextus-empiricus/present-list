const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'b2eede51e4084b',
    password: '38a457a3',
    port: '3306',
    database: 'heroku_6ea69dfd574352f',
    decimalNumbers: true,   // - decimal isn't a string anymore;
    namedPlaceholders: true, // - use placeholders;
})

module.exports = {
    pool,
}