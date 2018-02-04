'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const PromiseReadablePiping = require('../lib/promise-readable-piping').PromiseReadablePiping

const MyReadable = require('./lib/my-readable')
const MyTransform = require('./lib/my-transform')

Feature('Test promise-readable-piping module', () => {
  Scenario('Use readable piping', () => {
    let content
    let piping
    let readable
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

    And('all of content is read', () => {
      return piping.readAll().then((buffer) => {
        content = String(buffer)
      })
    })

    Then('content is correct', () => {
      content.split('\n').length.should.equal(11)
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

      And('all of content is read', () => {
        return piping.readAll()
          .catch((err) => {
            error = err
          })
      })

      Then('error is caught', () => {
        error.should.be.an('Error').and.have.property('message', name)
      })
    })
  }

  Scenario('Use nested readable piping', () => {
    let content
    let piping1
    let piping2
    let piping3
    let readable
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

    When('readable piping1 is created', () => {
      piping1 = new PromiseReadablePiping(readable, transform1)
    })

    And('readable piping2 is created', () => {
      piping2 = new PromiseReadablePiping(piping1, transform2)
    })

    And('readable piping3 is created', () => {
      piping3 = new PromiseReadablePiping(piping2, transform3)
    })

    And('all of content is read', () => {
      return piping3.readAll().then((buffer) => {
        content = String(buffer)
      })
    })

    Then('content is correct', () => {
      content.split('\n').length.should.equal(11)
    })
  })

  for (const name of ['readable', 'transform1', 'transform2', 'transform3']) {
    Scenario(`Use nested readable piping with ${name} stream errored`, () => {
      let error
      let piping1
      let piping2
      let piping3
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

      When('readable piping1 is created', () => {
        piping1 = new PromiseReadablePiping(readable, transform1)
      })

      And('readable piping2 is created', () => {
        piping2 = new PromiseReadablePiping(piping1, transform2)
      })

      And('readable piping3 is created', () => {
        piping3 = new PromiseReadablePiping(piping2, transform3)
      })

      And('all of content is read', () => {
        return piping3.readAll()
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
