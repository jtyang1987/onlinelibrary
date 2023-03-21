const express = require("express")
const bookControllers = require("../controllers/bookControllers");
const router = express.Router()

router.route("/")
.get(bookControllers.getAllbooks)
.put(bookControllers.createNewbooks)
.post(bookControllers.createNewbook);

router.route("/:title")
.get(bookControllers.getBookByTitle)
.post(bookControllers.updateBookByTitle)
.delete(bookControllers.deleteBookByTitle);

module.exports = router;