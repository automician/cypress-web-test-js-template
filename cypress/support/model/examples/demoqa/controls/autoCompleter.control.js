import { Component } from "../components/component"

export const autoCompleter = (selector) => ({
  ...Component,
  selector,
  add(...list) {

    // s("#subjectsInput").type('Chemistry')
    // s(".subjects-auto-complete__option").by('text=Chemistry').click()
    // s("#subjectsInput").type('Maths');
    // s(".subjects-auto-complete__option").by('text=Maths').click()
    const input = this.element().find('[aria-autocomplete=list]')
    input.click()
    list.forEach((item) => {
      input.type(item)
      this.element().find('[class*=auto-complete__option]')
        .by(`text=${item}`).click()
    })
  },
})

export const autoComplete = (...list) => ({
  set:  (
    (selector) => autoCompleter(selector).add(...list)
  ),
  value: list,
  toString() {
    return list.join(', ')
  }
})