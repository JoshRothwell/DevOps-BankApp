const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8635000',
  password: '4R82LQKGNc',
  database: 'sql8635000',
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database!');
    connection.release();
  }
});
