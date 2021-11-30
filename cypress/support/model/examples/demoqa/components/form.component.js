import { Locator } from '../../../../locator'
import { steps } from "../../../../logging"
import { Component } from "./component"

export const form = (selector) => steps({
  ...Component,

  selector,

  toString() {
    // @ts-ignore
    return `Form by ${this._elementDescription()}`
  },

  fill(data) {
    Object.keys(data).forEach((key) => {
      const prop = data[key]

      const defaultSetValue = (
        { value, clearDefault },
      // eslint-disable-next-line no-shadow
      ) => (selector) => {
        const input = selector instanceof Locator ?
          selector // TODO:  be something like selector.within(this.element())
          :
          this.element().find(selector)

        return typeof value === 'string' ?
          clearDefault ?
            input.clear().type(value)
            :
            input.type(value)
          :
          (typeof value === 'boolean') && value ?
            input.click()
            :
            cy.log(
              `nothing to set for key: ${key}, prop: ${value}`,
            )
      }

      const setter = {
        value: prop?.value ?? prop,
        by: prop?.by ?? `[name=${key}],[data-type^=${key}],#${key}`,
        clearDefault: prop?.clearDefault ?? false,
        // eslint-disable-next-line no-shadow
        set(selector) {
          return (prop?.set ?? defaultSetValue(
            { value: this.value, clearDefault: this.clearDefault },
          ))(selector)
        },
        // click: undefined, // `click: true` is an alias to `value: true`
        // that is processed above in defaults for `set...`
      }

      setter.set(setter.by)
    })
    return this
  },

  submit() {
    this.element().find('[type=submit]').click()
    return this
  },

  // eslint-disable-next-line no-unused-vars
  shouldHave(data) {
    // TODO: implement
    return this
  },
})
