import { Component } from "../components/component"

export const upload = (selector) => ({
  ...Component,
  selector,
  attach(fixture) {
    this.element().get().attachFile(fixture)
  },
})

export const file = (fixture) => ({
  set: (selector) => upload(selector).attach(fixture),
  value: fixture,
  toString: () => fixture,
})