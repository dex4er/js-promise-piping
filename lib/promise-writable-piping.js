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

    firstDuplex.on('error', (err) => {
      // console.log('[1] PromiseWritablePiping on error', firstDuplex.options.name, '->', promiseWritable.stream.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          promiseWritable.stream.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    })
    promiseWritable.stream.on('error', (err) => {
      // console.log('[2] PromiseWritablePiping on error', promiseWritable.stream.options.name, '->', firstDuplex.options.name)
      if (err) {
        if (err[propagatedSymbol]) {
          delete err[propagatedSymbol]
        } else {
          firstDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      }
    })

    this.duplexStreams = []

    let currentSource = firstDuplex

    while (streams.length > 0) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.push(duplex)

      duplex.on('error', (err) => {
        // console.log('[3] PromiseWritablePiping on error', duplex.options.name, '->', firstDuplex.options.name)
        if (err) {
          firstDuplex.emit('error', Object.assign(err, { [propagatedSymbol]: true }))
        }
      })

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
}

PromiseWritablePiping.PromiseWritablePiping = PromiseWritablePiping
PromiseWritablePiping.default = PromiseWritablePiping

module.exports = PromiseWritablePiping
