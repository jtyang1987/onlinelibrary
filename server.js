require("dotenv").config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP

const express = require("express");
const app = express();

// Middleware
app.use(express.json()); // parse json bodies in the request object

// Redirect requests to endpoint starting with /posts to postRoutes.js
app.use("/books", require("./routes/bookRoutes"));

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went realy wrong",
  });
});

// static Files (https://www.youtube.com/watch?v=A01KtJTv1oc)
app.use(express.static(__dirname + '/frontend'))
app.use('/css', express.static(__dirname + '/frontend/css'))
app.use('/js', express.static(__dirname + '/frontend/js'))
//app.use('/img', express.static(__dirname + '/frontend/img'))

//__dirname + '/../frontend/home.html' doesn't work
app.get('', (req, res) => {
    res.sendFile(__dirname + '/frontend/home.html')
})

// Listen on pc port
const HOST = process.env.HOST;
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening at http://${HOST}:${PORT}`));
