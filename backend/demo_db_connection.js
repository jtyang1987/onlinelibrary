//https://www.w3schools.com/nodejs/nodejs_mysql.asp

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "Admin123!"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});