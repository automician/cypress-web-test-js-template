/// <reference types="cypress" />


declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Combines .clear().type('value') into one .setValue('value') 
     * @example
     * cy.get('#foo').setValue('bar')
     */
    setValue(
      value: string,
      options?: Partial<Cypress.TypeOptions>,
    ): Cypress.Chainable<JQuery<any>>

    /**
     * Alias to .type('{enter}')
     * @example
     * cy.get('#comment').type('hello, world!').pressEnter()
     */
    pressEnter(
      options?: Partial<Cypress.TypeOptions>
    ): Cypress.Chainable<JQuery<any>>

    /**
     * Alias to .type('{esc}')
     * @example
     * cy.get('#comment').type('hello, world!').pressEscape()
     */
    pressEscape(
      options?: Partial<Cypress.TypeOptions>
    ): Cypress.Chainable<JQuery<any>>

    /**
     * Alias to cy.get(selector, options) with extra features:
     * - if starts with 'text=Some text' then equals to cy.contains('Some text')
     * - if contains only words separated by _ or - then equals to cy.get(`[data-qa=${selector}]`)
     * - equals to cy.get(selector) otherwise
     * You can consider overriding original cy.get for same behavior;)
     * @example
     * cy.the('text=Element containing this text').click()
     * cy.the('element-with-dedicated-data-qa-attribute-value').click()
     * cy.the('#element-with-standard-id-attribute').click()
     */
    the<E extends Node = HTMLElement>(
      selector: string, 
      options?: Partial<
        Cypress.Loggable 
        & Cypress.Timeoutable 
        & Cypress.Withinable 
        & Cypress.Shadow
      >,
    ): Cypress.Chainable<JQuery<E>>

    /**
     * Filters the located elements by selector like cy.filter(selector)
     * adding some extra shortcuts (automatic selector conversions),
     * @example
     * const s => (selector) => new Locator({path: selector}) 
     * cy.get('.todo').by(':contains("Write a test!")')
     * cy.get('.todo').by('text=Write a test')  // same as above
     * cy.get('.todo').by('.completed')  // same as cy.get('.todo').filter('.completed')
     * cy.get('.todo').by(':not(.completed)')  // same as cy.get('.todo').not('.completed')
     * cy.get('.todo').by(':has(img.high-priority-flag)')  // same as cy.get('.todo').filter(':has(img.high-priority-flag)')
     * cy.get('.todo').by(' img.high-priority-flag')  // same as above
     * cy.get('.todo').by(':has(>img.high-priority-flag)')
     * cy.get('.todo').by('>img.high-priority-flag')  // same as above
     */
    by<E extends Node = HTMLElement>(
      selector: string, 
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
    ): Cypress.Chainable<JQuery<E>>
  }
}