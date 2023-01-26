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
        // Can we change the books.json to req.query.name + '.json'? Need to setup req.query.name in frontend.js
        console.log(req.query)
        const fileName = __dirname + '/' + 'books.json';
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

// Get book details
app.get('/book', (req, res) => {
    try {
        let books = JSON.parse(fs.readFileSync(booksJsonFile));
        const titleName = req.query.title;
        let responseBook = {};
        books.forEach ((book, index) => {
            if (book['title'] == titleName) {
                responseBook = book
            }
        })
        if (Object.keys(responseBook).length === 0) {
            res.send({'error': `${req.query.title} is not found.`})
        } else {
            res.json(responseBook);
        }
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

// Add new book
app.put('/book', (req, res) => {
    try {
        let bookInfo = req.body;
        fs.open(booksJsonFile, 'r', (err,fd) => {
            let fileContent = JSON.parse(fs.readFileSync(booksJsonFile, 'utf8'));
            fileContent.push(bookInfo);
            fs.writeFileSync(booksJsonFile, JSON.stringify(fileContent));
        });
        res.send({'success': 'Add book successfully.'})
    } catch (err) {
        res.send({'error': err.toSting()})
    }
});

// Update book detail
app.post('/book', (req,res) => {
    try {
        let bookTitle = req.query.title;
        let bodyData = req.body;
        let found = false;
        fs.open(booksJsonFile, 'r', (err, fd) => {
            var books = JSON.parse(fs.readFileSync(booksJsonFile, 'utf8'));
            books.forEach((book, index) => {
                if (book['title']==bookTitle) {
                    found = true;
                    book['title'] = bodyData['title'];
                    book['web_url'] = bodyData['web_url'];
                    book['image_url'] = bodyData['image_url'];
                }
            })
            if (found) {
                fs.writeFileSync(booksJsonFile, JSON.stringify(books));
                res.send({'success': `${bookTitle} is successfully updated.`})
            } else {
                res.send({'error': `${bookTitle} is not found.`})
            }
        })
    } catch (err) {
        res.send({'error': err.toString()})
    }
});

// Delete book
app.delete('/book', (req, res) => {
    try {
        let bookTitle = req.query.title;
        let books = JSON.parse(fs.readFileSync(booksJsonFile, 'utf8'));
        var bookIndex = -1;
        books.forEach((book, index) => {
            if (book['title']==bookTitle) {
                bookIndex = index;
            }
        })
        if (bookIndex>-1) {
            books.splice(bookIndex, 1);
            fs.writeFileSync(booksJsonFile, JSON.stringify(books));
            res.send({'success': `${bookTitle} is successfully deleted.`})
        } else {
            res.send({'error': `${bookTitle} is not found.`})
        }
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