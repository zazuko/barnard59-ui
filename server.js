const absoluteUrl = require('absolute-url')
const express = require('express')
const rdf = require('rdf-ext')
const rdfBodyParser = require('rdf-body-parser')
const url = require('url')
const cors = require('cors')
const DatasetStore = require('rdf-store-dataset')
const Pipelines = require('./src/middleware/Pipelines')
const Jobs = require('./src/middleware/Jobs')

const baseUrl = 'http://localhost:8080/'

const app = express()
const dataset = rdf.dataset()
const store = new DatasetStore({ dataset })

app.use(cors())

app.use((req, res, next) => {
  process.stdout.write(`${req.method} ${req.url} `)

  res.on('finish', () => {
    process.stdout.write(`${res.statusCode}\n`)
  })

  next()
})

app.use(absoluteUrl())
app.use(rdfBodyParser())

const pipelines = new Pipelines(store, `${baseUrl}pipeline/`)

app.use('/pipeline', pipelines.router)

const jobs = new Jobs(store, `${baseUrl}job/`)

app.use('/job', jobs.router)

const server = app.listen(url.parse(baseUrl).port, () => {
  const host = server.address().address
  const port = server.address().port

  console.log(`listening at http://${host}:${port}`)
})
