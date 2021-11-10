import { Component } from "../components/component"

export const dropdown = (selector) => ({
  ...Component,
  selector,
  selectByText(option) {
    this.element().click()

    this.element().find('[id^=react-select-][id*=-option]')
      .by(`text=${option}`).click()
  },
})

export const option = (text) => ({
  set: (selector) => dropdown(selector).selectByText(text),
  value: text,
  toString: () => text,
})
