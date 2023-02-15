// mysql2 is an updated version of mysql, solving an authentication issue
// https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
var mysql = require("mysql2");

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "test",
    database: "test"
});

/*Connect to a server
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
*/

/*Create a new database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql="CREATE DATABASE test";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    con.end()
});
*/

/*Create a new table
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql="CREATE TABLE books (id INT AUTO_INCREMENT PRIMARY KEY," +
            "title VARCHAR(255), web_url VARCHAR(255), image_url VARCHAR(255))";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    con.end()
});
*/

/*Alter an existing table
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql="ALTER TABLE books ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table altered");
    });
    con.end()
});
*/

/*Insert into an existing table
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //var sql="INSERT INTO books (title, web_url, image_url) VALUES ('title_1', 'web_url_1', 'image_url_1')";
    var sql="INSERT INTO books (title, web_url, image_url) VALUES ?";
    var values =[
        ['title_1', 'web_url_1', 'image_url_1'],
        ['title_2', 'web_url_2', 'image_url_2'],
        ['title_3', 'web_url_3', 'image_url_3'],
        ['title_4', 'web_url_4', 'image_url_4'],
        ['title_5', 'web_url_5', 'image_url_5']
    ];
    con.query(sql, [values], function(err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    con.end()
});
*/

/*Select from an existing table
// Use mysql2.escape(var_name) or ? to escape query values
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var title = 'title_1'
    var web_url = 'web_url_2'
    //var sql="SELECT * FROM books WHERE title= " + mysql.escape(title);
    var sql="SELECT * FROM books WHERE title= ? OR web_url= ? LIMIT 2 OFFSET 3";
    con.query(sql, [title, web_url], function(err, result) {
        if (err) throw err;
        console.log(result);
    });
    con.end();
});
*/

/* Update records from an existing table
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var title = 'title_1'
    var title_change = 'title_1_changed'
    var sql="UPDATE books SET title= ? WHERE title= ?";
    con.query(sql, [title_change, title], function(err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        console.log(result)
    });
    con.end()
});
*/

/* Delete records from an existing table
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var title = 'title_1'
    var web_url = 'web_url_2'
    //var sql="SELECT * FROM books WHERE title= " + mysql.escape(title);
    var sql="DELETE FROM books WHERE title= ? OR web_url= ?";
    con.query(sql, [title, web_url], function(err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
    con.end()
});
*/

/* Drop a table only if exist
// warningStatus is 0 if table exist otherwise 1
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql="DROP TABLE IF EXISTS books";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
    con.end()
});
*/






