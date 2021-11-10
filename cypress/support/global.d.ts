/// <reference types='cypress' />
/// <reference types='./locator' />

import { Locator } from "./locator";

declare global {

  /**
   * user-oriented alias to `cy`
   */
  const browser: Cypress.cy


  /**
    * Gives a Lazy alternative to cy.get(selector)
    * @param selector = a string with css selector
    * @example
    * s('#foo').get().setValue('bar')
    * # over
    * # cy.get('#foo').setValue('bar')
    */
  function s(selector: string): Locator

}
