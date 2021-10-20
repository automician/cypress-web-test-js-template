/// <reference types="cypress" />

declare class Locator {
  get(): Cypress.Chainable<any>

  // --- Element builders --- //

  /**
   * Filters the located elements by selector with some extra shortcuts,
   * see examples below for docs;)
   * @example
   * const s => (selector) => new Locator(selector) 
   * s('.todo').by(':contains("Write a test!")')
   * s('.todo').by('text=Write a test')  // same as above
   * s('.todo').by('.completed')  // same as cy.get('.todo').filter('.completed')
   * s('.todo').by(':not(.completed)')  // same as cy.get('.todo').not('.completed')
   * s('.todo').by(':has(img.high-priority-flag)')  // same as cy.get('.todo').filter(':has(img.high-priority-flag)')
   * s('.todo').by(' img.high-priority-flag')  // same as above
   * s('.todo').by(':has(>img.high-priority-flag)')
   * s('.todo').by('>img.high-priority-flag')  // same as above
   */
  by<E extends Node = HTMLElement>(
    selector: string, 
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
  ): Cypress.Chainable<JQuery<E>>

  /**
   * Filters the located elements by function-predicate.
   * Is simply an alias to `.filter(fn, options)` from Cypress
   * @example
   * const s => (selector) => new Locator(selector) 
   * s('.number').by((i, e) => i % 2 == 0 && e.innerText.includes('I am even!'))
   */
  by<E extends Node = HTMLElement>(
    fn: (index: number, element: E) => boolean, 
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
  ): Cypress.Chainable<JQuery<E>>

  // --- Assertions --- //

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

  // --- Actions --- //

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