
describe('Student Registration Form', () => {
  it('can be submitted', () => {
    browser.visit('https://demoqa.com/automation-practice-form')

    s('[placeholder="First Name"]').should(be.empty).setValue('Yasha')

    s('text=Submit').click()
  })
})