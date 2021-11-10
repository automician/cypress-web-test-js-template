import { Locator } from "../../../../locator"


export const Component = {
  /** @returns {Locator} */
  element() {
    return typeof this.selector === 'string' ? 
      s(this.selector) 
      : this.selector
  },
  toString() {
    return (this.selector).toString()
  }
}