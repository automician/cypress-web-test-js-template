
export class Locator {
  constructor(selector) {
    this.selector = selector
  }

  get() {
    return cy.by(this.selector)
  }
}