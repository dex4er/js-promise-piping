'use strict'

const PromiseDuplex = require('promise-duplex')
const PromiseReadable = require('promise-readable')

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

    this._writableErrorHandler = (err) => {
      // console.log('[1] PromiseReadablePiping on error', lastDuplex.options.name, '->', promiseReadable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseReadable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    }
    lastDuplex.on('error', this._writableErrorHandler)

    this._readableErrorHandler = (err) => {
      // console.log('[2] PromiseReadablePiping on error', promiseReadable.stream.options.name, '->', lastDuplex.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          lastDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    }
    promiseReadable.stream.on('error', this._readableErrorHandler)

    this.duplexStreams = []
    this._duplexErrorHandlers = []

    let currentDestination = lastDuplex

    while (streams.length > 0) {
      const destination = currentDestination

      const anyDuplex = streams.pop()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.unshift(duplex)

      const duplexErrorHandler = (err) => {
        // console.log('[3] PromiseReadablePiping on error', duplex.options.name, '->', lastDuplex.options.name)
        if (err) {
          lastDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
      this._duplexErrorHandlers.unshift(duplexErrorHandler)
      duplex.on('error', duplexErrorHandler)

      duplex.pipe(destination)
      currentDestination = duplex
    }

    promiseReadable.stream.pipe(currentDestination)
  }

  once (event) {
    // console.log('PromiseReadablePiping once', event, this.promiseReadable.stream.options.name)
    return this.promiseReadable.once(event)
  }

  destroy () {
    if (this.stream && this._writableErrorHandler) {
      const lastDuplex = this.stream
      lastDuplex.removeListener('error', this._writableErrorHandler)
      delete this._writableErrorHandler
    }

    if (this.promiseReadable && this.promiseReadable.stream && this._readableErrorHandler) {
      this.promiseReadable.stream.removeListener('error', this._readableErrorHandler)
      delete this._readableErrorHandler
      delete this.promiseReadable
    }

    if (this.duplexStreams) {
      for (const duplex of this.duplexStreams) {
        duplex.removeListener('error', this._duplexErrorHandlers.shift())
      }
      delete this._duplexErrorHandlers
      delete this.duplexStreams
    }

    super.destroy()
  }
}

PromiseReadablePiping.PromiseReadablePiping = PromiseReadablePiping
PromiseReadablePiping.default = PromiseReadablePiping

module.exports = PromiseReadablePiping
