import { form } from "../../../support/model/examples/demoqa/components/form.component"
import { table } from "../../../support/model/examples/demoqa/components/table.component"
import { autoComplete, checked, dateToPick, file, option, radioText, value } from "../../../support/model/examples/demoqa/controls/index"
import { Gender, Hobbies, user } from "../../../support/model/examples/demoqa/data/user.data"
import { registration } from "../../../support/model/examples/demoqa/steps/registration.steps"

describe('Student Registration Form', () => {
  it('can be submitted [StepsObjects style]', () => {
    const userWithAllDetails = {
      firstName: 'Harry',
      lastName: 'Potter',
      userEmail: 'theboywholived@hogwarts.edu',
      gender: Gender.male,
      mobile: '1234567890',
      dateOfBirth: {day: 31, month: 'July', year: 1980},
      subjects: ['Chemistry', 'Maths'],
      hobbies: ['Sports', 'Reading', 'Music'],
      picture: 'images/pexels-vinicius-vieira-ft-3151954.jpg',
      currentAddress: '4 Privet Drive',
      state: 'Uttar Pradesh',
      city: 'Merrut',
    }

    registration.open()

    registration.fill(userWithAllDetails).submit()

    registration.shouldHaveSubmittedData(userWithAllDetails)
  })

  it(
    'can be submitted '
    + '[PageObjects as Components based on Controls + LocatableData style]', 
    () => {
    const userWithAllDetails = user({
      firstName: 'Harry',
      lastName: 'Potter',
      userEmail: 'theboywholived@hogwarts.edu',
      gender: Gender.male,
      mobile: '1234567890',
      dateOfBirth: {day: 31, month: 'July', year: 1980},
      subjects: ['Chemistry', 'Maths'],
      hobbies: [Hobbies.Sports, Hobbies.Reading, Hobbies.Music],
      picture: 'pexels-vinicius-vieira-ft-3151954.jpg',
      currentAddress: '4 Privet Drive',
      state: 'Uttar Pradesh',
      city: 'Merrut',
    })

    browser.visit('https://demoqa.com/automation-practice-form')

    form('#userForm').fill(userWithAllDetails).submit()

    table('.modal-content .table').shouldHaveRowsWithAtLeast(
      [
        'Student Name', 
        userWithAllDetails.firstName + ' ' + userWithAllDetails.lastName
      ],
      ['Student Email', userWithAllDetails.userEmail],
      ['Gender', userWithAllDetails.gender],
      ['Mobile', userWithAllDetails.mobile],
      ['Date of Birth', userWithAllDetails.dateOfBirth],
      ['Subjects', userWithAllDetails.subjects],
      ['Hobbies', userWithAllDetails.hobbies],
      ['Picture', userWithAllDetails.picture],
      ['Address', userWithAllDetails.currentAddress],
      [
        'State and City', 
        userWithAllDetails.state + ' ' + userWithAllDetails.city,
      ],
    )
  })

  it(
    'can be submitted '
    + '[PageObjects as Components based on Controls '
    + '+ straightforward LocatableData style]', 
    () => {
    const Gender = {
      male: 'Male', 
      female: 'Female',
      other: 'Other',
    }
    const Hobbies = {
      Sports: 'Sports',
      Reading: 'Reading',
      Music: 'Music',
    }

    const userWithAllDetails = {
      firstName: 'Harry',
      lastName: 'Potter',
      userEmail: 'theboywholived@hogwarts.edu',
      /*
      genterWrapper: radioText(Gender.male),
       * or more readable version:
       */ 
      gender: {by: '#genterWrapper', ...radioText(Gender.male)},
      mobile: {by: '#userNumber', ...value('1234567890')},
      dateOfBirth: {
        ...dateToPick({day: 31, month: 'July', year: 1980}),
        toString() { 
          return this.value.day + ' ' + this.value.month + ',' + this.value.year
        },
      },
      /*
      subjectsContainer: autoComplete('Chemistry'),
       * or:
       */
      subjects: {
        by: '#subjectsContainer', ...autoComplete('Chemistry', 'Maths')
      },
      /*
       * any among following is possible
      // sports: {by: '#hobbies-checkbox-1', ...checked(true)},
      // reading: {by: '[for=hobbies-checkbox-2]', click: true},
      // music: {by: '[for=hobbies-checkbox-3]', click: true},
       * but easier is:
       */
      hobbies: {
        by: '#hobbiesWrapper', 
        ...checked(Hobbies.Sports, Hobbies.Reading, Hobbies.Music),
      },
      picture: {
        by: '#uploadPicture',
        ...file('images/pexels-vinicius-vieira-ft-3151954.jpg'),
        toString() {
          return this.value.match(/\/(.+\.\w+)$/)[1]
        }
      },
      currentAddress: '4 Privet Drive',
      state: option('Uttar Pradesh'),
      city: option('Merrut'),
    }

    browser.visit('https://demoqa.com/automation-practice-form')

    form('#userForm').fill(userWithAllDetails).submit()

    table('.modal-content .table').shouldHaveRowsWithAtLeast(
      [
        'Student Name', 
        userWithAllDetails.firstName + ' ' + userWithAllDetails.lastName
      ],
      ['Student Email', userWithAllDetails.userEmail],
      ['Gender', userWithAllDetails.gender],
      ['Mobile', userWithAllDetails.mobile],
      ['Date of Birth', userWithAllDetails.dateOfBirth],
      ['Subjects', userWithAllDetails.subjects],
      ['Hobbies', userWithAllDetails.hobbies],
      ['Picture', userWithAllDetails.picture],
      ['Address', userWithAllDetails.currentAddress],
      [
        'State and City', 
        userWithAllDetails.state + ' ' + userWithAllDetails.city,
      ],
    )
  })

  it('can be submitted [straightforward style]', () => {

    browser.visit('https://demoqa.com/automation-practice-form')

    s('#firstName').type('Harry')
    s('#lastName').type('Potter')
    s('#userEmail').type('theboywholived@hogwarts.edu')

    s("#genterWrapper").find('label:contains(Male)').click()

    s('#userNumber').type('1234567890')

    // s('#dateOfBirthInput').setValue('31 Jul 1980')
    s('#dateOfBirthInput').click()
    s(".react-datepicker__month-select").get().select('July')
    s(".react-datepicker__year-select").get().select('1980')
    s(".react-datepicker__day--0" + 31).click()

    s("#subjectsInput").type('Chemistry')
    s(".subjects-auto-complete__option").by('text=Chemistry').click()
    s("#subjectsInput").type('Maths');
    s(".subjects-auto-complete__option").by('text=Maths').click()

    // s('#hobbiesWrapper').by('text=Sports').click()
    s('[for=hobbies-checkbox-1]').click()
    // s('#hobbiesWrapper').by('text=Reading').click()
    s('[for=hobbies-checkbox-2]').click()
    // s('#hobbiesWrapper').by('text=Music').click()
    s('[for=hobbies-checkbox-3]').click()
    
    s('#uploadPicture').get().attachFile(
      'images/pexels-vinicius-vieira-ft-3151954.jpg'
    )

    s('#currentAddress').type('4 Privet Drive')

    s('#state').get().scrollIntoView().click()
    // s('#stateCity-wrapper').by('text=Uttar Pradesh').click()
    s('[id^=react-select-][id*=-option]').by('text=Uttar Pradesh').click()
    s('#city').click()
    // s('#stateCity-wrapper').by('text=Merrut').click()
    s('[id^=react-select-][id*=-option]').by('text=Merrut').click()

    s('#submit').click()

    s('#example-modal-sizes-title-lg').should(
      have.text, 'Thanks for submitting the form'
    )

    const cellsOfRow = (index) => (
      s('.modal-content .table').find('tbody tr').eq(index).find('td')
    )
    cellsOfRow(0).should(have.texts, 'Student Name', 'Harry Potter')
    cellsOfRow(1)
      .should(have.texts, 'Student Email', 'theboywholived@hogwarts.edu')
    cellsOfRow(2).should(have.texts, 'Gender', 'Male')
    cellsOfRow(3).should(have.texts, 'Mobile', '1234567890')
    cellsOfRow(4).should(have.texts, 'Date of Birth', '31 July,1980')
    cellsOfRow(5).should(have.texts, 'Subjects', 'Chemistry, Maths')
    cellsOfRow(6).should(have.texts, 'Hobbies', 'Sports, Reading, Music')
    cellsOfRow(7)
      .should(have.texts, 'Picture', 'pexels-vinicius-vieira-ft-3151954.jpg')
    cellsOfRow(8).should(have.texts, 'Address', '4 Privet Drive')
    cellsOfRow(9).should(have.texts, 'State and City', 'Uttar Pradesh Merrut')
  })
})