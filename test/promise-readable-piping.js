'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const PromiseReadablePiping = require('../lib/promise-readable-piping').PromiseReadablePiping

const MyReadable = require('./lib/my-readable').MyReadable
const MyTransform = require('./lib/my-transform').MyTransform

Feature('Test promise-readable-piping module', () => {
  Scenario('Use readable piping', () => {
    let finished = false
    let piping
    let readable
    let rest
    let transform1
    let transform2
    let transform3

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

    When('readable piping is created', () => {
      piping = new PromiseReadablePiping(readable, transform1, transform2, transform3)
    })

    And('waiting for finish', () => {
      piping.once('finish').then(() => {
        finished = true
      })
    })

    And('all of content is read', async () => {
      rest = String(await piping.readAll())
    })

    Then('content is correct', () => {
      rest.split('\n').length.should.equal(11)
    })

    And('piping is finished', () => {
      return finished.should.be.true
    })
  })

  for (const name of ['readable', 'transform1', 'transform2', 'transform3']) {
    Scenario(`Use readable piping with ${name} stream errored`, () => {
      let error
      let piping
      let readable
      let transform1
      let transform2
      let transform3

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

      When('readable piping is created', () => {
        piping = new PromiseReadablePiping(readable, transform1, transform2, transform3)
      })

      And('all of content is read', async () => {
        try {
          await piping.readAll()
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
