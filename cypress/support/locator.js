

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

    /**
     * GIVEN
     * const toggle = new Locator(
     *   {path: '.todo'}
     * ).filter(':contains(test)').find('.toggle')
     * WHEN
     * toggle.click()
     * THEN
     * before actual clicking and actual quering elements, that is similar to JQuery's
     * $('.todo').filter('.contains(test)').find('.toggle')
     * all guards will be called
     * to ensure that the `.filter('.contains(test)').find('.toggle')` chain will pass
     * (Cypress can't ensure this, becauase it retries only the last command in a chain)
     * So... guards will be called...
     * In this example there will be 2 guards for each query after get – 
     * one for .filter('contains(test)') 
     * second for .filter('.contains(test)').find('.toggle')
     * we need two of them, because we want to know exactly
     * which part of the chain fails...
     * again...
     * though technically ensuring just the last guard
     * .filter('.contains(test)').find('.toggle')
     * would be enough
     * we want to know, whether we couldn't find the .todo with «test» text
     * or we couldn't find the .toggle inside existing .todo with «test» text
     * that's why we need to run also first guard .filter('contains(test)') 
     * And here goes the question:
     * if the last guard passes, why do we need to run first, 
     * if we already ensured that everything is find with our chain?
     * Seems like - no, it's ok to skip the first guard.
     * We would need to run the first guard, only if the last one failed... 
     * Looks like a reasonable optimization to the algorithm of running all guards:
     * - run all guards in reversed order from last to first, 
     *   - breaking on first passed guard
     * But here goes the problem...
     * Since our guards are based on cy.should(callback),
     * There is no way to check its failure... 
     * We can't catch cypress exceptions in a way to handle it in the chain of guards...
     * see more at: https://docs.cypress.io/guides/core-concepts/conditional-testing#Error-Recovery
     * Hence, something like this
     * 
     
    if (
      Array.isArray(this.chain.guards) 
      && this.chain.guards.length === 0
    ) return

    const [last, ...rest] = this.chain.guards.reverse()
    rest.reduce(
      (prev, guard) => {
        return prev.then(
          ({passed}) => {
            return passed
              ? {passed}
              : guard().then(
                result => ({passed: result}), error => ({failed: error})
              )
          }
        )
      }, 
      last().then(
        result => ({passed: result}), error => ({failed: error})
      ),
    ).then(
      ({failed}) => {
        if (failed) throw failed
      }
    )

     **... will never work, unfortunately :(
       maybe...
     * TODO: we could use cy.then(callback) + custom retry-ability impl
     *       instead of cy.should(callback) with built in retry-ability
     * but who knows how easy would it be to implement custom impl of retry-ability
     * maybe one day we try... 
     * 
     * but for now let's stick to simple, not oprimized implementation: 
     */
    this.chain.guards.forEach((guard) => {
      guard()
    })
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
    /**
     * first we run all guards, 
     * i.e. assertions ensuring that next queries chain can pass
     * (we have to do this in forwards, 
     * because cypress can retry only the last query in a chain)
     */
    this._guarded() /** here we don't use any return value for reuse
     **because:
     * 1 we will have only result of first cy.get returned (not other sub-queries)
     * 2 we disabled logging for this first cy.get 
     *   because we don't want the clutter from all guards in log
     *   so such reused cy.get - will don't give valuable info in logs
     * also... it's kind of not pretty idiomatic to store results of cy.get :)
     */

    /**
     * yet on finaly step of providing queried elements
     * we could reuse both cy.get result 
     * and even internal full path queried elements
     * via aliases
     * but again... we would lost logging... 
     * logging from cy.get is disabled
     * and logging from sub-queries was just not created
     * because we executed sub-queries in guards through JQuery
     */
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
          () => this.chain.get({log: false}).should(($elements) => {  // TODO: move this pattern of "hiding assertions" to a separate function
            const $queried = this._queryFrom($elements)

            /**
             * if current guard passes, we could remember via alias the queried elements
             * like this:
             
            cy.wrap($queried).as('__last_queried__')
             
             * each next guard would rewrite this alias
             * so finally, after all guards, 
             * we would have last queried for reuse in following action like .click()
             * yet, on DOM change (Stale Elements), 
             * such «aliased cash» will be rerendered by Cypress,
             * see for more: 
             * https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Stale-Elements
             * 
             * so why not do this?
             * becase we will loose the logging of all query path by Cypress
             * that's why, for now, we can't reuse cashed elements from guards
             * :(
             * TODO: maybe, if we find the way to cash «cypress logs»
             *       in addition to corresponding queried elements, 
             * then we can come back to this idea...
             */

            $queried.selector = this.chain.path
            const actualElementsLength = query($queried).length
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
                + `\n${$queried}` // TODO: fix queried object stringification, that currently is [object Object] :(
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
