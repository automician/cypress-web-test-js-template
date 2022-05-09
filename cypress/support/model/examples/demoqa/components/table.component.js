import { steps } from '../../../../logging'
import { Component } from './component'
import { elements } from './dataElement'


export const table = (selector) => steps({
  ...Component,
  selector,

  toString() {
    // @ts-ignore
    return `Table by ${this._elementDescription()}`
  },

  headers() {
    return this.element().find('thead tr')
  },

  rows() {
    return this.element().find('tbody tr')
  },

  rowBy(text) {
    return this.rows().by(`text=${text}`)
  },

  /**
   * Asserts exact rows data,
   * expecting all expected cells data to be explicitely specified
   * @param  {...object[]} rows
   */
  // shouldHaveRowsExact(...data) {
  //   this.rows().should(have.length, data.length)
  //   data.forEach((expected, index) => {
  //     // TODO: implement
  //   })
  // },

  /**
   * Asserts that provided data is present.
   * The empty object value `{}` can be used as stub for row to be skipped.
   * @param  {...object[]} data
   */
  shouldHaveRowsWithAtLeast(...data) {
    this.rows().should(have.length, data.length)
    data.forEach((expected, index) => {
      elements(expected)
        .shouldBeAsExactTexts({ within: this.rows().eq(index) })
    })
  },

  /**
   * @param  {...*[]} rows
   */
  shouldHaveRowsExactTexts(...rows) {
    this.rows().should(have.length, rows.length)
    rows.forEach((expected, index) => {
      this.rows().eq(index).find('td').should(have.exactTexts, ...expected)
    })
    /*
     * alternative implementation that will give a different logging
     * and potentially is more stable
     * (it waits for the whole rows to be as expected at the same moment
     *  not "one after one", that may lead to the situation
     *  when first rows are already not as expected after we asserted last ones)
    const selector = this.rows()['chain']['path']       // TODO: make it less hackerish:)
    this.rows().get().should(($rows) => {
      $rows.each(function(index) {
        const cells = Cypress.$(this).find('td')
        cells['selector'] = selector + ` -eq ${index} -find td`  // TODO: make it less hackerish:)
        expect(cells).to.have.texts(...rows[index])
      })
    })
    return this
     */
  },
})
