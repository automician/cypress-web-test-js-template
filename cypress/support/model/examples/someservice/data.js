/* eslint-disable no-shadow */
import * as faker from 'faker';
import { setter } from '../demoqa/components/setter';


export const fake = {
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  phone: faker.phone.phoneNumber,

  year: () => faker.datatype.number({ min: 1900, max: 2022 }).toString(),
  day: () => faker.datatype.number({ min: 1, max: 28 }).toString(), // TODO: make it dependant on month
  date: () => faker.date.past(60),

  street: faker.address.streetAddress,
  city: faker.address.city,
  state: () => faker.address.state(),
  country: faker.address.countryCode,
  zipCode: faker.address.zipCode,

  email: () => (
    'testuser+' + faker.datatype.number(1000) + faker.internet.email()
  ),
  password: () => faker.internet.password(),

  company: () => (
    faker.company.companyName() + ' ' + faker.datatype.number(1000)
  ),
  jobTitle: faker.name.jobTitle,

  about: () => faker.datatype.string(99),
};


export const Admin = {
  phone: '+380637654321',
  code: '567890',
};


/**
 * @enum {string}
 */
export const Country = {
  Ukraine: 'UA',
  USA: 'US',
  Japan: 'JP',
  Brasil: 'BR',
};

/**
 * @enum {string}
 */
 export const Language = {
  Ukrainian: 'UK',
  English: 'EN',
};


/**
 * @enum {string}
 */
 export const Month = {
  January: '0',
  February: '1',
  March: '2',
  April: '3',
  May: '4',
  June: '5',
  July: '6',
  August: '7',
  September: '8',
  October: '9',
  November: '10',
  December: '11',
};

export const MonthFromIndex = (
  (index) => Month[
    Object.keys(Month).find((key) => Month[key] === index.toString())
  ]
);

/**
 * @typedef {{
 *   street: string,
 *   country: Country,
 *   state: string,
 *   city: string,
 *   zipCode: string,
 * }} Address
 */

/**
 * @typedef {{
 *   lastName: string,
 *   firstName: string,
 *   phone: string,
 *   email: string,
 *   language: Language,
 *   password: string,
 *   year?: string,
 *   month?: Month,
 *   day?: string,
 *   about?: string,
 * }} Human
 */

/**
 * @typedef {{
 *   company: string,
 *   jobTitle: string,
 * }} Employed
 */

/**
 * @typedef {{
 *   address: Address,
 * }} Resident
 */

/**
 * @typedef {Human & Employed & Address} User
 */


/**
 * @typedef {Partial<Human> & Partial<Employed> & Partial<Address>} UserInfo
 */

/**
 * @typedef {{ token: string }} Authenticated
 */

/**
 * @typedef { UserInfo & Authenticated } AuthenticatedUserInfo
 */


/**
 * @param {UserInfo} data
 * @returns UserInfo
 */
 export const userInfo = (data) => data;


/** @param {UserInfo} info */
export const userInfoWith = (info = {}) => ({
  /** @return {UserInfo} */
  create() { return info; },

  firstName(value = fake.firstName()) { 
    return userInfoWith({ ...info, firstName: value }); 
  },
  lastName(value = fake.lastName()) { 
    return userInfoWith({ ...info, lastName: value }); 
  },
  phone(value = Admin.phone) { 
    return userInfoWith({ ...info, phone: value }); 
  },
  company(value = fake.company()) { 
    return userInfoWith({ ...info, company: value }); 
  },
  email(value = fake.email()) { 
    return userInfoWith({ ...info, email: value }); 
  },
  password(value = fake.password()) { 
    return userInfoWith({ ...info, password: value }); 
  },
  language(value = Language.English) { 
    return userInfoWith({ ...info, language: value }); 
  },
  year(value = fake.year()) { return userInfoWith({ ...info, year: value }); },
  month(value = Month.January) { 
    return userInfoWith({ ...info, month: value }); 
  },
  day(value = fake.day()) { return userInfoWith({ ...info, day: value }); },
  date(val = fake.date()) {
    return userInfoWith({
      ...info,
      year: val.getFullYear().toString(),
      month: MonthFromIndex(val.getMonth()),
      day: val.getDate().toString(),
    });
  },
  about(value = fake.about()) { 
    return userInfoWith({ ...info, about: value }); 
  },
  jobTitle(value = fake.jobTitle()) {
    return userInfoWith({ ...info, jobTitle: value }); 
  },
  street(value = fake.street()) {
    return userInfoWith({ ...info, street: value });
  },
  city(value = fake.city()) {
    return userInfoWith({ ...info, city: value });
  },
  state(value = fake.state()) {
    return userInfoWith({ ...info, state: value });
  },
  country(value = Country.USA) {
    return userInfoWith({ ...info, country: value });
  },
  zipCode(value = '10001') {
    return userInfoWith({ ...info, zipCode: value });
  },
});

/**
 * @param {UserInfo} info
 * @returns {User}
 */
export const user = (info = {}) => /** @type {User} */ ({
  ...userInfoWith()
    .firstName(info.firstName)
    .lastName(info.lastName)
    .phone(info.phone)
    .company(info.company)
    .email(info.email)
    .password(info.password)
    .language(info.language)
    .jobTitle(info.jobTitle)
    .street(info.street)
    .city(info.city)
    .state(info.state)
    .country(info.country)
    .zipCode(info.zipCode)
    .create(),

  get fullName() { return this.firstName + ' ' + this.lastName; },
});

/**
 * @typedef {{
 *   title: string,
 *   description: string,
 * }} Post
 */

export const post = ({
  title = faker.random.words(3),
  description = faker.random.words(10),
} = {}) => ({
  title,
  description,
});
