
export class Locator {
  constructor(selector) {
    this.selector = selector
  }

  get(options={}) {
    return cy.the(this.selector, options)
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

  /** @param {string} selector */
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

  /* You can consider override original cy.find(selector, options) 
   * for same behaviour as below
   * Here we build the corresponding assertion only into Locator's find
   * to leave the original cypress behaviour untouch and so move obvious
   * to the common Cypress user
   * 
   * By the way, we could name the method below as `element` 
   * for consistency with Selene from Python,
   * but we can't do this, because in Cypress and JQuery 
   * we don't have separation betwean element and elements collection,
   * hence, we should use more "general" name, like `find` ;)
   */
  find(selector, options={}) {
    return this.should(have.elements, selector).find(selector, options)
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

  setValue(text, options={}) {
    return this.get().setValue(text, options)
  }

  click(options={}) {
    return this.get().click(options)
  }

  doubleClick(options={}) {
    return this.get().dblclick(options)
  }

  hover(options={}) {
    return this.get().trigger('mouseover', options)
  }

  pressEnter(options={}) {
    return this.get().pressEnter(options)
  }

  pressEscape(options={}) {
    return this.get().pressEscape(options)
  }
}