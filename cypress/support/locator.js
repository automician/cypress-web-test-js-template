
export class Locator {
  constructor(selector) {
    this.selector = selector
  }

  get() {
    return cy.$(this.selector)
  }
}