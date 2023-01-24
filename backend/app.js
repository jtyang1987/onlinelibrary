const http = require('http')
const fs = require('fs')
const port = 3000

const server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.readFile(__dirname + '/../frontend/home.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found')
        } else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, function() {
    console.log(`Server listening at http://localhost:${port}`)
})