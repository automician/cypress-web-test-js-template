import { steps } from "../../../../logging"
import { Component } from "./component"

export const form = (selector) => steps({
  ...Component,

  selector,

  toString() {
    return `Form by ${selector}`
  },

  fill(data) {
    Object.keys(data).forEach((key) => {
      const prop = data[key]

      const default_set = (value) => (selector) => (typeof value === 'string') ?
        this.element().find(selector).type(value)
        :
        (typeof value === 'boolean') && value ?
          this.element().find(selector).click()
          : 
          typeof value === 'object' && value.set? 
            value.set(selector)
            :
            console.log(
              `nothing to set for key: ${key}, prop: ${value}`
            )

      const defaults = {
        by: '#' + key,
        value: prop, 
        set: default_set(prop),
        click: undefined, // `click: true` is an alias to `value: true` 
                          // that is processed above in defaults for `set: ...`
      }

      const {by, value, set, click, ..._} = typeof prop === 'object' ?
        prop
        :
        defaults

      // todo: ...
      // if (click) {
      //   set(by)
      // }

      const final_set = set ?
        set
        :
        default_set(value)

      const final_by = by ?
        by
        :
        defaults.by

      final_set(final_by)
    })
    return this
  },

  submit() {
    s(selector).find('#submit').click()
    return this
  },

  shouldHave(data) {
    return this
  },
})
