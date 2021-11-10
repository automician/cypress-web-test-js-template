import * as the from "../controls/index"


/**
 * @enum {string}
 */
export const Gender = {
  male: 'Male', 
  female: 'Female',
  other: 'Other',
}


/**
 * @enum {string}
 */
export const Hobbies = {
  Sports: 'Sports',
  Reading: 'Reading',
  Music: 'Music',
}

/**
 * @param {{
 *   firstName: string, 
 *   lastName: string,
 *   userEmail: string,
 *   gender: Gender,
 *   mobile: string,
 *   dateOfBirth: {day: number, month: string, year: number},
 *   subjects: string[],
 *   hobbies: Hobbies[],
 *   picture: string,
 *   currentAddress: string,
 *   state: string,
 *   city: string,
 * }} data
 */
export const user = ({
  firstName,
  lastName,
  userEmail,
  gender,
  mobile,
  dateOfBirth,
  subjects,
  hobbies,
  picture,
  currentAddress,
  state,
  city,
}) => ({
  firstName,
  lastName,
  userEmail,
  /*
  genterWrapper: radioText(gender),
   * or more readable version:
   */ 
  gender: {by: '#genterWrapper', ...the.radioText(gender)},
  // gender: {by: '#genterWrapper', value: gender, type: the.radio},
  mobile: {by: '#userNumber', value: mobile, toString: () => mobile},
  dateOfBirth: {
    ...the.dateToPick(dateOfBirth), 
    toString: () => (
      `${dateOfBirth.day} ${dateOfBirth.month},${dateOfBirth.year}`
    ),
  },
  /*
  subjectsContainer: the.autoComplete(...subjects),
   * or:
   */
  subjects: { 
    by: '#subjectsContainer', 
    ...the.autoComplete(...subjects),
  },
  hobbies: { 
    by: '#hobbiesWrapper', 
    ...the.checked(...hobbies),
  },
  picture: { 
    by: '#uploadPicture', 
    ...the.file('images/' + picture),
    toString: () => picture, 
  },
  currentAddress,
  state: the.option(state),
  city: the.option(city),
})
