/* import HOST from .env doesn't work in the API
require("dotenv").config();
const HOST = process.env.HOST;
*/

const HOST = 'localhost';

function loadBooks() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayData(this);
        };
    };
    xhttp.open("GET", `http://${HOST}:3000/books`, true);
    xhttp.send();
}

function displayData(xhttp) {
    var books =JSON.parse(xhttp.responseText);
    var newContent = "<div class='booksGallery'>";
    books.forEach(function(book) {
        var processedTitle = book.title;
        if (processedTitle.length > 15) {
            processedTitle = processedTitle.substring(0, 15) + '...';
        }
        newContent += `<div class="gallery"><a target="_blank" href="${book.web_url}">` +
                      `<img id="bookImage" src="${book.image_url}" width="600" height="400"></a>` +
                      `<div onClick=getBookDetails('${book.title.replace(/\s/g, '%20')}') class="galleryTitle">${processedTitle}</div></div>`;
    })
    newContent += "</div>";
    document.getElementById("main-content").innerHTML = newContent;
}

function getBookDetails(bookTitle) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayBookDetail(bookTitle, this);
        }
    };
    xhttp.open("GET", `http://${HOST}:3000/books/${bookTitle}`, true);
    xhttp.send();
}

function displayBookDetail(bookTitle, xhttp) {
    var jsonData = JSON.parse(xhttp.responseText);
    var imageUrl = jsonData.image_url;
    var webUrl = jsonData.web_url;
    var newContent = `<img id="bookImage" src="${imageUrl}"></a>`;
    newContent += `<div><label>Title:</label><input id="titleInput" type="text" value='${bookTitle.replaceAll('%20', ' ')}' size='50'></input></div>`;
    newContent += `<div><label>Web URL:</label><input id="webUrlInput" type="text" value='${webUrl}' size='50'></input></div>`;
    newContent += `<div><label>Image URL:</label><input id="imageUrlInput" type="text" value='${imageUrl}' size='50'></input></div>`;
    newContent += `<div><button class="btn btn-success" onClick=updateBook('${bookTitle}') style="float:middle; margin-right: 50px;">Update</button>` +
                  `<button class="btn btn-danger" onClick=deleteBook('${bookTitle}') style="float:middle">Delete</button></div></div>`;
    document.getElementById("main-content").innerHTML = newContent;
}

function updateBook(originalTitle) {
    var newTitle = document.getElementById('titleInput').value;
    var newWebUrl = document.getElementById('webUrlInput').value;
    var newImageUrl = document.getElementById('imageUrlInput').value;
    var newJSON = {'title': newTitle, 'web_url': newWebUrl, 'image_url': newImageUrl};
    updateBookInJSON(originalTitle, newJSON);
}

function updateBookInJSON(originalTitle, newJSON) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://${HOST}:3000/books/${originalTitle}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newJSON));
    document.getElementById("main-content").innerHTML = `<h1>Book Updated!</h1>`;
}

function deleteBook(bookTitle) {
    if (confirm(`DO you want to delete the book "${bookTitle}"?`)) {
        deleteBookInJSON(bookTitle);
    }
}

function deleteBookInJSON(bookTitle) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://${HOST}:3000/books/${bookTitle}`, true);
    xhttp.send();
    document.getElementById("main-content").innerHTML = `<h1>"${bookTitle}" Deleted!</h1>`;
}

function addNewBook() {
    var newContent = `<div><label>Title:</label><input id='titleInput' type='text' value='bookTitle' size='50'></input></div>`;
    newContent += `<div><label>Web URL:</label><input id='webUrlInput' type='text' value='webUrl' size='50'></input></div>`;
    newContent += `<div><label>Image URL:</label><input id='imageUrlInput' type='text' value='imageUrl' size='50'></input></div>`;
    newContent += `<div><button class="btn btn-warning" onClick=addBook() style='float:middle'>Add New Book</button></div></div>`;
    document.getElementById("main-content").innerHTML = newContent;
}

function addBook() {
    var title = document.getElementById("titleInput").value;
    var webUrl = document.getElementById("webUrlInput").value;
    var imageUrl = document.getElementById("imageUrlInput").value;
    var newJSON = {'title': title, 'web_url': webUrl, 'image_url': imageUrl};
    addBookInJSON(newJSON);
}

function addBookInJSON(newBook) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://${HOST}:3000/books`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newBook));
    document.getElementById("main-content").innerHTML = `<h1>New Book Added!</h1>`;
}
