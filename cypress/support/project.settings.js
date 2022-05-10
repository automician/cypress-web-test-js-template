export const settings = {
  get adminToken() { return Cypress.env().adminToken; },
  get apiUrl() { return Cypress.env().apiUrl; },
};
