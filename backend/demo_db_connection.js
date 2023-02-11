//https://www.w3schools.com/nodejs/nodejs_mysql.asp

var mysql = require('mysql');
var config = require('./config')

// var con = mysql.createConnection({
//   host: "node-mysql-db.cj6ugv9emffe.ap-northeast-1.rds.amazonaws.com",
//   user: "libraryAdmin",
//   password: "YangLib123!"
// });

var con = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user_name,
  password: config.mysql.password,
  database: config.mysql.database
});

var sql = "select title from books;"

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function(err, result){
    if (err) throw err;
    res = JSON.stringify(result);
    var arr = JSON.parse(res);
    console.log(arr);
    arr.forEach(function(book){
      var title = book.title;
      console.log(title);
    });
  });
  con.end();
});