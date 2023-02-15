const fs = require('fs');
var express = require('express');
var mysql = require('mysql2');
var config = require('./config')

var app = express();
app.use(express.json()); //JSON parser for post request

// Connect to a mysql server
var con = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user_name,
    password: config.mysql.password,
    database: config.mysql.database
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Databse Connected!");
});

// Solve the security issue of sending API request through local browser
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // For POST CORS Error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});

// Get content from a table
// Another function needs to be added is to check if the given table exsits
// Otherwise a non exsiting table name will break the server
app.get('/table', (req, res) => {
    try{
        var sql="SELECT * FROM " + req.query.name;
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
        });
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

// Create a new table with given content
// Another function needs to be added is to check if the given table exsits
// Otherwise an exsiting table name will break the server
app.put('/table', (req, res) => {
    try{
        var sql="CREATE TABLE " + req.query.name +
                " (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255)," +
                " web_url VARCHAR(255), image_url VARCHAR(255))";
        con.query(sql, function(err, result) {
            if (err) throw err;
        });
        console.log("New table created");

        var sql="INSERT INTO books SET ?";
        for (let i=0; i<req.body.length; i++) {
            con.query(sql, req.body[i], function(err, result) {
                if (err) throw err;
            });
        };
        console.log("Number of records inserted: " + req.body.length);
        res.send({'success': 'Table sucessfully created.'})
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

//Update a table
app.post('/table', (req, res) => {
    try {
        var sql="INSERT INTO books SET ?";
        for (let i=0; i<req.body.length; i++) {
            con.query(sql, req.body[i], function(err, result) {
                if (err) throw err;
            });
        };
        console.log("Number of records inserted: " + req.body.length);
        res.send({'success': 'Table sucessfully updated.'})
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

// Delete a table
app.delete('/table', (req, res) => {
    try {
        var sql="DROP TABLE IF EXISTS " + req.query.name;
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send({'success': `Table '${req.query.name}' deleted`})
        });
    } catch(err) {
        res.send({'error': err.toString()});
    }
});

// Get book details
// Select all books with same given title first then return the first record
// The duplication of title issue needs to be solved later
// Ideally there are not books with same title
app.get('/tbook', (req, res) => {
    try {
        var sql="SELECT * FROM books WHERE title= ?";
        con.query(sql, [req.query.title], function(err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length === 0) {
                res.send({'error': `${req.query.title} is not found.`})
            } else {
                res.json(result[0]);
            }
        });
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

// Add new book (only one)
// Adding multiple books could use "Update a table"
app.put('/tbook', (req, res) => {
    try {
        var sql="INSERT INTO books SET ?";
        con.query(sql, req.body, function(err, result) {
            if (err) throw err;
        });
        console.log("Number of records inserted: " + req.body.length);
        res.send({'success': 'Add book successfully.'})
    } catch (err) {
        res.send({'error': err.toSting()})
    }
});

// Update book detail
// book title checking fucntion needs to be added
app.post('/tbook', (req,res) => {
    try {    
        var sql="UPDATE books SET title=?, web_url=?, image_url=? WHERE title= ?";
        var condition = [ req.body['title'],
                          req.body['web_url'],
                          req.body['image_url'], 
                          req.query.title];
        con.query(sql, condition, function(err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        res.send({'success': `${req.query.title} is successfully updated.`})
    });
    } catch (err) {
        res.send({'error': err.toString()})
    }
});

// Delete book
// book title checking fucntion needs to be added
app.delete('/tbook', (req, res) => {
    try {
        var sql="DELETE FROM books WHERE title=" + mysql.escape(req.query.title);
        con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.send({'success': `${req.query.title} is successfully deleted.`})
    });
    } catch (err) {
        res.send({'error': err.toString()})
    }
});

const port = 8080

// static Files (https://www.youtube.com/watch?v=A01KtJTv1oc)
app.use(express.static(__dirname + '/frontend'))
app.use('/css', express.static(__dirname + '/frontend/css'))
app.use('/js', express.static(__dirname + '/frontend/js'))
//app.use('/img', express.static(__dirname + '/frontend/img'))

//__dirname + '/../frontend/home.html' doesn't work
app.get('', (req, res) => {
    res.sendFile(__dirname + '/frontend/home.html')
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})