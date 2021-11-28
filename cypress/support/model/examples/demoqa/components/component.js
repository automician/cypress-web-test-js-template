import { Locator } from "../../../../locator"


export const Component = {
  /** @returns {Locator} */
  element() {
    // TODO: remove when supporting s(undefined)
    if (this.selector === undefined) {
      // @ts-ignore
      return {
        find(selector) { return s(selector) },
      }
    }
    return this.selector instanceof Locator ?
      this.selector
      :
      s(this.selector)
  },
  _elementDescription() {
    // TODO: change to commented...
    // return (this.selector ?? 'browser').toString()
    //       once available in locator.toString()
    return this.selector ?
    // @ts-ignore
      this.element().chain.path
      :
      'browser'
  },
  toString() {
    return this._elementDescription()
  },
}
