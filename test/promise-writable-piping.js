'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const PromiseWritablePiping = require('../lib/promise-writable-piping').PromiseWritablePiping

const MyTransform = require('./lib/my-transform').MyTransform
const MyWritable = require('./lib/my-writable').MyWritable

Feature('Test promise-writable-piping module', () => {
  Scenario('Use writable piping', () => {
    let finished = false
    let piping
    let transform1
    let transform2
    let transform3
    let writable

    Given('transform1 stream', () => {
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

    When('writable piping is created', () => {
      piping = new PromiseWritablePiping(transform1, transform2, transform3, writable)
    })

    And('waiting for finish', () => {
      piping.once('finish').then(() => {
        finished = true
      })
    })

    When('all of content is written', async () => {
      await piping.writeAll([...Array(10).keys()].map((n) => `line ${n + 1}\n`).join(''), 7)
    })

    Then('content is correct', () => {
      writable.lines.length.should.equal(11)
    })

    And('piping is finished', () => {
      return finished.should.be.true
    })
  })

  for (const name of ['transform1', 'transform2', 'transform3', 'writable']) {
    Scenario(`Use writable piping with ${name} stream errored`, () => {
      let error
      let piping
      let transform1
      let transform2
      let transform3
      let writable

      Given('transform1 stream' + (name === 'transform1' ? ' with error' : ''), () => {
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

      When('writable piping is created', () => {
        piping = new PromiseWritablePiping(transform1, transform2, transform3, writable)
      })

      And('all of content is written', async () => {
        try {
          await piping.writeAll([...Array(10).keys()].map((n) => `line ${n + 1}\n`).join(''), 7)
        } catch (e) {
          error = e
        }
      })

      Then('error is caught', () => {
        error.should.be.an('Error').and.have.property('message', name)
      })
    })
  }
})
