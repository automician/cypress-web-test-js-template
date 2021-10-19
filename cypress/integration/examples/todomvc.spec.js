
describe('TodoMVC user', () => {
  it('completes todo', () => {
    browser.visit('https://todomvc.com/examples/emberjs/')

    s('#new-todo').get().type('a').pressEnter()
    s('#new-todo').get().type('b').pressEnter()
    s('#new-todo').get().type('c').pressEnter()
    s('#todo-list>li').get().should('have.length', 3)

  })

  it('completes todo [ raw cypress style ]', () => {
    cy.visit('https://todomvc.com/examples/emberjs/')

    cy.get('#new-todo').type('a{enter}')
    cy.get('#new-todo').type('b{enter}')
    cy.get('#new-todo').type('c{enter}')
    cy.get('#todo-list>li').should('have.length', 3)
  })
})