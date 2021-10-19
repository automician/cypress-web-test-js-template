// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


global.browser = cy


import { Locator } from './locator'
global.s = (selector) => new Locator(selector)


global.be = {
  empty: 'be.empty',
  enabled: 'be.enabled',
  not: {
    empty: 'not.be.empty',
    enabled: 'not.be.enabled',
  }
}

global.have = {
  length: 'have.length',
  no: {
    length: 'not.have.length',
  }
}