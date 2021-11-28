import { Locator } from '../../../../locator';

export const element = (data, key, { within } = { within: undefined }) => ({
  _within: within,
  _something: data[key],
  _value() {
    return this._something?.value ?? this._something;
  },
  _by() {
    return this._something?.by ?? `[name=${key}],[data-qa^=${key}],#${key}`;
  },

  /**
   * @param {{within: Locator | string }} context
   */
  within(selector) {
    return element(data, key, { within: selector });
  },

  /**
   * @param {{within: Locator | string }} context
   * @returns {Locator}
   */
  get({ within: inside } = { within: undefined }) {
    // TODO: change to:
    // return (within instanceof Locator ? within : s(within)).find(this._by());
    //       once availble in cypress-selene
    return inside ?? this._within ?
      (inside instanceof Locator ? inside : s(inside)).find(this._by())
      :
      s(this._by());
  },

  /**
   * @param {{within: Locator | string }} context
   */
  shouldHaveExactText({ within: inside } = { within: undefined }) {
    this.get({ within: inside }).should(have.exactText, this._value());
    return this;
  },
});

export const elements = (data) => ({
  /**
   * @param {{within: Locator | string }} context
   */
  shouldBeAsExactTexts({ within: inside } = { within: undefined }) {
    Object.keys(data).forEach((key) => {
      element(data, key).shouldHaveExactText({ within: inside });
    });
    return this;
  },
});

export const dataElement = {
  by(data, key) {
    return element(data, key);
  },
  s: {
    by(data) {
      return elements(data);
    },
  },
};
