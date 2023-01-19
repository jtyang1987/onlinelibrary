const fs = require('fs');
var express = require('express');

var app = express();
app.use(express.json()); //JSON parser for post request

// Solve the security issue of sending API request through local browser
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // For POST CORS Error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});

var booksJsonFile = __dirname + '/books.json';

// Get content from a JSON file
app.get('/json_file', (req, res) => {
    try{
        let data = fs.readFileSync(`${__dirname}/${req.query.name}.json`);
        res.json(JSON.parse(data));
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

//Create JSON file
app.put('/json_file', (req, res) => {
    try{
        const fileName = __dirname + '/' + req.query.name + '.json';
        let bodyData = req.body;
        fs.open(fileName, 'r', (err, fd) => {
            fs.writeFile(fileName, JSON.stringify(bodyData), (err) => {
                if(err){console.log(err)};});
            })
        res.send({'success': 'File sucessfully created.'})
        } catch (err) {
            res.send({'error': err.toString()});
        }
});

//Update JSON file
app.post('/json_file', (req, res) => {
    try {
        const fileName = __dirname + '/' + req.query.name + '.json';
        let bodyData = req.body;
        fs.open(fileName, 'r', (err, fd) => {
            let books = JSON.parse(fs.readFileSync(fileName, 'utf8'));
            bodyData.forEach(newBook => {
                books.push(newBook);
            })
        fs.writeFileSync(fileName, JSON.stringify(books));
        })
        res.send({'success': 'File sucessfully updated.'});

    } catch (err) {
        res.send({'error': err.toString()});
    }
});

// Delete JSON file
app.delete('/json_file', (req, res) => {
    try {
        fs.unlinkSync(__dirname + '/' + req.query.name + '.json');
        res.send({'success': 'File deleted'})

    } catch(err) {
        res.send({'error': err.toString()});
    }
});



const port = 8080
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})