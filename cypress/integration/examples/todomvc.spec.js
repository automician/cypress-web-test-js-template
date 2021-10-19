
describe('TodoMVC user', () => {
  it('completes todo', () => {
    const newTodo = s('#new-todo')
    const todos = s('#todo-list>li')

    browser.visit('https://todomvc.com/examples/emberjs/')

    newTodo.type('a').pressEnter()
    newTodo.type('b').pressEnter()
    newTodo.type('c').pressEnter()
    todos.should(have.length, 3)
    // todos.should(have.texts, 'a', 'b', 'c')
    // vs ?
    // todos.should(have.texts('a', 'b', 'c'))
  })

  it('completes todo [ raw Cypress style ]', () => {
    const newTodo = () => cy.get('#new-todo')
    const todos = () => cy.get('#todo-list>li')

    cy.visit('https://todomvc.com/examples/emberjs/')

    newTodo().type('a{enter}')
    newTodo().type('b{enter}')
    newTodo().type('c{enter}')
    todos().should('have.length', 3)
  })
})