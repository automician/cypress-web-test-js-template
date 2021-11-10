import { Component } from "../components/component"

export const radio = (selector) => ({
  ...Component,
  selector,
  selectByText(label) {
    this.element().find('.custom-control-label').by(`text=${label}`).click()
  },
  // setting radio by value is not supported in demoqa app, so code below is just for example purposes
  /*
  selectByValue(attribute) {
    this.element().find('.custom-control-input').by(`[value=${attribute}]`).click()
  },
  */
})

export const radioText = (label) => ({
  set: (selector) => radio(selector).selectByText(label),
  value: label,
  toString: () => label,
})