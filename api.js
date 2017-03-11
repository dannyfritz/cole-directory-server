const express = require("express")
const router = express.Router()
const Tabletop = require("tabletop")
const axios = require("axios")
const memoize = require("lodash/fp/memoize")

const getData = () =>
  new Promise(
    (resolve, reject) =>
      Tabletop.init({
        key: process.env.SPREADSHEET,
        prettyColumnNames: false,
        callback: resolve,
      })
  )

router.get("/places", (request, response, next) => {
  getData()
    .then((data) => {
      response.json(data.Places)
    })
    .catch(next)
})

const geoCode = memoize((address) =>
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GMAP_KEY}&address=${address}`)
    .then((response) => {
      if (response.data && response.data.status) {
        throw new Error(`${response.data.status}: ${response.data.error_message}`)
      }
      return response.data
    }
  ))

router.get("/geocode", (request, response, next) => {
  if (!request.query.address) {
    next(new Error(`Please pass an address query: ${request.path}?address=example`))
    return
  }
  geoCode(request.query.address)
    .then((data) => {
      response.json(data)
    })
    .catch(next)
})

router.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err)
  res.status(500).send(`ERROR: ${err.message}`)
})

module.exports = router
