
const puppeteer = require('puppeteer');
var express = require('express');

var app = express();
app.use(express.json()); //JSON parser for post request
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    next();
});

var books = [];

async function scrapeGoodReads(url, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Get hrefs
    var hrefs = await Promise.all((await page.$$('a.bookTitle')).map(async a => {
        return await (await a.getProperty('href')).jsonValue();
    }));
    //console.log(hrefs);
    hrefs.slice(0,2).forEach(async href => {
        getBookInfo(href, hrefs.length/2, res);
    });
    browser.close();
};

async function getBookInfo(url, length, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Get image url
    try { 
        const [image] = await page.$x('//*[@id="__next"]/div/main/div[1]/div[1]/div/div[1]/div/div/div/div/div/div/img');
        var src = await image.getProperty('src');
        var txt = await src.jsonValue();
    } catch(err) { var txt = 'Not Found!' } 
    try {
        var title = await page.$('[data-testid="bookTitle"]');
        var text = await (await title.getProperty('textContent')).jsonValue();
    } catch (err) { var text = 'Not Found!'}
    var newObj = {
        'title': text.trim(),
        'web_url': url,
        'image_url': {txt}.txt
    };
    console.log(newObj)
    books.push(newObj);
    if (books.length == length) {
        res.json(books);
        books = [];
    };
    browser.close();
};

app.get('/crawler', (req, res) => {
    try {
        let url = req.query.url;
        scrapeGoodReads(url, res);
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

const port = 8081;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
