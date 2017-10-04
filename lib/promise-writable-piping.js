'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseWritable = require('promise-writable').PromiseWritable

class PromiseWritablePiping extends PromiseWritable {
  constructor (...streams) {
    const firstAnyDuplex = streams.shift()
    const firstDuplex = firstAnyDuplex instanceof PromiseWritable ? firstAnyDuplex.stream : firstAnyDuplex

    let stream = firstDuplex

    super(firstDuplex)

    this.duplex = this.duplex || []

    while (streams.length > 2) {
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
    return this.promiseWritable.once(event)
  }

  end () {
    return Promise.all([
      super.end(),
      this.promiseWritable.once('unpipe')
    ])
  }
}

PromiseWritablePiping.PromiseWritablePiping = PromiseWritablePiping
PromiseWritablePiping.default = PromiseWritablePiping

module.exports = PromiseWritablePiping
