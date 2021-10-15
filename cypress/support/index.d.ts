/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Combines .clear().type('value') into one .setValue('value') 
     * @example
     * cy.get('#foo').setValue('bar')
     */
    setValue(value: string): Chainable<any>
  }
}