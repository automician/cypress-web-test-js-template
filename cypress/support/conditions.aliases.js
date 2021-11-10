// In fact, the majority of conditions – are aliases to so called «chainers» from ChaiJs
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


// --- AIASES --- // 

export const be = {
  equalTo: 'equal',
  visible: 'be.visible',
  hidden: 'be.hidden',
  selected: 'be.selected',
  checked: 'be.checked',
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
    checked: 'not.be.checked',
    inDOM: 'not.exist',
    empty: 'not.be.empty',
    enabled: 'not.be.enabled',
    matching: 'not.match',
    containing: 'not.contain',
  }
}

export const have = {
  filtered: 'have.filtered',
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
    filtered: 'not.have.filtered',
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
