'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseReadable = require('promise-readable').PromiseReadable
const PromiseWritable = require('promise-writable').PromiseWritable

const PromiseReadablePiping = require('./promise-readable-piping').PromiseReadablePiping
const PromiseWritablePiping = require('./promise-writable-piping').PromiseWritablePiping

class PromisePiping {
  constructor (...streams) {
    this.duplexStreams = []

    const anyReadable = streams.shift()
    const promiseReadable = anyReadable instanceof PromiseReadable ? anyReadable : new PromiseReadable(anyReadable)
    this.promiseReadable = promiseReadable

    const anyWritable = streams.pop()
    const promiseWritable = anyWritable instanceof PromiseWritable ? anyWritable : new PromiseWritable(anyWritable)
    this.promiseWritable = promiseWritable

    promiseReadable.stream.on('error', (err) => {
      if (err) {
        if (err.promisePipingPropagated) {
          delete err.promisePipingPropagated
        } else {
          promiseWritable.stream.emit('error', Object.assign(err, { promisePipingPropagated: true }))
        }
      }
    })
    promiseWritable.stream.on('error', (err) => {
      if (err) {
        if (err && err.promisePipingPropagated) {
          delete err.promisePipingPropagated
        } else {
          promiseReadable.stream.emit('error', Object.assign(err, { promisePipingPropagated: true }))
        }
      }
    })

    let currentSource = promiseReadable.stream

    while (streams.length > 0) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.push(duplex)

      duplex.on('error', (err) => {
        if (err) {
          promiseReadable.stream.emit('error', Object.assign(err, { promisePipingPropagated: true }))
        }
      })
      duplex.on('error', (err) => {
        if (err) {
          promiseWritable.stream.emit('error', Object.assign(err, { promisePipingPropagated: true }))
        }
      })

      currentSource = currentSource.pipe(duplex)
    }

    currentSource.pipe(promiseWritable.stream)
  }

  once (event) {
    if (event === 'end') {
      return this.promiseReadable.once(event)
    } else {
      return this.promiseWritable.once(event)
    }
  }
}

PromisePiping.PromisePiping = PromisePiping
PromisePiping.PromiseReadablePiping = PromiseReadablePiping
PromisePiping.PromiseWritablePiping = PromiseWritablePiping

PromisePiping.default = PromisePiping

module.exports = PromisePiping
