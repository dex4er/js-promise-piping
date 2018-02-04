'use strict'

const { Transform } = require('stream')

const PromisePiping = require('../lib/promise-piping')

class MyTransform extends Transform {
  _transform (chunk, _encoding, callback) {
    callback(null, chunk)
  }
  _flush (callback) {
    callback()
  }
}

const streams = {
  stdin: process.stdin,
  stdout: process.stdout,
  transform1: new MyTransform(),
  transform2: new MyTransform()
}

for (const stream of Object.keys(streams)) {
  for (const event of ['close', 'data', 'drain', 'end', 'error', 'finish', 'pipe', 'readable', 'unpipe']) {
    if (stream === 'stdout' && ['data', 'readable'].includes(event)) { continue }
    streams[stream].on(event, (arg) => console.log(`${stream} emitted ${event}:`, typeof arg === 'object' ? arg.constructor.name : arg))
  }
}

async function main () {
  const pipe = new PromisePiping(streams.stdin, streams.transform1, streams.stdout)
  await pipe.once('unpipe')
  console.log('END')
}

main().catch(console.error)
