/// <reference types="cypress" />

declare class Locator {
  get(): Cypress.Chainable<any>
}