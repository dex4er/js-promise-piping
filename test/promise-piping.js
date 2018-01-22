'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const PromisePiping = require('../lib/promise-piping').PromisePiping
const PromiseReadablePiping = require('../lib/promise-readable-piping').PromiseReadablePiping
const PromiseWritablePiping = require('../lib/promise-writable-piping').PromiseWritablePiping

const MyReadable = require('./lib/my-readable').MyReadable
const MyTransform = require('./lib/my-transform').MyTransform
const MyWritable = require('./lib/my-writable').MyWritable

Feature('Test promise-piping module', () => {
  Scenario('Use piping', () => {
    let piping
    let readable
    let transform1
    let transform2
    let transform3
    let writable

    Given('readable stream', () => {
      readable = new MyReadable({ name: 'readable', lines: 10 })
    })

    And('transform1 stream', () => {
      transform1 = new MyTransform({ name: 'transform1' })
    })

    And('transform2 stream', () => {
      transform2 = new MyTransform({ name: 'transform2' })
    })

    And('transform3 stream', () => {
      transform3 = new MyTransform({ name: 'transform3' })
    })

    And('writable stream', () => {
      writable = new MyWritable({ name: 'writable' })
    })

    When('piping is created', () => {
      piping = new PromisePiping(readable, transform1, transform2, transform3, writable)
    })

    And('waiting for finish', () => {
      return piping.once('finish')
    })

    Then('content is correct', () => {
      writable.lines.length.should.equal(10)
    })
  })

  for (const name of ['readable', 'transform1', 'transform2', 'transform3', 'writable']) {
    Scenario(`Use piping with ${name} stream errored`, () => {
      let error
      let piping
      let readable
      let transform1
      let transform2
      let transform3
      let writable

      Given('readable stream' + (name === 'readable' ? ' with error' : ''), () => {
        readable = new MyReadable({ name: 'readable', lines: 10, withError: name === 'readable' })
      })

      And('transform1 stream' + (name === 'transform1' ? ' with error' : ''), () => {
        transform1 = new MyTransform({ name: 'transform1', withError: name === 'transform1' })
      })

      And('transform2 stream' + (name === 'transform2' ? ' with error' : ''), () => {
        transform2 = new MyTransform({ name: 'transform2', withError: name === 'transform2' })
      })

      And('transform3 stream' + (name === 'transform3' ? ' with error' : ''), () => {
        transform3 = new MyTransform({ name: 'transform3', withError: name === 'transform3' })
      })

      And('writable stream' + (name === 'writable' ? ' with error' : ''), () => {
        writable = new MyWritable({ name: 'writable', withError: name === 'writable' })
      })

      When('piping is created', () => {
        piping = new PromisePiping(readable, transform1, transform2, transform3, writable)
      })

      And('waiting for finish', () => {
        return piping.once('finish')
          .catch((err) => {
            error = err
          })
      })

      Then('error is caught', () => {
        error.should.be.an('Error').and.have.property('message', name)
      })
    })
  }

  Scenario('Use nested piping', () => {
    let piping
    let readable
    let readablepiping
    let transform1
    let transform2
    let transform3
    let writable
    let writablepiping

    Given('readable stream', () => {
      readable = new MyReadable({ name: 'readable', lines: 10 })
    })

    And('transform1 stream', () => {
      transform1 = new MyTransform({ name: 'transform1' })
    })

    And('transform2 stream', () => {
      transform2 = new MyTransform({ name: 'transform2' })
    })

    And('transform3 stream', () => {
      transform3 = new MyTransform({ name: 'transform3' })
    })

    And('writable stream', () => {
      writable = new MyWritable({ name: 'writable' })
    })

    When('readable piping is created', () => {
      readablepiping = new PromiseReadablePiping(readable, transform1)
    })

    And('writable piping is created', () => {
      writablepiping = new PromiseWritablePiping(transform2, writable)
    })

    And('piping is created', () => {
      piping = new PromisePiping(readablepiping, transform3, writablepiping)
    })

    And('waiting for finish', () => {
      return piping.once('finish')
    })

    Then('content is correct', () => {
      writable.lines.length.should.equal(10)
    })
  })

  for (const name of ['readable', 'transform1', 'transform2', 'transform3', 'writable']) {
    Scenario(`Use nested piping with ${name} stream errored`, () => {
      let error
      let piping
      let readable
      let readablepiping
      let transform1
      let transform2
      let transform3
      let writable
      let writablepiping

      Given('readable stream' + (name === 'readable' ? ' with error' : ''), () => {
        readable = new MyReadable({ name: 'readable', lines: 10, withError: name === 'readable' })
      })

      And('transform1 stream' + (name === 'transform1' ? ' with error' : ''), () => {
        transform1 = new MyTransform({ name: 'transform1', withError: name === 'transform1' })
      })

      And('transform2 stream' + (name === 'transform2' ? ' with error' : ''), () => {
        transform2 = new MyTransform({ name: 'transform2', withError: name === 'transform2' })
      })

      And('transform3 stream' + (name === 'transform3' ? ' with error' : ''), () => {
        transform3 = new MyTransform({ name: 'transform3', withError: name === 'transform3' })
      })

      And('writable stream' + (name === 'writable' ? ' with error' : ''), () => {
        writable = new MyWritable({ name: 'writable', withError: name === 'writable' })
      })

      When('readable piping is created', () => {
        readablepiping = new PromiseReadablePiping(readable, transform1)
      })

      And('writable piping is created', () => {
        writablepiping = new PromiseWritablePiping(transform2, writable)
      })

      And('piping is created', () => {
        piping = new PromisePiping(readablepiping, transform3, writablepiping)
      })

      And('waiting for finish', () => {
        return piping.once('finish')
          .catch((err) => {
            error = err
          })
      })

      Then('error is caught', () => {
        error.should.be.an('Error').and.have.property('message', name)
      })
    })
  }
})
