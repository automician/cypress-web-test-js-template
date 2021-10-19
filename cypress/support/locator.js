
export class Locator {
  constructor(selector) {
    this.selector = selector
  }

  get() {
    return cy.by(this.selector)
  }

  should(match, ...expected) {
    return this.get().should(match, ...expected)
  }

  type(text, options={}) {
    return this.get().type(text, options)
  }

  clear(options={}) {
    return this.get().clear(options)
  }

  submit(options={}) {
    return this.get().submit(options)
  }

  setValue(text) {
    return this.get().type(text)
  }

  click(options={}) {
    return this.get().click(options)
  }

  doubleClick() {
    return this.get().dblclick()
  }

  hover() {
    return this.get().trigger('mouseover')
  }

  pressEnter() {
    return this.get().pressEnter()
  }

  pressEscape() {
    return this.get().pressEscape()
  }
}