import {
  With, Then, ThenWith, Etc,
} from '../subject';

const should = /* steps( */{
  /**
   * @param {Number} number
   * @returns {({response, ...etc}: Etc) => ThenWith<{response: object}>}
   */
  haveStatus(number) {
    return ({ response, ...etc }) => {
      expect(response.status).to.eq(number);
      return cy.wrap({ response, ...etc });
    };
  },

  get haveStatusOK() { return this.haveStatus(200); },
  get haveStatusNoContent() { return this.haveStatus(204); },
};/* ) */

export const response = {
  should,

  /**
   * @template {Etc} E
   * @param {E} etc
   * @returns {(response: object) => {response: object} & E}
   */
  wrapWith(etc) {
    /**
     * response goes after ...anything
     * to rewrite maybe available anything.response
     */
    return (response) => ({ ...etc, response });
  },

  /**
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object }>}
   */
  logBody({ response, ...etc }) {
    cy.log('response.body: ', JSON.stringify(response.body));
    return cy.wrap({
      ...etc,
      response,
    }, { log: false });
  },

  /**
   * Gets response.body.token
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object, token: string }>}
   */
  getToken({ response, ...etc }) {
    const { token } = response.body;
    return cy.wrap({
      ...etc,
      response,
      token,
    });
  },

  /**
   * Gets response.body.data[0].attributes.token
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object, token: string }>}
   */
  getData0AttributesToken({ response, ...etc }) {
    const { token } = response.body.data[0].attributes;
    return cy.wrap({
      ...etc,
      response,
      token,
    });
  },

  /**
   * Gets response.body.id
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object, id: string }>}
   */
  getId({ response, ...etc }) {
    const { id } = response.body;
    return cy.wrap({
      ...etc,
      response,
      id,
    });
  },

  /**
   * Gets response.body.data
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object, data }>}
   */
  getData({ response, ...etc }) {
    expect(response.body).property('data').to.not.be.oneOf([null, '']); // TODO: how can we eliminate such long validators?
    const { data } = response.body;
    return cy.wrap({
      ...etc,
      response,
      data,
    });
  },

  /**
   * Gets response.body.data[0].id
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object, id: string }>}
   */
  getData0Id({ response, ...etc }) {
    const { id } = response.body.data[0];

    return cy.wrap({
      ...etc,
      response,
      id,
    });
  },

  /**
   * Gets response.body.data[0].attributes.code
   * @param {With<{ response: object}>} data
   * @returns {ThenWith<{ response: object, code: string }>}
   */
  getData0AttributesCode({ response, ...etc }) {
    expect(response.body).property('data').to.not.be.oneOf([null, '']);
    const { code } = response.body.data[0].attributes;
    return cy.wrap({
      ...etc,
      response,
      code,
    });
  },
};
