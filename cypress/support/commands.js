// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'setValue', 
  { prevSubject: 'element'}, 
  (subject, value, options={}) => { 
    // TODO: shouldn't we use cy.wrap over cy.get below? need to check some official examples of custom commands...
    cy.get(subject).clear().type(value, options)
  }
)

Cypress.Commands.add(
  'pressEnter', 
  { prevSubject: 'element'}, 
  (subject, options={}) => { 
    cy.get(subject).type('{enter}', options)
  }
)

Cypress.Commands.add(
  'pressEscape', 
  { prevSubject: 'element'}, 
  (subject, options) => { 
    cy.get(subject).type('{esc}', options)
  }
)

/* You can consider overriding the 'get' cypress command
 * But in this framework we kept the original 'get' without extra magic
 * for consistency with Cypress and easier understanding by newcomers
 * which can be lost in the variety of differences 
 */
Cypress.Commands.add('the', (selector, options={}) => {
  // TODO: find better name
  //       now it's called by definite article «the»
  //       pointing to the fact that it will find the actual element in DOM
  //       i.e. it's not Lazy element (that probably would use indefinite «a» or «an»)
  // TODO: make it also work at "subject" context

  const isWordWithDashesUnderscoresOrNumbers = (selector) => {
    return /^[a-zA-Z_0-9\-]+$/g.test(selector)
  }

  // TODO: consider moving these selectors transformations to config or plugins 
  if (selector.startsWith('text=')) {  
    return cy.contains(selector.substring(5), options)
  } else if (isWordWithDashesUnderscoresOrNumbers(selector)) {
    return cy.get(`[data-qa=${selector}]`, options)
  } else {
    return cy.get(selector, options)
  }
})

Cypress.Commands.add(
  'by', 
  { prevSubject: 'element'}, 
  (subject, selector, options) => { 

    // const isWordWithDashesUnderscoresOrNumbers = (selector) => {
    //   return /^[a-zA-Z_0-9\-]+$/g.test(selector)
    // }
    if (typeof selector === 'function') {
      return cy.wrap(subject).filter(selector, options)
    } else if (selector.startsWith('text=')) {
      /**
       * TODO: consider customizing Cypress logs ...
      Cypress.log({
        $el: subject,
        name: 'by',
        message: `${selector} (~> .filter(:contains${selector.substring(5)}))`,
      })
       * right now, we just keep it logged same way and in Cypress
       * i.e. we see the "filter" command being called in the log
       * this might be good, as we see the actual happening under the hood
       * yet... adding "by" context might help to identify where in the code
       * was this call that we see in the log as "filter" ;)
       */
      return cy.wrap(subject).filter(
        `:contains(${selector.substring(5)})`, 
        options,
      )
    } else if (selector.startsWith(' ') || selector.startsWith('>')) {  // TODO: should we count here + and ~ ? 
      return cy.wrap(subject).filter(`:has(${selector})`, options)
    // // TODO: do we need to understand words as data-qa attr values?
    // //       same way like we do in custom cy.the(selector) ?  
    // } else if (isWordWithDashesUnderscoresOrNumbers(selector)) {  
    //   return this._filter(`[data-qa=${selector}]`, options)
    } else {
      return cy.wrap(subject).filter(selector, options)
    }
  }
)

/* --- Cypress Command Overrides --- 
 *
 * see some good example at: 
 * https://docs.cypress.io/api/cypress-api/custom-commands#Overwrite-type-command 
 */

Cypress.Commands.overwrite(
  'not',
  (originalFn, subject, selector, options = {}) => {
    if (typeof selector === 'function') { 
      return originalFn(subject, selector, options)
    } else if (selector.startsWith('text=')) {
      return originalFn(subject, `:contains(${selector.substring(5)})`, options)
    } else if (selector.startsWith(' ') || selector.startsWith('>')) {  // TODO: should we count here + and ~ ? 
      return originalFn(subject, `:has(${selector})`, options)
    } else {
      return originalFn(subject, selector, options)
    }
  }
)
