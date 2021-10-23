describe('TodoMVC user', () => {
  it('completes todo', () => {
    // just a few vars to show what Cypress can't ;)
    const newTodo = s('#new-todo')
    const todos = s('#todo-list>li')

    browser.visit('https://todomvc.com/examples/emberjs/')

    newTodo.type('a').pressEnter()
    newTodo.type('b1').pressEnter()
    newTodo.type('b2').pressEnter()
    newTodo.type('c').pressEnter()
    todos.should(have.exactTexts, 'a', 'b1', 'b2', 'c')

    todos.by('text=b').find('.toggle').click()
    todos.by('.completed').should(have.exactTexts, 'b1')
    todos.by('text=b').not('.completed').should(have.exactTexts, 'b2')

    todos.by('text=b').not('.completed').find('.toggle').click()
    todos.by('.completed').should(have.exactTexts, 'b1', 'b2')
    todos.not('.completed').should(have.exactTexts, 'a', 'c')
  })

  /* --- Below we compare this Framework with raw Cypress --- *
   * 
   * Probably using variables and functions below
   * to make more readable is redundant here
   * But we do it also to show
   * that even applying such self-documenting code techniques 
   * and DRY principle we still have
   * a lot of complexity on the implementation side
   * of such action-helpers on the Cypress side
   * 
   */

  it('completes todo (closest to Cypress style)', () => {
    const newTodo = s('#new-todo')
    const todos = s('#todo-list>li')
    const completed = todos.filter('.completed')
    const active = todos.not('.completed')
    const complete = (todo) => {
      todos.filter(`:contains(${todo})`).find('.toggle').click()
    }

    browser.visit('https://todomvc.com/examples/emberjs/')

    newTodo.type('a').pressEnter()
    newTodo.type('b').pressEnter()
    newTodo.type('c').pressEnter()
    todos.should(have.exactTexts, 'a', 'b', 'c')

    complete('b')
    completed.should(have.exactTexts, 'b')
    active.should(have.exactTexts, 'a', 'c')
  })

  it('completes todo [ raw Cypress + custom function-assertions ]', () => {
    const haveExactTexts = (...texts) => ($elements) => {
      const actualTexts = $elements.map((i, element) => {
        return Cypress.$(element).text().trim()
      }).get()
    
      expect(actualTexts).to.deep.eq(texts)
    }
    const haveFiltered = (selector) => ($elements) => {
      expect($elements.filter(selector).length).to.be.at.least(1)
    }

    const newTodo = () => cy.get('#new-todo')
    const todos = () => cy.get('#todo-list>li')
    const completed = () => todos().filter('.completed')
    const active = () => todos().not('.completed')
    const complete = (todo) => {
      const containsTodo = `:contains(${todo})`
      const toggle = '.toggle'
      todos()
        // needed for better debug: 
        // to separate error when we have no b from have no .toggle inside
        .should(haveFiltered(containsTodo)) 
        // needed for complete stability 
        // (see https://docs.cypress.io/guides/core-concepts/retry-ability#Alternate-commands-and-assertions)
        .should(haveFiltered(`${containsTodo}:has(${toggle})`))
        .filter(containsTodo)
        .find(toggle)
        .click()
    }

    cy.visit('https://todomvc.com/examples/emberjs/')

    newTodo().type('a').pressEnter()
    newTodo().type('b').pressEnter()
    newTodo().type('c').pressEnter()

    complete('b')
    completed().should(haveExactTexts('b'))
    active().should(haveExactTexts('a', 'c'))

    // ...
  })

  it('completes todo [ ... + custom chai-assertion with better error]', () => {
    const newTodo = () => cy.get('#new-todo')
    const todos = () => cy.get('#todo-list>li')
    chai.Assertion.addMethod('haveExactTexts', function (...texts) {
      const $elements = this._obj
      const actualTexts = $elements.map((i, element) => { 
        return Cypress.$(element).text().trim()
      }).get()

      this.assert(
        // expression to be tested
        actualTexts.length === texts.length 
        && actualTexts.every((actual, i) => actual === texts[i]),
        // msg or fn to describe failure
        `elements by ${$elements.selector} `
        + 'should have exact texts: #{exp}'
        + '\nactual texts: #{act}'
        + '\nactual colllection:'
        + '\n#{this}'
        ,    
        // msg or fn to describe negated failure
        `expected elements by ${$elements.selector} `
        + 'to not have exact texts: #{exp}'
        + '\nactual texts: #{act}'
        + '\nactual colllection:'
        + '\n#{this}'
        ,    
        // expected
        texts,
        // actual
        actualTexts, 
        // show diff?
        false, 
      )
    })

    cy.visit('https://todomvc.com/examples/emberjs/')

    newTodo().type('a{enter}')
    newTodo().type('b{enter}')
    newTodo().type('c{enter}')
    // @ts-ignore
    todos().should('haveExactTexts', 'a', 'b', 'c')

    // same as in previous example...
  })
})