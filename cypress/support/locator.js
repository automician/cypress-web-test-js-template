
export class Locator {
  constructor(selector) {
    this.selector = selector
  }

  get() {
    return cy.the(this.selector)
  }

  // --- Element builders --- //

  /* TODO: should we made _filter public?
   *       pros
   *       + for consistency with Cypress
   *       cons
   *       - too much methods, easy to lost
   *       - might be not KISS if this.by is not just alias to this.filter, but adds additional conversions
   *         then shouldn't we add conversions to this.filter too?
   *         shouln't we then remove this.by at all? 
   */
  _filter(selector, options={}) {
    return this.get().filter(selector, options)
  }

  by(selector, options={}) {
    // const isWordWithDashesUnderscoresOrNumbers = (selector) => {
    //   return /^[a-zA-Z_0-9\-]+$/g.test(selector)
    // }
    if (typeof selector === 'function') {
      return this._filter(selector, options)
    } else if (selector.startsWith('text=')) {
      return this._filter(`:contains(${selector.substring(5)})`, options)
    } else if (selector.startsWith(' ') || selector.startsWith('>')) {  // TODO: should we count here + and ~ ? 
      return this._filter(`:has(${selector})`, options)
    // // TODO: do we need to understand words as data-qa attr values?
    // //       same way like we do in custom cy.the(selector) ?  
    // } else if (isWordWithDashesUnderscoresOrNumbers(selector)) {  
    //   return this._filter(`[data-qa=${selector}]`, options)
    } else {
      return this._filter(selector, options)
    }
  }

  // --- Assertions --- //

  should(match, ...expected) {
    return this.get().should(match, ...expected)
  }

  // --- Actions --- //

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