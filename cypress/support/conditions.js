// In fact, the majority – are aliases to so called «chainers» from ChaiJs
// In other libraries like Selenium, they are a bit similar to «expected conditions» 
// (in fact the chainers are just condition names...)
// Also are known as «matchers» in libraries like Hamcrest
// 
// Below we stick to the adopted-by-cypress-chai-assertions style, 
// i.e. something like `.should(have.exactTexts, 'a', 'b', 'c')`
// where have.exactTexts is an alias to 'have.exactTexts'
// and 'exactTexts' is a cusom chai assertion
//
// Refactoring from .should(have.exactTexts, 'a', 'b', 'c') to .should(have.exactTexts('a', 'b', 'c')) 
// would allow better hinting during autocomplete both on usage and implementation/support side. 
// But then it would be less consistent with original cypress style, 
// so for now the decision is to keep consistency with Cypress as much as possible, 
// in order to not overcomplicate things...


const elementsCollectionHaveExactTexts = (_chai, utils) => {
  // this style of implementation should provide proper hints when autocomplete // TODO: make this hint work...
  // if you don't need it, consider the simpler version
  // like in this example: https://stackoverflow.com/a/55854585/1297371

  /*

  // it's also possible to use this alternative implementation
  // (not as Chai assertion, but simply cy callback)

  const haveExactTexts = (...texts) => ($elements) => {
      const actualTexts = $elements.map((i, element) => {
        return Cypress.$(element).text().trim()
      }).get()
    
      expect(actualTexts).to.deep.eq(texts)
  }

  // so then can be used like 

  cy.get('.vowel').should(haveExactTexts('a', 'e', 'i', 'o', 'u'))

  // being pretty simple, 
  // yet this implementation is less powerfull 
  // in context of logging errors on failures

  */

  function assertExactTexts(...texts) {
    const $elements = this._obj
    const expectedTexts = (
        Array.isArray(texts) && texts.length === 1 && Array.isArray(texts[0])
    ) ? texts[0]
      : texts

    const actualTexts = $elements.map((i, element) => { 
      return Cypress.$(element).text().trim()
    }).get()

    /* 
    // might also work something like:
    _chai.Assertion(actualTexts).to.deep.eq(texts)
    // or
    _chai.Assertion(actualTexts).to.have.same.members(texts)
    // instead of the following...
    */

    this.assert(
      // expression to be tested
      actualTexts.length === expectedTexts.length 
      && actualTexts.every((actual, i) => actual === expectedTexts[i]),
      // msg or fn to describe failure
      `elements by ${$elements.selector} `
      + 'should have exact texts: #{exp}'
      + '\nactual texts: #{act}'
      + '\nactual colllection:'
      + '\n#{this}'
      ,    
      // msg or fn to describe negated failure
      `expected elements by ${$elements.selector} `
      + 'to not have exact texts: #{exp}'
      + '\nactual texts: #{act}'
      + '\nactual colllection:'
      + '\n#{this}'
      ,    
      // expected
      expectedTexts,
      // actual
      actualTexts, 
      // show diff?
      false, 
    )
  }

  _chai.Assertion.addMethod('exactTexts', assertExactTexts)
}

chai.use(elementsCollectionHaveExactTexts)

const elementsCollectionHaveTexts = (_chai, utils) => {

  function assertTexts(...texts) {
    const $elements = this._obj
    const expectedTexts = (
        Array.isArray(texts) && texts.length === 1 && Array.isArray(texts[0])
    ) ? texts[0]
      : texts

    const actualTexts = $elements.map((i, element) => { 
      return Cypress.$(element).text().trim()
    }).get()

    this.assert(
      // expression to be tested
      actualTexts.length === expectedTexts.length 
      && actualTexts.every((actual, i) => actual.includes(expectedTexts[i])),
      // msg or fn to describe failure
      `elements by ${$elements.selector} `
      + 'should have texts: #{exp}'
      + '\nactual texts: #{act}'
      + '\nactual colllection:'
      + '\n#{this}'
      ,    
      // msg or fn to describe negated failure
      `expected elements by ${$elements.selector} `
      + 'to not have texts: #{exp}'
      + '\nactual texts: #{act}'
      + '\nactual colllection:'
      + '\n#{this}'
      ,    
      // expected
      expectedTexts,
      // actual
      actualTexts, 
      // show diff?
      false, 
    )
  }

  _chai.Assertion.addMethod('texts', assertTexts)
}

chai.use(elementsCollectionHaveTexts)

const elementsCollectionHaveInnerElements= (_chai, utils) => {

  function assertElements(selector) {
    const $elements = this._obj
    const actualFoundLength = $elements.has(selector).length

    this.assert(
      // expression to be tested
      actualFoundLength >= 0,
      // msg or fn to describe failure
      `elements by ${$elements.selector} `
      + 'should have more than 0 elements found by: #{exp}'
      + '\nactual found elements length: #{act}'
      + '\nactual colllection:'
      + '\n#{this}'
      ,    
      // msg or fn to describe negated failure
      `expected elements by ${$elements.selector} `
      + 'should have 0 elmeents found by: #{exp}'
      + '\nactual found elements length: #{act}'
      + '\nactual colllection:'
      + '\n#{this}'
      ,    
      // expected
      selector,
      // actual
      actualFoundLength, 
      // show diff?
      false, 
    )
  }

  _chai.Assertion.addMethod('elements', assertElements)
}

chai.use(elementsCollectionHaveInnerElements)

// --- AIASES --- // 

export const be = {
  equalTo: 'equal',
  visible: 'be.visible',
  hidden: 'be.hidden',
  selected: 'be.selected',
  inDOM: 'exist',
  empty: 'be.empty',
  enabled: 'be.enabled',
  matching: 'match',
  containing: 'contain',
  not: {
    equalTo: 'not.equal',
    // visible: 'not.be.visible', // TODO: override original not.be.visible – make it pass on not.exist
                                  //       see more at https://filiphric.com/cypress-basics-check-if-element-exists
    selected: 'not.be.selected',
    inDOM: 'not.exist',
    empty: 'not.be.empty',
    enabled: 'not.be.enabled',
    matching: 'not.match',
    containing: 'not.contain',
  }
}

export const have = {
  the: 'have.elements',
  elements: 'have.elements',
  exactText: 'have.text', // TODO: implement as custom to log exact name
  text: 'include.text',
  exactTexts: 'have.exactTexts',
  texts: 'have.texts',
  attr: 'have.attr',
  value: 'have.value',
  valueContaining: 'contain.value',
  cssClass: 'have.class',
  length: 'have.length',
  lengthGreaterThan: 'have.length.greaterThan',
  lengthLessThan: 'have.length.lessThan',
  lengthAtLeast: 'have.length.at.least',
  lengthAtMost: 'have.length.at.most',
  lengthWithin: 'have.length.within',
  no: {
    elements: 'not.have.elements',
    exactText: 'not.have.text', // TODO: implement as custom to log exact name
    text: 'not.include.text',
    exactTexts: 'not.have.exactTexts',
    texts: 'not.have.texts',
    attr: 'not.have.attr',
    value: 'have.value',
    valueContaining: 'not.contain.value',
    cssClass: 'not.have.class',
    length: 'not.have.length',
    lengthGreaterThan: 'not.have.length.greaterThan',
    lengthLessThan: 'not.have.length.lessThan',
    lengthWithin: 'not.have.length.within',
  }
}
