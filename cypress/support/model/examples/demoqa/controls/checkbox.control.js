import { Component } from "../components/component"

export const checkbox = (selector) => ({
  ...Component,
  selector,
  label() {
    return this.element().next('label')
  },
  /**
   * Sets checkbox to the new status passed by parameter.
   * Before toggling, asserts that current status is opposite to the asked one. 
   * If asked status is `null` just does nothing.
   * @param {boolean} status 
   */
  set(status) {
    if (status === null) {
      return
    }
    if (status) {
      this.element().should(be.not.checked)
      this.label().click()
    } else {
      this.element().should(be.checked)
      this.label().click()
    }
  },
})


export const checkboxes = (selector) => ({
  ...Component,
  selector,
  label() {
    return this.element().next('label')
  },
  /**
   * 
   * @param  {...string} labels 
   */
  set(...labels) {
    labels.forEach((item) => {
      checkbox(
        this.element().find('.custom-checkbox').by(`text=${item}`).find(`input`)
      ).set(true)
    })
  },
})

/**
 * Defines value to be set on corresponding checkboxes 
 * @param {...*} status_or_labels 
 */
export const checked = function(...status_or_labels) {
  if (
    arguments.length === 1 
    && (typeof arguments[0] === 'boolean')
  ) {
    /** @type {boolean} */
    const status = status_or_labels[0]
    return {
      set: (selector) => checkbox(selector).set(status),
      value: status,
      toString: () => status,
    }
  } else {
    /** @type {string[]} */
    const labels = status_or_labels
    return {
      set: (selector) => checkboxes(selector).set(...labels),
      value: labels,
      toString: () => labels.join(', '),
    }
  }
}