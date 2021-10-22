/// <reference types="cypress" />

type ParametrizedGetChainableSubject = (
  opts: Partial<
    Cypress.Loggable 
    & Cypress.Timeoutable 
    & Cypress.Withinable 
    & Cypress.Shadow
  >,
) => Cypress.Chainable<JQuery<any>>

type ReturnsChainableSubject = () => Cypress.Chainable<JQuery<any>>

declare class Locator {
  // options: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>

  constructor(
    chain: { // TODO: not sure this typings are correct... 
      path: string,
      get: ParametrizedGetChainableSubject,
      guards: ReturnsChainableSubject[],
      queries: ReturnsChainableSubject[],
    }, 
    options: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  )

  get<E extends Node = HTMLElement>(
    options?: Partial<
      Cypress.Loggable 
      & Cypress.Timeoutable 
      & Cypress.Withinable 
      & Cypress.Shadow
    >
  ): Cypress.Chainable<JQuery<E>>

  // --- Element builders --- //

  /**
   * Filters the located elements by selector like cy.filter(selector)
   * adding some extra shortcuts (automatic selector conversions),
   * @example
   * const s => (selector) => new Locator({path: selector}) 
   * s('.todo').by(':contains("Write a test!")')
   * s('.todo').by('text=Write a test')  // same as above
   * s('.todo').by('.completed')  // same as cy.get('.todo').filter('.completed')
   * s('.todo').by(':not(.completed)')  // same as cy.get('.todo').not('.completed')
   * s('.todo').by(':has(img.high-priority-flag)')  // same as cy.get('.todo').filter(':has(img.high-priority-flag)')
   * s('.todo').by(' img.high-priority-flag')  // same as above
   * s('.todo').by(':has(>img.high-priority-flag)')
   * s('.todo').by('>img.high-priority-flag')  // same as above
   */
  by(
    selector: string, 
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
  ): Locator

  /**
   * Filters the located elements by function-predicate.
   * Is simply an alias to `.filter(fn, options)` from Cypress
   * @example
   * const s => (selector) => new Locator({path: selector}) 
   * s('.number').by((i, e) => i % 2 == 0 && e.innerText.includes('I am even!'))
   */
  by<E extends Node = HTMLElement>(
    fn: (index: number, element: E) => boolean, 
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
  ): Locator

  /**
   * Lazy ratriable version of cy.filter(selector, options)
   * @param selector 
   * @param options 
   */
  filter(
    selector: string, 
    options?: Partial<
      Cypress.Loggable 
      & Cypress.Timeoutable 
    >,
  ): Locator

  /**
   * Lazy ratriable version of cy.find(selector, options)
   * @param selector 
   * @param options 
   */
  find(
    selector: string, 
    options?: Partial<
      Cypress.Loggable 
      & Cypress.Timeoutable 
      & Cypress.Shadow
    >,
  ): Locator

  /**
   * Lazy ratriable version of cy.eq(index, options)
   * @param selector 
   * @param options 
   */
  eq(
    index: number, 
    options?: Partial<
      Cypress.Loggable 
      & Cypress.Timeoutable 
    >,
  ): Locator

  // --- Assertions --- //

  /**
   * Call it if you exactly know the condition and its params to match
   * Otherwise start typing from `.get().should(` 
   * to use Autocomplete hints from original Cypress API
   * @param match – a common chainer from ChaiJs, like 'have.text'
   * @param actual - variable arguments reflecting the expectaction of assertion
   * @example
   * const s => (selector) => new Locator({path: selector}) 
   * s('#primary-btn').should('be.enabled')
   * s('#primary-btn').should('have.text', 'Ok')
   * s('#save-btn').should('have.attr', 'role', 'action')
   */
  should(
    match: string, 
    ...expected: any[],
  ): Cypress.Chainable<JQuery<HTMLElement>>

  // --- Actions --- //

  type(
    text: string, 
    options?: Partial<Cypress.TypeOptions>,
  ): Cypress.Chainable<JQuery<HTMLElement>>

  clear(
    options?: Partial<Cypress.ClearOptions>
  ): Cypress.Chainable<JQuery<HTMLElement>>

  submit(
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
  ): Cypress.Chainable<JQuery<HTMLElement>>

  setValue(
    text: string, 
    options?: Partial<Cypress.TypeOptions>,
  ): Cypress.Chainable<JQuery<HTMLElement>>

  click(
    options?: Partial<Cypress.ClickOptions>
  ): Cypress.Chainable<JQuery<HTMLElement>>

  doubleClick(
    options?: Partial<Cypress.ClickOptions>
  ): Cypress.Chainable<JQuery<HTMLElement>>

  /**
   * Simulates hover via .trigger('mousover')
   * Probably will not work most of the time:)
   */
  hover(
    options?: Partial<
      Cypress.TriggerOptions 
      & Cypress.ObjectLike 
      & MouseEvent
    >
  ): Cypress.Chainable<JQuery<HTMLElement>>

  pressEnter(
    options?: Partial<Cypress.TypeOptions>
  ): Cypress.Chainable<JQuery<HTMLElement>>

  pressEscape(
    options?: Partial<Cypress.TypeOptions>
  ): Cypress.Chainable<JQuery<HTMLElement>>
}