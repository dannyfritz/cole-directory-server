const express = require("express")
const router = express.Router()
const Tabletop = require("tabletop")
const axios = require("axios")
const memoize = require("lodash/fp/memoize")
const pick = require("lodash/fp/pick")
const get = require("lodash/fp/get")
const flow = require("lodash/fp/flow")

const getData = () =>
  new Promise(
    (resolve, reject) =>
      Tabletop.init({
        key: process.env.SPREADSHEET,
        prettyColumnNames: false,
        callback: resolve,
      })
  )

const getSheetData = (sheetName) => flow(get(sheetName), pick(["columnNames", "elements"]))

router.get("/sheets/:sheetName", (request, response, next) => {
  getData()
    .then(getSheetData(request.params.sheetName))
    .then((data) => response.json(data))
    .catch(next)
})

const geoCode = memoize((address) => {
  // eslint-disable-next-line no-console
  console.log(`Hitting Google for geocode location of ${address}...`)
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GMAP_KEY}&address=${address}`)
    .then((response) => {
      if (response.data && response.data.status !== "OK") {
        throw new Error(`${response.data.status}: ${response.data.error_message}`)
      }
      return response.data
    }
  )
})

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
