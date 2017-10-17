'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

Feature('Test promise-piping module', () => {
  Scenario('Module compiles', () => {
    let PromisePiping

    When('PromisePiping class is required', () => {
      PromisePiping = require('../lib/promise-piping').PromisePiping
    })

    Then('PromisePiping class is ok', () => {
      return PromisePiping.should.be.ok
    })
  })
})
