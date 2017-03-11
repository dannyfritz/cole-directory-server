require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())

app.get("/", function (request, response) {
  response.send("You have reached the cole-directory-server.")
})

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`)
})

module.exports = app
