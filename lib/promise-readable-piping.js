'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseReadable = require('promise-readable').PromiseReadable

class PromiseReadablePiping extends PromiseReadable {
  constructor (...streams) {
    const lastAnyDuplex = streams.pop()
    const lastDuplex = lastAnyDuplex instanceof PromiseReadable ? lastAnyDuplex.stream : lastAnyDuplex

    super(lastDuplex)

    const anyReadable = streams.shift()
    const promiseReadable = anyReadable instanceof PromiseReadable ? anyReadable : new PromiseReadable(anyReadable)
    this.promiseReadable = promiseReadable

    const propagatedSymbol = Symbol('propagated')
    this.propagatedSymbol = propagatedSymbol

    lastDuplex.on('error', (err) => {
      // console.log('[1] PromiseReadablePiping on error', lastDuplex.options.name, '->', promiseReadable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseReadable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    })
    promiseReadable.stream.on('error', (err) => {
      // console.log('[2] PromiseReadablePiping on error', promiseReadable.stream.options.name, '->', lastDuplex.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          lastDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    })

    this.duplexStreams = []

    let currentDestination = lastDuplex

    while (streams.length > 0) {
      const destination = currentDestination

      const anyDuplex = streams.pop()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.unshift(duplex)

      duplex.on('error', (err) => {
        // console.log('[3] PromiseReadablePiping on error', duplex.options.name, '->', lastDuplex.options.name)
        if (err) {
          lastDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      })

      duplex.pipe(destination)
      currentDestination = duplex
    }

    promiseReadable.stream.pipe(currentDestination)
  }

  once (event) {
    // console.log('PromiseReadablePiping once', event, this.promiseReadable.stream.options.name)
    return this.promiseReadable.once(event)
  }
}

PromiseReadablePiping.PromiseReadablePiping = PromiseReadablePiping
PromiseReadablePiping.default = PromiseReadablePiping

module.exports = PromiseReadablePiping
