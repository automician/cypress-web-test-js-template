describe('TodoMVC user', () => {
  it('completes todo', () => {
    const newTodo = s('#new-todo')
    const todos = s('#todo-list>li')

    browser.visit('https://todomvc.com/examples/emberjs/')

    newTodo.type('a').pressEnter()
    newTodo.type('b').pressEnter()
    newTodo.type('c').pressEnter()
    todos.should(have.exactTexts, 'a', 'b', 'c')
  })

  it('completes todo [ raw Cypress style ]', () => {
    const newTodo = () => cy.get('#new-todo')
    const todos = () => cy.get('#todo-list>li')

    cy.visit('https://todomvc.com/examples/emberjs/')

    newTodo().type('a{enter}')
    newTodo().type('b{enter}')
    newTodo().type('c{enter}')
    todos().should(($elements) => {
      const actualTexts = $elements.map((i, element) => {
        return Cypress.$(element).text().trim()
      }).get()
    
      expect(actualTexts).to.deep.eq(['a', 'b', 'c'])
    })
  })

  it('completes todo [ raw Cypress style + custom function-assertion ]', () => {
    const newTodo = () => cy.get('#new-todo')
    const todos = () => cy.get('#todo-list>li')
    const haveExactTexts = (...texts) => ($elements) => {
      const actualTexts = $elements.map((i, element) => {
        return Cypress.$(element).text().trim()
      }).get()
    
      expect(actualTexts).to.deep.eq(texts)
    }

    cy.visit('https://todomvc.com/examples/emberjs/')

    newTodo().type('a{enter}')
    newTodo().type('b{enter}')
    newTodo().type('c{enter}')
    todos().should(haveExactTexts('a', 'b', 'c'))
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
    todos().should('haveExactTexts', 'a', 'b', 'c')
  })
})