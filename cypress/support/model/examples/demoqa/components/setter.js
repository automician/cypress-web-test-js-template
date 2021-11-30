import { Locator } from '../../../../locator'

// TODO: when called property.set(selector) it's not quite readable... :(
//       also: .set(selector) or .setValue(selector)?
//       set is kind of confusing becuase of js setters
// TODO: what about not pathing selector as param but reusing this.by ?
// TODO: do we need selector: string | Locator below?
//       maybe just string?
/**
 * @template T
 * @typedef {{
 *   value: T,
 *   by?: string,
 *   set?: (selector: string | Locator) => any,
 *   clearDefault?: boolean,
 * }} setter.Of<T>
 */

/**
 * @template T
 * @typedef {T | setter.Of<T>} setter.OrValue<T>
 */

export const setter = {
  /**
   * @template T
   * @param {setter.Of<T>} obj
   * @returns setter.Of<T>
   */
  from: (obj) => obj,

  /**
   * @template T
   * @param {setter.OrValue<T>} obj
   * @returns T
   */
  valueFrom: (obj) => (
    /** @type {setter.Of<T>} */ (obj)
  )?.value ?? /** @type {T} */(obj),

  /**
   * @template T
   * @param {setter.OrValue<T>} obj
   * @returns T
   */
  get(obj) { return this.valueFrom(obj) },
}
