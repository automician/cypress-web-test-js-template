/// <reference types="cypress" />

declare class Locator {
  get(): Cypress.Chainable<any>

  /**
   * Call it if you exactly know the condition and its params to match
   * Otherwise start typing from `.get().should(` 
   * to use Autocomplete hints from original Cypress API
   * @param match – a common chainer from ChaiJs, like 'have.text'
   * @param actual - variable arguments reflecting the expectaction of assertion
   * @example
   * cy.get('#primary-btn').should('be.enabled')
   * cy.get('#primary-btn').should('have.text', 'Ok')
   * cy.get('#save-btn').should('have.attr', 'role', 'action')
   */
  should(match: string, ...expected: any[]): Cypress.Chainable<JQuery<HTMLElement>>

  type(text: string, options?: Partial<Cypress.TypeOptions>): Cypress.Chainable<JQuery<HTMLElement>>

  clear(options?: Partial<Cypress.ClearOptions>): Cypress.Chainable<JQuery<HTMLElement>>

  submit(options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Cypress.Chainable<JQuery<HTMLElement>>

  setValue(text: string): Cypress.Chainable<JQuery<HTMLElement>>

  click(options?: Partial<Cypress.ClickOptions>): Cypress.Chainable<JQuery<HTMLElement>>

  doubleClick(options?: Partial<Cypress.ClickOptions>): Cypress.Chainable<JQuery<HTMLElement>>

  /**
   * Simulates hover via .trigger('mousover')
   */
  hover(): Cypress.Chainable<JQuery<HTMLElement>>

  pressEnter(): Cypress.Chainable<JQuery<HTMLElement>>

  pressEscape(): Cypress.Chainable<JQuery<HTMLElement>>
}