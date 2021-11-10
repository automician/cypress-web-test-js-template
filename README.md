## Summary

This is a template project with some guide that shows how to tune Cypress to higher level in context of writing more user-oriented and easier to use High-Level System End-to-End tests. It often uses ideas of the Selenides family of Web UI Testing Frameworks (like Selenide in Java, Selene in Python, NSelene in C#, SelenideJs in JavaScript).

## Main features overview

Main features added:
- Selenide/Selene style aliases to existing conditions: .should(have.text, 'cleaner') over `.should('have.text', 'dirty')`
  - more custom elements collection conditions like texts, exactTexts from Selenide
- Selene style aliases: `browser.*` over `cy.*`, `s(selector).get()` over `cy.get(selector)`
- lazy elements for basic more common use cases: `const clean = s('#clean')` over `const bulky = () => cy.get('#bylky')`
  - to make code more concise by removing Cypress limitation of not being able to store elements in vars

## Intro 

**Given** Cypress…:

* pros
  * Shift-left oriented, force you to write and learn how to write oprimised efficient tests
    * Best Docs in class to teach you how to do it
      * An Example/Recipe for almost any case
  * State of the art Debugging
  * ~~almost~~ no redundant async/await in usage
* cons
  * overblown not consistent (with both itself and common JS libs) and not obvious API, you have to read enormous documentation to learn each nuances
    * while having access to all methods – not everything work as you expected depending from context, sometimes – just do not work
    * more than one way (often not consistent with each other) to do things (especially when working with aliases)
  * lower level of API style, while the tests to be written should be normally more high level and user oriented
    * just a few examples:
      *  `cy.get(selector)` instead of something like `element(selector)`, 
      * `cy.visit(url)` instead of `browser.visit(url)`, or `page.load(url)`
  * has no lazy element builders
    * selectors can't be easily broken into parts for easier support during "healing selectors on change"
    * when broken – the waiting will not work as you expect ([only the last command is retried](https://docs.cypress.io/guides/core-concepts/retry-ability#Only-the-last-command-is-retried)) and tests become fragile, so in complex UI scenarios you kind of forced [allways to stick to long merged selectors](https://docs.cypress.io/guides/core-concepts/retry-ability#Merging-queries) or overblown your code with [explicit assertions](https://docs.cypress.io/guides/core-concepts/retry-ability#Alternate-commands-and-assertions)
  * "dirty" API like in `.should('have.text', 'dirty')` instead of something like  `.should(have.text, 'cleaner')`
    * such API is also much harder to extend keeping Autocomplete and Hints working as you expect

**When**

* We have smart Juniors willing learn and achieve ASAP the best result from Automation
  * And lack Senior resources
* We have a project where Cypress is already a tool to use, with no way to change it

**Then**

* We have this Template and Guide to make your life easier ;)
  * It is a mixture of "quick just do it setup actions" and more advanced "extending the framework to tune it to your needs"

But before going further, ensure you are familiar with:

* TODO…

## Notes on tech stack

* This is a JavaScript project. TypeScript's *.d.ts files for main Cypress API extensions are used here only to improve autocomplete feature in popular editors, like Visual Studio Code, that have typescript support buit in.
  * In general, using TypeScript for the majority of "test automation" projects might be preferrable for an «average» user, because would make "usage" easier on both side - «implementing framework» and «coding actual tests» (with support of Autocomplete, Hints and some more DSLish style when using Annotations)
  * But here the idea was to show the kitchen from the very low level without much of TypeScript stuff;), focusing on raw JavaScript features and its object-oriented nature (without classes;)), that are also pretty powerfull in context of building some DSL tuned to the context of test automation

## The guide of 

You can just use this project as a template, but in case you want to build same from scratch, tuning it to your needs, here is a detailed guide on how to do this...

1

```shell
mkdir cypress-js-web-test && cd $_ && npm init -y && git init && echo "#JavaScript\nnode_modules\n\n# Mac\n.DS_Store" > .gitignore && npm install cypress --save-dev && git add . && git commit -m "initial base js skeleton with cypress" && git branch -m main 
```


2

Tune meta-info at package.json



3

to open Cypress

```shell
npx cypress open
```

4 

Setup Autocomplete (https://docs.cypress.io/guides/tooling/IDE-integration#Set-up-in-your-Dev-Environment)

add to `./cypress/tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "types": ["cypress"],
    "noEmit": true
  },
  "include": ["**/*.*"]
}
```



4.2 


Setup ts-checks for JavaScript files too (will allow to check typings from jsdocs)

```json
{
  "compilerOptions": {
    "checkJs": true,
    "maxNodeModuleJsDepth": 1,
    "target": "ES2021",
    ...
  },
  ...
}
```

* set to target the version of js you are interested to (usually same as you add to eslintrc too)

more resources:

* https://dev.to/t7yang/type-safety-in-javascript-with-jsdoc-and-vscode-1a28

5

Custom commands: more examples

https://docs.cypress.io/api/cypress-api/custom-commands

https://www.toolsqa.com/cypress/custom-commands-in-cypress/



6

plugins to consider:

cypress

* cypress-plugin-tab
* https://github.com/dmtrKovalenko/cypress-real-events
* https://github.com/abramenal/cypress-file-upload
  * https://docs.cypress.io/faq/questions/using-cypress-faq#How-do-I-test-uploading-a-file

vscode

* https://github.com/Shelex/vscode-cy-helper
  * https://marketplace.visualstudio.com/items?itemName=Shelex.vscode-cy-helper&ssr=false

7 

add eslint

```shell
npm install eslint --save-dev && npm install eslint-plugin-cypress --save-dev && npm install --save-dev eslint-plugin-chai-friendly && npx eslint --init
```



some links:

* https://github.com/cypress-io/eslint-plugin-cypress



`.eslintrc.json` example:

```json
{
    "plugins": [
        "cypress",
        "chai-friendly"
    ],
    "globals": {
        "cy": true,
        "Cypress": true
    },
    "env": {
        "cypress/globals": true,
        "es2021": true
    },
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "extends": [
        "plugin:cypress/recommended",
        "plugin:chai-friendly/recommended"
    ],
    "rules": {
        "max-len": ["error", { "code": 80, "ignoreComments": true}],
        "cypress/no-pause": "error"
    }
}

```

8

Tune your globals

* https://newbedev.com/create-a-global-variable-in-typescript
  * https://stackoverflow.com/a/56984941/1297371 (https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript)
  * seems like no way to type globals via jsdocs :(



```
echo 'global.browser = cy' >> cypress/support/index.js
```



cypress/support/global.d.ts

```typescript
/// <reference types="cypress" />


/**
 * user-oriented alias to `cy`
 */
 declare const browser: Cypress.cy
```

* If your file hasn't any `import` or `export`

```typescript
/// <reference types="cypress" />

import { Locator } from "./locator"

declare global {
  /**
   * user-oriented alias to `cy`
   */
   const browser: Cypress.cy
  
  
   /**
    * Gives a Lazy alternative to cy.get(selector)
    * @param selector = a string with css selector
    * @example
    * s('#foo').get().setValue('bar')
    * # over
    * # cy.get('#foo').setValue('bar')
    */
  function s(selector: string): Locator
}
```

* If your file has any `import` or `export` line



9 Tune and extend assertions

* https://docs.cypress.io/guides/references/assertions
  * https://docs.cypress.io/api/commands/should#Verify-length-content-and-classes-from-multiple-lt-p-gt
  * https://docs.cypress.io/guides/references/assertions#Adding-New-Assertions
    * https://www.chaijs.com/api/plugins/
      * https://www.chaijs.com/guide/plugins/#composing-an-assertion
      * https://www.chaijs.com/guide/helpers/
    * https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/extending-cypress__chai-assertions
      * https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/extending-cypress__chai-assertions/cypress/support/index.js
      * https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/extending-cypress__chai-assertions/cypress/support/index.d.ts
    * https://stackoverflow.com/questions/55842707/how-can-i-define-a-custom-assertion-operator-in-cypress
      * https://stackoverflow.com/a/55854585/1297371
    * https://github.com/freewind-demos/typescript-cypress-add-custom-assertion-method-textTrimmed-demo/blob/master/cypress/support/textTrimmed.ts
* https://filiphric.com/cypress-basics-check-if-element-exists



10 Consider custom Lazy Elements 



11 Integrate with reporter like Allure 

TODO



**P.S. I** Afterwords

Read as soon as you have time:

* https://docs.cypress.io/guides/core-concepts/retry-ability
* TODO: …



**P.S. II** Other Usefull Resources

Read when you need it…


Modules & Globals

* https://basarat.gitbook.io/typescript/project/modules/external-modules
  * https://basarat.gitbook.io/typescript/project/modules/globals
    * https://newbedev.com/create-a-global-variable-in-typescript
      * https://stackoverflow.com/a/56984941/1297371 (https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript)
  * https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html
* https://basarat.gitbook.io/typescript/type-system/intro/d.ts


Other usefull resources

* https://github.com/cypress-io/cypress-example-recipes

* https://glebbahmutov.com/cypress-examples/8.6.0/


## More...

### Conventions

* Use arrow functions over functions for mocha's `describe` and `it` to dissalow access and so cut the less consistent "this" style access to cypress aliases;). This will make tests more consistent and so more readable. Also it will be easier to debug them, and reduce errors connected to sync/async flow break.

### Differences from raw Cypress

* you can store locators to vars like `const ok = s('#ok')
  * all retry-able queries  (like filter, find, etc.) written in a chain before first action – are retried (in raw Cypress only the last query is retried)
    * yet first action (e.g. type, click) on query (built as a chain of get filter find, etc) potentially break retry-ability for next actions
      * so remember and count that full retry-ability will work only for the first action
      * TODO: consider removing this limitation by implementing: store a chain of commands and call it only ON next cy.get or cy.request (etc.) OR custom cy.end()... or find another way:)
* custom command `cy.the(selector)` automatically converts
  * from `cy.the('some-word')` to `cy.get('[data-qa=some-word]')`
  * from `cy.the('text=Some text')` to `cy.contains('Some text')`
  * and behaves like common `cy.get(selector)` otherwise
  * same convertion applies at calling `by` on `s(selector).by(selector)`, where by is a lazy version of cy.filter with extra conversions
* you can write `.should(have.length, 3)` instead `.should('have.length', 3)`

### Differences from Selenide & Co

* `cy.get(selector)` or this project extension `s(selector)` – is not an element but a Locator that can resolve under the hood into element or collection depending on context. There is no explicit way to differentiate a "collection of elements" and "element".
* $ in Selenide from Java is not the same as $ here, where it's a method from JQuery lib, that allows similar things but on a lower level of DOM manipulation. Instead of Selenide's `$(selector)` – use `s(selector)` here, same way as in Selene from Python ;) – yet, count that it's not a lazy element, it's lazy Locator that can find more than one element;)

### Differences from Playwright and other async libs for web ui test automation

* `cy.*.*.*` is kind of actions builder, that, being async under the hood – looks like syncronous and should be used like syncronous
  * e.g. playwright or webdriver.io - are async and should be used as async ;)