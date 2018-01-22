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

    const propagatedSymbol = Symbol('propagated')
    this.propagatedSymbol = propagatedSymbol

    promiseReadable.stream.on('error', (err) => {
      // console.log('[1] PromisePiping on error', promiseReadable.stream.options.name, '->', promiseWritable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseWritable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    })
    promiseWritable.stream.on('error', (err) => {
      // console.log('[2] PromisePiping on error', promiseWritable.stream.options.name, '->', promiseReadable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseReadable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    })

    let currentSource = promiseReadable.stream

    while (streams.length > 0) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.push(duplex)

      duplex.on('error', (err) => {
        // console.log('[3] PromisePiping on error', duplex.options.name, '->', promiseReadable.stream.options.name)
        if (err) {
          promiseReadable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      })
      duplex.on('error', (err) => {
        // console.log('[4] PromisePiping on error', duplex.options.name, '->', promiseWritable.stream.options.name)
        if (err) {
          promiseWritable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      })

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
}

PromisePiping.PromisePiping = PromisePiping
PromisePiping.PromiseReadablePiping = PromiseReadablePiping
PromisePiping.PromiseWritablePiping = PromiseWritablePiping

PromisePiping.default = PromisePiping

module.exports = PromisePiping
