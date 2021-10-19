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
  exactText: string,
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