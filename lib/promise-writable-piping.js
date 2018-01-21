'use strict'

const PromiseDuplex = require('promise-duplex').PromiseDuplex
const PromiseWritable = require('promise-writable').PromiseWritable

class PromiseWritablePiping extends PromiseWritable {
  constructor (...streams) {
    const firstAnyDuplex = streams.shift()
    const firstDuplex = firstAnyDuplex instanceof PromiseWritable ? firstAnyDuplex.stream : firstAnyDuplex

    super(firstDuplex)

    const anyWritable = streams.pop()
    const promiseWritable = anyWritable instanceof PromiseWritable ? anyWritable : new PromiseWritable(anyWritable)
    this.promiseWritable = promiseWritable

    promiseWritable.stream.on('error', (err) => {
      if (err && err.promisePipingPropagated) {
        delete err.promisePipingPropagated
      }
    })

    this.duplexStreams = []

    let currentSource = firstDuplex

    while (streams.length > 0) {
      const anyDuplex = streams.shift()
      const duplex = anyDuplex instanceof PromiseDuplex ? anyDuplex.stream : anyDuplex
      this.duplexStreams.push(duplex)

      duplex.on('error', (err) => {
        if (err) {
          firstDuplex.emit('error', Object.assign(err, { promisePipingPropagated: true }))
        }
      })

      currentSource = currentSource.pipe(duplex)
    }

    promiseWritable.stream.on('error', (err) => {
      if (err) {
        firstDuplex.emit('error', Object.assign(err, { promisePipingPropagated: true }))
      }
    })

    currentSource.pipe(promiseWritable.stream)
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
