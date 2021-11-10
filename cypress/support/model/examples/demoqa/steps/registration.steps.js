import { steps } from "../../../../logging"

/**
 * @typedef {{
 *   firstName: string, 
 *   lastName: string,
 *   userEmail: string,
 *   gender: string,
 *   mobile: string,
 *   dateOfBirth: {day: number, month: string, year: number},
 *   subjects: string[],
 *   hobbies: string[],
 *   picture: string,
 *   currentAddress: string,
 *   state: string,
 *   city: string,
 * }} User
 */

 const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const registration = steps({
  toString() {
    return 'Registration Form'
  },

  open() {
    browser.visit('https://demoqa.com/automation-practice-form')
    return this
  },

  /** @param {Partial<User>} user */
  fill(user) {
    if (user.firstName) s('#firstName').type(user.firstName)
    if (user.lastName) s('#lastName').type(user.lastName)
    if (user.userEmail) s('#userEmail').type(user.userEmail)

    if (user.gender) s('#genterWrapper')
      .find('.custom-control-label').by(`text=${user.gender}`).click()

    if (user.mobile) s('#userNumber').type(user.mobile)

    if (user.dateOfBirth) {
      s('#dateOfBirthInput').click()
      s('.react-datepicker__month-select').get().select(user.dateOfBirth.month)
      s('.react-datepicker__year-select').get().select(
        user.dateOfBirth.year.toString()
      )
      s('.react-datepicker__day--0' + user.dateOfBirth.day).click()
    }
   
    user.subjects?.forEach((subject) => {
      s('#subjectsInput').type(subject)
      s('.subjects-auto-complete__option').by(`text=${subject}`).click()
    })
    
    user.hobbies?.forEach((hobby) => {
      s('[for^=hobbies-checkbox]').by(`text=${hobby}`).click()
    })
    
    if (user.picture) s('#uploadPicture').get().attachFile(user.picture)
    
    if (user.currentAddress) s('#currentAddress').type(user.currentAddress)

    if (user.state) {
      s('#state').get().scrollIntoView().click()
      s('[id^=react-select-][id*=-option]').by(`text=${user.state}`).click()
    }
    if (user.city) {
      s('#city').click()
      s('[id^=react-select-][id*=-option]').by(`text=${user.city}`).click()
    }

    return this
  },

  submit() {
    s('#submit').click()
    return this
  },

  /** @param {Partial<User>} user */
  shouldHaveSubmittedData(user) {
    const now = new Date()
    const formatBirth = (day, month, year) => `${day} ${month},${year}`
    const birth = user.dateOfBirth
    const formattedBirth = birth ?
      formatBirth(birth.day, birth.month, birth.year)
      :
      formatBirth(now.getDay(), months[now.getMonth()], now.getFullYear())

    const expectedTexts = [
      ['Student Name', user.firstName + ' ' + user.lastName],  // is mandatory
      ['Student Email', user.userEmail ?? ''],
      ['Gender', user.gender],  // is mandatory
      ['Mobile', user.mobile],  // is mandatory
      ['Date of Birth', formattedBirth],
      ['Subjects', user.subjects.join(', ') ?? ''],
      ['Hobbies', user.hobbies.join(', ') ?? ''],
      ['Picture', user.picture?.match(/\/(.+\.\w+)$/)[1] ?? ''],
      ['Address', user.currentAddress ?? ''],
      ['State and City', (user.state ?? '') + ' ' + (user.city ?? '')],
    ]
    const rows = s('.modal-content .table').find('tbody tr')

    rows.should(have.length, expectedTexts.length)
    expectedTexts.forEach((expected, index) => {
      rows.eq(index).find('td').should(have.exactTexts, ...expected)
    })
    
    return this
  },
})