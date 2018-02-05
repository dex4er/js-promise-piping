'use strict'

const PromiseDuplex = require('promise-duplex')
const PromiseWritable = require('promise-writable')

class PromiseWritablePiping extends PromiseWritable {
  constructor (...streams) {
    const firstAnyDuplex = streams.shift()
    const firstDuplex = firstAnyDuplex instanceof PromiseWritable ? firstAnyDuplex.stream : firstAnyDuplex

    super(firstDuplex)

    const anyWritable = streams.pop()
    const promiseWritable = anyWritable instanceof PromiseWritable ? anyWritable : new PromiseWritable(anyWritable)
    this.promiseWritable = promiseWritable

    const propagatedSymbol = Symbol('propagated')
    this.propagatedSymbol = propagatedSymbol

    this._writableErrorHandler = (err) => {
      // console.log('[1] PromiseWritablePiping on error', firstDuplex.options.name, '->', promiseWritable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseWritable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    }
    firstDuplex.on('error', this._writableErrorHandler)

    this._readableErrorHandler = (err) => {
      // console.log('[2] PromiseWritablePiping on error', promiseWritable.stream.options.name, '->', firstDuplex.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          firstDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    }
    promiseWritable.stream.on('error', this._readableErrorHandler)

    this.duplexStreams = []
    this._duplexErrorHandlers = []

    let currentSource = firstDuplex

    while (streams.length > 0) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.push(duplex)

      const duplexErrorHandler = (err) => {
        // console.log('[3] PromiseWritablePiping on error', duplex.options.name, '->', firstDuplex.options.name)
        if (err) {
          firstDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
      this._duplexErrorHandlers.push(duplexErrorHandler)
      duplex.on('error', duplexErrorHandler)

      currentSource = currentSource.pipe(duplex)
    }

    currentSource.pipe(promiseWritable.stream)
  }

  once (event) {
    // console.log('PromiseWritablePiping once', event, this.promiseWritable.stream.options.name)
    return this.promiseWritable.once(event)
  }

  end () {
    return Promise.all([
      super.end(),
      this.promiseWritable.once('unpipe')
    ])
  }

  destroy () {
    if (this.stream && this._writableErrorHandler) {
      const firstDuplex = this.stream
      firstDuplex.removeListener('error', this._writableErrorHandler)
      delete this._writableErrorHandler
    }

    if (this.promiseWritable && this.promiseWritable.stream && this._readableErrorHandler) {
      this.promiseWritable.stream.removeListener('error', this._readableErrorHandler)
      delete this._readableErrorHandler
      delete this.promiseWritable
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

PromiseWritablePiping.PromiseWritablePiping = PromiseWritablePiping
PromiseWritablePiping.default = PromiseWritablePiping

module.exports = PromiseWritablePiping
