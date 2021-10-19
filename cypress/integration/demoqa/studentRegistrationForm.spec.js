
describe('Student Registration Form', () => {
  it('can be submitted', () => {
    browser.visit('https://demoqa.com/automation-practice-form')
  
    cy.$('[placeholder="First Name"]').should('be.empty').setValue('Yasha')
  
    cy.$('text=Submit').click()
  })
})