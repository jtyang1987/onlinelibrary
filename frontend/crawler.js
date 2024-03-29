var books = [];
const HOST = 'localhost';

function parseBooks() {
    var defaultURL = "https://www.goodreads.com/search?q=programming";
    var newContent = `<h3>Douban Book Crawler</h3>` +
                     `<div><label>Book List URL:</label><input id="bookListURL" value=${defaultURL} type="text" size="50"></input></div>` +
                     `<div><button class='btn btn-success' onClick=parseURL() style="float:middle">Parse Books</button></div>`;
    document.getElementById("main-content").innerHTML = newContent;
};

function parseURL() {
    var url = document.getElementById("bookListURL").value;
    document.getElementById("main-content").innerHTML =
    '<div style="width: 3rem; height: 3rem;" class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>' +
    '<h4>Crawling Books...</h4>';
    var xhttp = new XMLHttpRequest();
    // arrow function "= () => {}" doesn't work???
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayBooks(this);
        }
    };
    xhttp.open("GET", `http://${HOST}:8081/crawler?url=${url}`, true);
    xhttp.send();
};

function displayBooks(xhttp) {
    books = JSON.parse(xhttp.responseText);
    var newContent = `<div><button class="btn btn-success" onClick=addAllBooks()>Add All Books</button></div>`;
    newContent += "<table><tbody>";
    // arrow function "(book) => {}" work!!!
    books.forEach((book) => {
        newContent += `<tr>` +
                      `<td rowspan="3"><a target="_blank" href="${book.web_url}"><img id="bookImage" src="${book.image_url}"></a></td>` +
                      `<td class="bookTitle">Title: ${book.title}</td></tr>` +
                      `<tr class="bookWebURL"><td>Web URL: ${book.web_url}</td></tr>` +
                      `<tr class="bookImageURL"><td>Image URL: ${book.image_url}</td></tr>`;
    });
    newContent += "</tbody></table>";
    document.getElementById("main-content").innerHTML = newContent;
};

function addAllBooks() {
    const crawlerURL = `http://${HOST}:3000`;
    var xhttp = new XMLHttpRequest();
    // This doesn't work if POST /json_file function setup with req.query.name instead of books.json. How to setup req.query.name here?
    xhttp.open("PUT", `${crawlerURL}/books/`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(books));
    document.getElementById("main-content").innerHTML = `<h1>Added Another ${books.length} Books!</h1>`;
    books = [];
}
