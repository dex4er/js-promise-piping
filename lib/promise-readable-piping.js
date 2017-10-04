'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseReadable = require('promise-readable').PromiseReadable

class PromiseReadablePiping extends PromiseReadable {
  constructor (...streams) {
    const lastAnyDuplex = streams.pop()
    const lastDuplex = lastAnyDuplex instanceof PromiseReadable ? lastAnyDuplex.stream : lastAnyDuplex

    let stream = lastDuplex

    super(lastDuplex)

    this.duplex = this.duplex || []

    while (streams.length > 2) {
      const anyDuplex = streams.pop()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplex.unshift(duplex)

      duplex.pipe(stream)
      stream = duplex
    }

    const anyReadable = streams.pop()
    const promiseReadable = anyReadable instanceof PromiseReadable ? anyReadable : new PromiseReadable(anyReadable)
    this.promiseReadable = promiseReadable

    promiseReadable.stream.pipe(stream)
  }

  once (event) {
    return this.promiseReadable.once(event)
  }
}

PromiseReadablePiping.PromiseReadablePiping = PromiseReadablePiping
PromiseReadablePiping.default = PromiseReadablePiping

module.exports = PromiseReadablePiping
