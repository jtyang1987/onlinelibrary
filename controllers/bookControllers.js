const Book = require("../models/Book");

exports.getAllbooks = async (req, res, next) => {
    try {
        const [books, _] = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.createNewbook = async (req, res, next) => {
    try {
        let {title, web_url, image_url} = req.body;
        let book = new Book(title, web_url, image_url);

        book = await book.save()
        res.status(201).json({message: `New book with title ${title} is created.`})
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.createNewbooks = async (req, res, next) => {
    try {
        let books = req.body;
        for (let i=0; i<books.length; i++) {
            let book = new Book(books[i].title, books[i].web_url, books[i].image_url);
            book = await book.save();
            };
        console.log("Number of records inserted: " + req.body.length);
        res.send({message: `${books.length} books are created.`})
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getBookByTitle = async (req, res, next) => {
    try {
        let title = req.params.title;
        const [book, _] = await Book.findByTitle(title);
        res.status(200).json(book[0])
    } catch (error) {
        console.log(error);
        next(error);       
    }
};

exports.updateBookByTitle = async (req, res, next) => {
    try {
        let book_title = req.params.title;
        let {title, web_url, image_url} = req.body;
        let book = new Book(title, web_url, image_url);

        book = await book.update(book_title)
        res.status(201).json({message: `Book with title ${book_title} is updated.`})
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.deleteBookByTitle = async (req, res, next) => {
    try {
        let title = req.params.title;
        let book = new Book(title)
        book = await book.delete(title);
        res.status(201).json({message: `Book with title ${title} is deleted.`})
    } catch (error) {
        console.log(error);
        next(error);
    }
};