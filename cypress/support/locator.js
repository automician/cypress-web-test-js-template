

/*
 * Locator class implements lazy alternatives
 * to Cypress queriable commands like get, filter, find, eq, etc.
 * 
 * Such query commands are also known as «element builders»
 * in frameworks like Selenide, Selene, etc, 
 * because provide a similar to «builder pattern» API
 * to build your elements queries in a composable way 
 * like `$('.todo').filter('.active').find('.toggle')`
 * and, because of «lazy» nature, allowing to store them in vars
 * like 
 * `const todoToggle = $('.todo').filter('.active').find('.toggle')`
 * that you can't do in raw Cypress;)
 * 
 * In addition to laziness Locator class' queries
 * have built in assertions to ensure all sub-queries will pass
 * without Cypress' limitation on retryability
 * (see more at https://docs.cypress.io/guides/core-concepts/retry-ability#Only-the-last-command-is-retried)
 * 
 * Somewhere in your framework you can consider 
 * just overriding original Cypress' filter, find, eq & co
 * to achieve similar retriability, if you don't need it
 * in combination with lazyness. Yet it would be less powerfull
 * because can't see into future and buid in assertions for next queries.
 * Nevertheless, if you need the full retriability built in
 * and lazyness for all queries written in a row – 
 * here we go with a Locator class;)
 * 
 * Some Locator's queries have a different name than in Cypress,
 * e.g. the `Locator.by(selector)` is similar to `cy.filter(selector)`
 * We add such «extra aliases» when we add something additinal 
 * on the top of "lazyness + retriability". 
 * The mentioned `by(selector)` query adds additional conversions
 * to the original filter, 
 * like `by('>.edit')` converts automatically to `filter('has(.edit)')`.
 * 
 * Otherwise, if we can't add any extra bonus to existing cy query,
 * we keep it name the same.
 * E.g. while eq in `.filter('.completed').eq(index)`
 * is pretty not obvious for a common web user
 * and something like `.filter('.completed').at(index)`
 * could be much more readable, we keep the Locator's version
 * of the query – named as `eq` – same as in Cypress,
 * in order to not overcomplicate things. 
 * We already build pretty complicated wrapper over pretty complex internally Cypress
 * with pretty big documentation – let's not add even more complexity:)
 * 
 */
export class Locator {

  constructor(
    {
      path, 
      get=((opts={}) => cy.the(path, {...options, ...opts})),  // TODO: can we eliminate this «root query»? and use just queries below? 
      guards=[], 
      queries=[],
    }, 
    options={},
  ) {

    this.chain = {
      path,
      get,
      guards,
      queries,
    }

    /**
     * the type below is the most general, relevant to the cy.get command options
     * but 
     * when locator reflects the .find command being called in the chain
     *     then the type should be {Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Shadow>}
     * when locator reflects the .filter command being called in the chain
     *     then the type should be {Partial<Cypress.Loggable & Cypress.Timeoutable>}
     *     but... by the way, it's weird why the original cy.filter can't look into shadow... 
     * @type {Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>} */
    this.options = options // TODO: do we even need this options right now? maybe we need... but they might be our own...
  }

  _guarded() {
    let last
    this.chain.guards.forEach((guard) => {
      last = guard()
    })
    return last  // TODO: do we need to return here anything?
  }

  _queryFrom(subject) {
    return this.chain.queries.reduce((acc, query) => {
      return query(acc)
    }, subject)
  }

  _queryFromRoot() {
    return this._queryFrom(this.chain.get())
  }

  get() {
    this._guarded()
    return this._queryFromRoot()
  }


  /**
   * @param {{path: string, query}} details
   * @param {Partial<Cypress.Loggable & Cypress.Timeoutable>} options 
   * @returns {Locator}
   * @private
   */
  _subQuery({path, query}, options={}) {
    return new Locator(
      {
        path: `${this.chain.path} ${path}`,
        get: this.chain.get, 
        guards: [
          ...this.chain.guards,
          () => this.chain.get({log: false}).should(($elements) => {
            const queried = this._queryFrom($elements)
            queried.selector = this.chain.path
            const actualElementsLength = query(queried).length
            /**
             * Cypress can't hide assertions from log
             * (see more at https://github.com/cypress-io/cypress/issues/7693).
             * It also can't retry 
             * and even correctly process an exception that is not Chai based.
             * So we have to simulate hiding assertions on «passed»
             * by the pre-filtering for length above 
             * and the following if with «hidden» assertion in it...
             */
            if (actualElementsLength === 0) {
              // @ts-ignore
              // expect(queried).to.have.filtered(selector)
              /* the previous version would re-query all chain making it slower
               * in fact we need to wrap into assertion just check for actualFilteredLength
               * but then we have to add a bit of duplication in context of customizing error message
               */
              expect(actualElementsLength).to.be.at.least(1, 
                `${this.chain.path} `
                + `should have at least 1 element by ${path}`
                + `\nactual elements length: ${actualElementsLength}`
                + '\nactual colllection:'
                + `\n${queried}`
              )
            }
          })  // TODO: is it possible to cash and reuse aftewards in query?
        ],
        queries: [
          ...this.chain.queries, 
          query
        ],
      }, 
      options
    )
  }

  /* --- Element builders (sub-queries) --- */

  filter(selector, options={}) {
    /**
     * we could specify the path like `.filter(${selector})`
     * but we choose `-filter ${selector}` style
     * to match the style of Cypress logs in context of commands ;)
     */
    const path = `-filter ${selector}`
    const query = (subject) => subject.filter(selector, options)

    return this._subQuery({ path, query })
  }

  by(selector, options={}) {
    // const isWordWithDashesUnderscoresOrNumbers = (selector) => {
    //   return /^[a-zA-Z_0-9\-]+$/g.test(selector)
    // }
    if (typeof selector === 'function') {
      return this.filter(selector, options)
    } else if (selector.startsWith('text=')) {
      return this.filter(`:contains(${selector.substring(5)})`, options)
    } else if (selector.startsWith(' ') || selector.startsWith('>')) {  // TODO: should we count here + and ~ ? 
      return this.filter(`:has(${selector})`, options)
    // // TODO: do we need to understand words as data-qa attr values?
    // //       same way like we do in custom cy.the(selector) ?  
    // } else if (isWordWithDashesUnderscoresOrNumbers(selector)) {  
    //   return this._filter(`[data-qa=${selector}]`, options)
    } else {
      return this.filter(selector, options)
    }
  }

  find(selector, options={}) {
    const path = `-find ${selector}`
    const query = (subject) => subject.find(selector, options)

    return this._subQuery({ path, query })
  }

  eq(index, options={}) {
    const path = `-eq ${index}`
    const query = (subject) => subject.eq(index, options)

    return this._subQuery({ path, query })
  }

  /* --- Assertions --- */

  should(match, ...expected) {
    return this.get().should(match, ...expected)
  }

  /* --- Actions --- */

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
    if (options.multiple) { // TODO: probably we need same for other actions...
      return this.get().click(options)
    }
    return this.get().first().click(options)
  }

  doubleClick(options={}) {
    return this.get().dblclick(options)
  }

  hover(options={}) { // TODO: consider deleting this method... since will not work pretty often...
    return this.get().trigger('mouseover', options)
  }

  pressEnter(options={}) {
    return this.get().pressEnter(options)
  }

  pressEscape(options={}) {
    return this.get().pressEscape(options)
  }
}
