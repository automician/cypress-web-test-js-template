// In fact, the majority – are aliases to so called «chainers» from ChaiJs
// In other libraries like Selenium, they are a bit similar to «expected conditions» 
// * in fact the chainers are just condition names
// Also are known as «matchers» in libraries like Hamcrest


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
  exactText: 'have.text', // TODO: implement as custom to log exact name
  text: 'include.text',
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
    exactText: 'not.have.text', // TODO: implement as custom to log exact name
    text: 'not.include.text',
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