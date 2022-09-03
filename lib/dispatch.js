/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

// Mechanism for dispatching batches of messages to Kinesis

// Libraries
const AWS = require('aws-sdk')
AWS.config.update({region: process.env.AWS_REGION })
const kinesis = new AWS.Kinesis({apiVersion: '2013-12-02'})

const StreamName = process.env.streamName 
const BATCH_LIMIT = 100
let batch = []
let sequenceId = 1

// Adds a new message to the current Kinesis batch
const addToBatch = async (message) => {
  // console.log(message)
  batch.push(JSON.stringify(message))
  // console.log('Added msg - ', batch.length)
  if (batch.length === BATCH_LIMIT) {
    await flushBatch()
    batch = []
  }
}

// Flushes the batch to Kinesis
const flushBatch = async () => {
  const params = {
    StreamName,
    Records: []
  }

  if (batch.length === 0) {
    return console.log('Empty batch - exiting')
  }

  batch.forEach(function (msg) {
    params.Records.push(
      {
        "Data": msg,
        "PartitionKey": parseInt(Math.random()*100000000).toString()
      }
    )
  })

  console.log(params)
  try {    
    const result = await kinesis.putRecords(params).promise()
    if (result.FailedPutCount > 0) {
      console.log(`Firehose batch sequence ${sequenceId}. Failure: ${result}`)
    }
    sequenceId++
    batch = []    
  } catch (err) {
    console.error(err)
  }
}

// Exports
module.exports = {
  addToBatch,
  flushBatch
}
