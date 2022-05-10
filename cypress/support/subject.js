/**
 * @template T
 * @typedef {Cypress.Chainable<T>} Then
 */

/**
 * @template T
 * @typedef {Cypress.Chainable<T & Etc>} ThenWith
 */

/**
 * @template T
 * @typedef {T & Etc} With
 */

/**
 * @typedef {{[key: string]: any}} Etc
 */

export const subject = {
  /**
     * @template S
     * @param {S} subj
     * @returns {Then<S>}
     */
  log(subj) {
    cy.log(JSON.stringify(subj));
    return cy.wrap(subj, { log: false });
  },

  /**
     * @param {string} message
     * @param {any[]} args
     * @returns {<S>(subj: S) => Then<S>}
     */
  logWith(message, ...args) {
    return (subj) => {
      // cy.log(message, ...args);
      // cy.log(message, subj);
      cy.log(`${message}\n${JSON.stringify(subj)}\n`, ...args);
      return cy.wrap(subj, { log: false });
    };
  },

  /**
     * @param {string} message
     * @param {any[]} args
     * @returns {<S>(subj: S) => Then<S>}
     */
  logAs(message = undefined, ...args) {
    return (subj) => {
      if (message !== undefined) {
        cy.log(message, ...args);
      }
      return cy.wrap(subj, { log: false });
    };
  },

  init() {
    cy.wrap({}, { log: false }).as('subject');
  },

  restore() {
    return cy.get('@subject', { log: false });
  },

  save(subj) {
    return cy.wrap(subj, { log: false }).as('subject');
  },
};

export function then(fn) {
  return subject.restore().then(fn); // TODO: shouldn't we add .then(sbuect.save) here? or add another helper for that?
}

/** 
 * @template T
 * @param {T} self
 * @returns {(callback) => T}
 */
export function Fluent(self) {
  return (callback) => {
    then(callback).then(subject.save);
    return self;
  };
}

/** 
 * @template T
 * @param {T} self
 * @returns {(name?: string) => (callback?) => T}
 */
export function Step(self) {
  return (name = undefined) => (
    callback = (subj) => cy.wrap(subj, { log: false })
  ) => {
    subject.restore()
      .then(subject.logAs(name))
      .then(callback)
      .then(subject.save);
    return self;
  };
}
