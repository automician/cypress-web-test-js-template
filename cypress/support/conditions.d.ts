/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainer<Subject> {
    /**
    * Asserts existance of matched elements by selector. 
    * Similar to .should(($elements) => { expect($elements.filter(selector).length).to.be.gt(0) })
    * @param selector
    * */
    (chainer: 'have.filtered', selector: string): Chainable<Subject>

    /**
    * Asserts absence of elements matched by selector. 
    * Similar to .should(($elements) => { expect($elements.filter(selector).length).to.be.eq(0) })
    * @param selector
    * */
    (chainer: 'not.have.filtered', selector: string): Chainable<Subject>

    /**
    * Asserts existance of elements found by selector. 
    * Similar to .should(($elements) => { expect($elements.has(selector).length).to.be.gt(0) })
    * @param selector
    * */
    (chainer: 'have.elements', selector: string): Chainable<Subject>

    /**
     * Alias to have.elements ;)
     */
    (chainer: 'have.the', selector: string): Chainable<Subject>

    /**
    * Asserts absence of elements found by selector. 
    * Similar to .should(($elements) => { expect($elements.has(selector).length).to.be.eq(0) })
    * @param selector
    * */
    (chainer: 'not.have.elements', selector: string): Chainable<Subject>

    /**
    * Asserts exact texts of elements collection (every element by exact equals)
    *
    * @example
    * // given:
    * //   <div class="vowel">«a»</div>
    * //   <div class="vowel">«e»</div>
    * //   <div class="vowel">«i»</div>
    * //   <div class="vowel">«o»</div>
    * //   <div class="vowel">«u»</div>
    * // will pass:
    * cy.get('.vowel').should('have.exactTexts', '«a»', '«e»', '«i»', '«o»', '«u»')
    * cy.get('.vowel').should('have.exactTexts', ['«a»', '«e»', '«i»', '«o»', '«u»'])
    * // will fail:
    * cy.get('.vowel').should('have.exactTexts', '«a»', '«e»', '«i»', '«o»')
    * cy.get('.vowel').should('have.exactTexts', '«a»', '«e»', '«i»', '«o»', '«u»', '«ü»')
    * cy.get('.vowel').should('have.exactTexts', 'a', 'e', 'i', 'o', 'u')
    * */
    (chainer: 'have.exactTexts', ...values: string[] | [string[]]): Chainable<Subject>

    /**
    * Asserts exact texts of elements collection are not like expected (checks every element by exact equals)
    * */
    (chainer: 'not.have.exactTexts', ...values: string[] | [string[]]): Chainable<Subject>

    /**
     * Asserts texts of elements collection (every element by contains)
     *
     * @example
     * // given:
     * //   <div class="vowel">«a»</div>
     * //   <div class="vowel">«e»</div>
     * //   <div class="vowel">«i»</div>
     * //   <div class="vowel">«o»</div>
     * //   <div class="vowel">«u»</div>
     * // will pass:
     * cy.get('.vowel').should('have.texts', 'a', 'e', 'i', 'o', 'u')
     * cy.get('.vowel').should('have.texts', ['a', 'e', 'i', 'o', 'u'])
     * // will fail:
     * cy.get('.vowel').should('have.texts', 'a', 'e', 'i', 'o')
     * cy.get('.vowel').should('have.texts', 'a', 'e', 'i', 'o', 'u', 'ü')
     * */
    (chainer: 'have.texts', ...values: string[] | [string[]]): Chainable<Subject>

    /**
    * Asserts texts of elements collection are not like expected (checks every element by contains)
    * */
    (chainer: 'not.have.texts', ...values: string[] | [string[]]): Chainable<Subject>

  }
}

declare namespace Chai {

  interface Assertion {
      /**
      * Asserts existance elements matched by selector. 
      * Similar to expect($elements.filter(selector).length).to.be.eq(0)
      * @param selector
      * */
      filtered(selector: string): Assertion
      /**
      * Asserts existance elements found by selector. 
      * Similar to expect($elements.find(selector).length).to.be.eq(0)
      * @param selector
      * */
      elements(selector: string): Assertion
      /**
      * Asserts existance elements found by selector. 
      * Is an alias to `elements` chainer
      * Similar to expect($elements.find(selector).length).to.be.eq(0)
      * @param selector
      * */
      the(selector: string): Assertion

      /**
       * Asserts texts of elements collection (every element by contains)
       */
      texts(...values: string[]): Assertion

      /**
       * Asserts texts of elements collection (every element by exact equals)
       */
      exactTexts(...values: string[]): Assertion
  }
}