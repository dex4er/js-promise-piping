'use strict'

const PromiseDuplex = require('promise-duplex')
const PromiseReadable = require('promise-readable')
const PromiseWritable = require('promise-writable')

const PromiseReadablePiping = require('./promise-readable-piping')
const PromiseWritablePiping = require('./promise-writable-piping')

class PromisePiping {
  constructor (...streams) {
    this.duplexStreams = []

    const anyReadable = streams.shift()
    const promiseReadable = anyReadable instanceof PromiseReadable ? anyReadable : new PromiseReadable(anyReadable)
    this.promiseReadable = promiseReadable

    const anyWritable = streams.pop()
    const promiseWritable = anyWritable instanceof PromiseWritable ? anyWritable : new PromiseWritable(anyWritable)
    this.promiseWritable = promiseWritable

    const propagatedSymbol = Symbol('propagated')
    this.propagatedSymbol = propagatedSymbol

    this._readableErrorHandler = (err) => {
      // console.log('[1] PromisePiping on error', promiseReadable.stream.options.name, '->', promiseWritable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseWritable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    }
    promiseReadable.stream.on('error', this._readableErrorHandler)

    this._writableErrorHandler = (err) => {
      // console.log('[2] PromisePiping on error', promiseWritable.stream.options.name, '->', promiseReadable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseReadable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    }
    promiseWritable.stream.on('error', this._writableErrorHandler)

    this._duplexReadableErrorHandlers = []
    this._duplexWritableErrorHandlers = []

    let currentSource = promiseReadable.stream

    while (streams.length > 0) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.push(duplex)

      const duplexReadableErrorHandler = (err) => {
        // console.log('[3] PromisePiping on error', duplex.options.name, '->', promiseReadable.stream.options.name)
        if (err) {
          promiseReadable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
      this._duplexReadableErrorHandlers.push(duplexReadableErrorHandler)
      duplex.on('error', duplexReadableErrorHandler)

      const duplexWritableErrorHandler = (err) => {
        // console.log('[4] PromisePiping on error', duplex.options.name, '->', promiseWritable.stream.options.name)
        if (err) {
          promiseWritable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
      this._duplexWritableErrorHandlers.push(duplexWritableErrorHandler)
      duplex.on('error', duplexWritableErrorHandler)

      currentSource = currentSource.pipe(duplex)
    }

    currentSource.pipe(promiseWritable.stream)
  }

  once (event) {
    if (event === 'end') {
      // console.log('[1] PromisePiping once', event, this.promiseReadable.stream.options.name)
      return this.promiseReadable.once(event)
    } else {
      // console.log('[2] PromisePiping once', event, this.promiseWritable.stream.options.name)
      return this.promiseWritable.once(event)
    }
  }

  destroy () {
    if (this.promiseReadable) {
      if (this._readableErrorHandler) {
        if (this.promiseReadable.stream) {
          this.promiseReadable.stream.removeListener('error', this._readableErrorHandler)
        }
        delete this._readableErrorHandler
      }
      delete this.promiseReadable
    }

    if (this.promiseWritable) {
      if (this._writableErrorHandler) {
        if (this.promiseWritable.stream) {
          this.promiseWritable.stream.removeListener('error', this._writableErrorHandler)
        }
        delete this._writableErrorHandler
      }
      delete this.promiseWritable
    }

    if (this.duplexStreams) {
      for (const duplex of this.duplexStreams) {
        duplex.removeListener('error', this._duplexReadableErrorHandlers.shift())
        duplex.removeListener('error', this._duplexWritableErrorHandlers.shift())
      }
      delete this._duplexReadableErrorHandlers
      delete this._duplexWritableErrorHandlers
      delete this.duplexStreams
    }
  }
}

PromisePiping.PromisePiping = PromisePiping
PromisePiping.PromiseReadablePiping = PromiseReadablePiping
PromisePiping.PromiseWritablePiping = PromiseWritablePiping

PromisePiping.default = PromisePiping

module.exports = PromisePiping
