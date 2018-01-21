'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseReadable = require('promise-readable').PromiseReadable

class PromiseReadablePiping extends PromiseReadable {
  constructor (...streams) {
    const lastAnyDuplex = streams.pop()
    const lastDuplex = lastAnyDuplex instanceof PromiseReadable ? lastAnyDuplex.stream : lastAnyDuplex

    lastDuplex.on('error', (err) => {
      if (err && err.promisePipingPropagated) {
        delete err.promisePipingPropagated
      }
    })

    super(lastDuplex)

    this.duplexStreams = []

    let currentDestination = lastDuplex

    while (streams.length > 1) {
      const destination = currentDestination

      const anyDuplex = streams.pop()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.unshift(duplex)

      duplex.on('error', (err) => {
        if (err) {
          lastDuplex.emit('error', Object.assign(err, { promisePipingPropagated: true }))
        }
      })

      duplex.pipe(destination)
      currentDestination = duplex
    }

    const anyReadable = streams.pop()
    const promiseReadable = anyReadable instanceof PromiseReadable ? anyReadable : new PromiseReadable(anyReadable)
    this.promiseReadable = promiseReadable

    promiseReadable.stream.on('error', (err) => {
      if (err) {
        lastDuplex.emit('error', Object.assign(err, { promisePipingPropagated: true }))
      }
    })

    promiseReadable.stream.pipe(currentDestination)
  }

  once (event) {
    return this.promiseReadable.once(event)
  }
}

PromiseReadablePiping.PromiseReadablePiping = PromiseReadablePiping
PromiseReadablePiping.default = PromiseReadablePiping

module.exports = PromiseReadablePiping
