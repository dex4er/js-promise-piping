'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseReadable = require('promise-readable').PromiseReadable
const PromiseWritable = require('promise-writable').PromiseWritable

const PromiseReadablePiping = require('./promise-readable-piping').PromiseReadablePiping
const PromiseWritablePiping = require('./promise-writable-piping').PromiseWritablePiping

class PromisePiping {
  constructor (...streams) {
    this.duplex = []

    const anyReadable = streams.shift()
    const promiseReadable = anyReadable instanceof PromiseReadable ? anyReadable : new PromiseReadable(anyReadable)
    this.promiseReadable = promiseReadable

    let stream = promiseReadable.stream

    while (streams.length > 1) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplex.push(duplex)

      stream = stream.pipe(duplex)
    }

    const anyWritable = streams.shift()
    const promiseWritable = anyWritable instanceof PromiseWritable ? anyWritable : new PromiseWritable(anyWritable)
    this.promiseWritable = promiseWritable

    stream.pipe(promiseWritable.stream)
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
