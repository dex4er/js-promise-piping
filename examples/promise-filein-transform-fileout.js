'use strict'

const fs = require('fs')
const { Transform } = require('stream')

const { PromisePiping, PromiseReadablePiping, PromiseWritablePiping } = require('../lib/promise-piping')

class MyTransform extends Transform {
  _transform (chunk, _encoding, callback) {
    callback(null, chunk)
  }
  _flush (callback) {
    callback()
  }
}

const streams = {
  filein: fs.createReadStream(process.argv[2] || 'a.in'),
  fileout: fs.createWriteStream(process.argv[3] || 'a.out'),
  transform1: new MyTransform(),
  transform2: new MyTransform()
}

for (const stream of Object.keys(streams)) {
  for (const event of ['close', 'data', 'drain', 'end', 'error', 'finish', 'pipe', 'readable', 'unpipe']) {
    if (stream === 'stdout' && ['data', 'readable'].includes(event)) continue
    streams[stream].on(event, (arg) => console.info(`${stream} emitted ${event}:`, typeof arg === 'object' ? arg.constructor.name : arg))
  }
}

async function pipe1 () {
  const pipe = new PromisePiping(streams.filein, streams.transform1, streams.transform2, streams.fileout)
  await pipe.once('close')
}

async function pipe2 () {
  const pipeout = new PromiseWritablePiping(streams.transform2, streams.fileout)
  const pipe = new PromisePiping(streams.filein, pipeout)
  await pipe.once('close')
}

async function pipe3 () {
  const pipein = new PromiseReadablePiping(streams.filein, streams.transform1)
  const pipe = new PromisePiping(pipein, streams.transform2, streams.fileout)
  await pipe.once('close')
}

async function main () {
  switch (process.env.MODE) {
    case '2':
      await pipe2()
      break
    case '3':
      await pipe3()
      break
    default:
      await pipe1()
  }
  console.info('END')
}

main().catch(console.error)
