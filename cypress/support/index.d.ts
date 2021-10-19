/// <reference types="cypress" />


declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Combines .clear().type('value') into one .setValue('value') 
     * @example
     * cy.get('#foo').setValue('bar')
     */
    setValue(value: string): Chainable<any> // TODO: shouldn't it be Chainable<Subject> here?

    /**
     * Alias to .type('{enter}')
     * @example
     * cy.get('#comment').type('hello, world!').pressEnter()
     */
    pressEnter(): Chainable<any>

    // TODO: consider ranaming $ to something else to have no conflicts with Cypress.$ 
    //       that is an exposed JQuery's $ from Cypress context
    //       maybe to something like cy.by(selector)
    //       or made by as alias to get
    //       then override get to be like the $ implemenation below
    /**
     * Alias to cy.get(selector) with extra features:
     * - if starts with 'text=Some text' then equals to cy.contains('Some text')
     * - if contains only words separated by _ or - then equals to cy.get(`[data-qa=${selector}]`)
     * - equals to cy.get(selector) otherwise
     * @example
     * cy.$('text=Element containing this text').click()
     * cy.$('element-with-dedicated-data-qa-attribute-value').click()
     * cy.$('#element-with-standard-id-attribute').click()
     */
    $(value: string): Chainable<any>
  }
}
