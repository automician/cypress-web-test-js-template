
describe('Student Registration Form', () => {
  it('can be submitted', () => {
    cy.visit('https://demoqa.com/automation-practice-form')
  
    cy.$('[placeholder="First Name"]').should('be.empty').setValue('Yasha')
  
    cy.$('text=Submit').click()
  })
})