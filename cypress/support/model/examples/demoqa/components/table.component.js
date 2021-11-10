import { steps } from "../../../../logging"
import { Component } from "./component"

export const table = (selector) => steps({
  ...Component,

  selector,

  toString() {
    return `Table by ${selector}`
  },

  rows() {
    return this.element().find('tbody tr')
  },

  /**
   * 
   * @param  {...*[]} rows 
   */
  shouldHave(...rows) {
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
