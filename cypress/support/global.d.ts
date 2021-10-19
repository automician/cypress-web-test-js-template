/// <reference types='cypress' />
/// <reference types='./locator' />


/**
 * user-oriented alias to `cy`
 */
 declare const browser: Cypress.cy


 /**
  * Gives a Lazy alternative to cy.get(selector)
  * @param selector = a string with css selector
  * @example
  * s('#foo').get().setValue('bar')
  * # over
  * # cy.get('#foo').setValue('bar')
  */
declare function s(selector: string): Locator
