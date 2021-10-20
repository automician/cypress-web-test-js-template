/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainer<Subject> {
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

// --- Aliases --- // 

declare const be: {
  equalTo: string,
  visible: string,
  hidden: string,
  selected: string,
  inDOM: string,
  empty: string,
  enabled: string,
  matching: string,
  containing: string,
  not: {
    equalTo: string,
    selected: string,
    inDOM: string,
    empty: string,
    enabled: string,
    matching: string,
    containing: string,
  }
}

declare const have: {
  exactTexts: string,
  text: string,
  attr: string,
  value: string,
  valueContaining: string,
  cssClass: string,
  length: string,
  lengthGreaterThan: string,
  lengthLessThan: string,
  lengthAtLeast: string,
  lengthAtMost: string,
  lengthWithin: string,
  no: {
    exactText: string,
    text: string,
    attr: string,
    value: string,
    valueContaining: string,
    cssClass: string,
    length: string,
    lengthGreaterThan: string,
    lengthLessThan: string,
    lengthWithin: string,
  }
}