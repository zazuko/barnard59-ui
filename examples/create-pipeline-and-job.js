const Client = require('../src/Client')

const client = new Client()

client.createPipeline().then(pipelineIri => {
  console.log(`pipeline created at: ${pipelineIri}`)

  const pipeline = require('./support/buildPipeline')(pipelineIri).node

  return client.update(pipeline).then(() => {
    return client.createJob(pipelineIri)
  })
}).then(job => {
  console.log(`job created at: ${job.value}`)
}).then(res => {
  console.log(res)
}).catch(err => console.error(err))
