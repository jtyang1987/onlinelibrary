const db = require("../config/db");

class Book {
    constructor(title, web_url, image_url) {
        this.title = title;
        this.web_url = web_url;
        this.image_url = image_url
    }

    save() {
        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDate();

        let createdAtDate = `${yyyy}-${mm}-${dd}`;

        let sql = `
        INSERT INTO books(
            title,
            web_url,
            image_url,
            created_at
        ) 
        VALUES (
            '${this.title}',
            '${this.web_url}',
            '${this.image_url}',
            '${createdAtDate}'
        );
        `;
        return db.execute(sql);
    }

    update(book_title) {
        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() +1;
        let dd = d.getDate();

        let createdAtDate = `${yyyy}-${mm}-${dd}`;

        let sql = `
        UPDATE books
        SET title = '${this.title}',
            web_url = '${this.web_url}',
            image_url = '${this.image_url}',
            created_at = '${createdAtDate}'
        WHERE title = '${book_title}';
        `;
        return db.execute(sql)
    }

    delete(title) {
        let sql = `
        DELETE FROM books
        WHERE title = '${title}';
        `;
        return db.execute(sql)
    }

    static findAll() {
        let sql = `SELECT title, 
                          web_url,
                          image_url,
                          created_at
                   FROM books;`;
        return db.execute(sql);
    }

    static findByTitle(title) {
        let sql = `SELECT title, 
                          web_url,
                          image_url,
                          created_at
                   FROM books
                   where title = '${title}';`;
        return db.execute(sql);
    }
}

module.exports = Book;