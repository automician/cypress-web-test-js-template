import { settings } from '../project.settings';
import {
  With, Then, ThenWith, Etc,
} from '../subject';
import { response } from './response';

/**
 * // TODO: should not we built-in { wrap?: Etc } here too?
 * @typedef {{body_data?, body_data_attributes?}} RequestBodyExtras
 */

export const request = {
  // TODO: make it reuse this.baseUrl in request url

  /**
   * Sends request
   *
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} options
   * @returns {Then<{ response } & E>}
   */
  // TODO: consider fixing this param type... and add to jsdoc
  //  * @param {((subject: Etc) => ThenWith<{response}>)[]} callbacks
  send(options, ...callbacks) { // TODO: should callbacks return Then<{response} & E> ?
    const {
      wrap,
      body_data,
      body_data_attributes,
      ...rest
    } = options;
    const cyOptions = { // TODO: refactor our this conversion logic to be parameter of request api
      body: body_data ?
        { data: body_data }
        :
        body_data_attributes ?
          { data: { attributes: body_data_attributes } }
          :
          undefined,
      ...rest,
    };
    /*
     * TODO: enhance to something like:
    return cy
      .then(stopwatch.start)
      .then(request(cyOptions))
      .then(stopwatch.lap)
      .then(response.wrapWith(wrap));
     */

    // return cy.request(cyOptions).then(response.wrapWith(wrap));
    return [response.wrapWith(wrap), ...callbacks].reduce(
      (acc, callback) => acc.then(callback),
      cy.request(cyOptions),
    );
  },

  /**
   * Creates a request callback
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} _
   * @returns {(subject: Etc) => Then<{ response } & E>}
   */
  of({ wrap, ...options }) {
    return (subject) => this.send({ ...subject, ...options, wrap });
  },

  /**
   * Sends request with token for auth
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap: W, token} & RequestBodyExtras} options
   * @returns {ThenWith<{ response, token } & W>}
   */
  sendWithAuth({ token, wrap, ...options }, ...callbacks) { // TODO: decompose *WithToken to separate object of higher abstraction
    return this.send({
      headers: { // TODO: merge with headers from ...data
        Authorization: `Bearer ${token}`,
      },
      ...options,
      wrap: { ...wrap, token },
    }, ...callbacks);
  },

  /**
   * Creates a callable request to be sent when called with token
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap: W} & RequestBodyExtras} _
   * @returns {({token, ...etc}: Etc) => Cypress.Chainable<{ response, token } & W & Etc>}
   */
  withAuth({ wrap, ...options }, ...callbacks) { // TODO: decompose *WithToken to separate object of higher abstraction
    return ({ token, ...etc }) => this.sendWithAuth({
      token, wrap: { ...etc, ...wrap }, ...options,
    }, ...callbacks);
  },

  /**
   * Sends GET request
   *
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} options
   * @returns {Then<{ response } & E>}
   */
  get(options, ...callbacks) {
    const { wrap, ...rest } = options;
    return this.send(
      {
        wrap,
        method: 'GET',
        ...rest,
      },
      ...callbacks,
    );
  },

  /**
   * Creates a GET request callback
   *
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} _
   * @returns {(subject: object) => Then<{ response } & E>}
   */
  GET({ wrap, ...options }, ...callbacks) {
    return (subject) => this.get(
      { ...options, wrap: { ...subject, ...wrap } },
      ...callbacks,
    );
  },

  /**
   * Sends GET request with authorization header containing service token from settings
   *
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} _
   * @returns {Then<{ response } & E>}
   */
  getWithServiceToken({ wrap, ...options }, ...callbacks) {
    return this.send({
      wrap,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${settings.serviceToken}`,
      },
      ...options,
    }, ...callbacks);
  },

  /**
   * Creates GET request callback with authorization header containing service token from settings
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} _
   * @returns {(subject: Etc) => Then<{ response } & E>}
   */
  GET_withServiceToken({ wrap, ...options }, ...callbacks) {
    return (subject) => this.getWithServiceToken(
      { ...options, wrap: { ...subject, ...wrap } },
      ...callbacks,
    );
  },

  /**
   * Sends POST request
   *
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} _
   * @returns {Then<{ response } & E>}
   */
  post({ wrap, ...options }, ...callbacks) {
    return this.send(
      {
        wrap,
        method: 'POST',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Creates POST request callback
   *
   * @template {Etc} E
   * @param {Partial<Cypress.RequestOptions> & { wrap?: E } & RequestBodyExtras} _
   * @returns {(subject: object) => Then<{ response } & E>}
   */
  POST({ wrap, ...options }, ...callbacks) {
    return (subject) => this.post(
      { ...options, wrap: { ...subject, ...wrap } },
      ...callbacks,
    );
  },

  /**
   * Sends authenticatable POST request
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W, token } & RequestBodyExtras} _
   * @returns {ThenWith<{ response, token } & W>}
   */
  postWithAuth({ token, wrap, ...options }, ...callbacks) {
    return this.sendWithAuth(
      {
        token,
        wrap,
        method: 'POST',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Creates authenticatable POST request callback
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W } & RequestBodyExtras} _
   * @returns {({token, ...etc}: Etc) => ThenWith<{ response, token } & W>}
   */
  POST_withAuth({ wrap, ...options }, ...callbacks) {
    return this.withAuth(
      {
        wrap,
        method: 'POST',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Sends authenticatable PUT request
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W, token } & RequestBodyExtras} _
   * @returns {ThenWith<{ response, token } & W>}
   */
  putWithAuth({ token, wrap, ...options }, ...callbacks) {
    return this.sendWithAuth(
      {
        token,
        wrap,
        method: 'PUT',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Creates authenticatable PUT request callback
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W } & RequestBodyExtras} _
   * @returns {({token, ...etc}: Etc) => ThenWith<{ response, token } & W>}
   */
  PUT_withAuth({ wrap, ...options }, ...callbacks) {
    return this.withAuth(
      {
        wrap,
        method: 'PUT',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Sends authenticatable GET request
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W, token } & RequestBodyExtras} _
   * @returns {ThenWith<{ response, token } & W>}
   */
  getWithAuth({ token, wrap, ...options }, ...callbacks) {
    return this.sendWithAuth(
      {
        token,
        wrap,
        method: 'GET',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Creates authenticatable GET request callback
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W } & RequestBodyExtras} _
   * @returns {({token, ...etc}: Etc) => ThenWith<{ response, token } & W>}
   */
  GET_withAuth({ wrap, ...options }, ...callbacks) {
    return this.withAuth(
      {
        wrap,
        method: 'GET',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Sends authenticatable DELETE request
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W, token } & RequestBodyExtras} _
   * @returns {ThenWith<{ response, token } & W>}
   */
  deleteWithAuth({ token, wrap, ...options }, ...callbacks) {
    return this.sendWithAuth(
      {
        token,
        wrap,
        method: 'DELETE',
        ...options,
      },
      ...callbacks,
    );
  },

  /**
   * Creates authenticatable DELETE request callback
   *
   * @template {Etc} W
   * @param {Partial<Cypress.RequestOptions> & { wrap?: W } & RequestBodyExtras} _
   * @returns {({token, ...etc}: Etc) => ThenWith<{ response, token } & W>}
   */
  DELETE_withAuth({ wrap, ...options }, ...callbacks) {
    return this.withAuth(
      {
        wrap,
        method: 'DELETE',
        ...options,
      },
      ...callbacks,
    );
  },
};
