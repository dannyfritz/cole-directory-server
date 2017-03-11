require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const app = express()
const PORT = process.env.PORT || 8080
const apiRouter = require("./api")

app.use(morgan("tiny"))
app.use(cors())
app.use(bodyParser.json())
app.use("/api", apiRouter)

app.get("/", function (request, response) {
  response.send("You have reached the cole-directory-server.")
})

app.listen(PORT, function () {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}...`)
})

module.exports = app
