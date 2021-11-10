/**
 * see impl. ideas at
 * https://javascript.plainenglish.io/javascript-how-to-intercept-function-and-method-calls-b9fd6507ff02
 * https://2ality.com/2015/10/intercepting-method-calls.html
 * https://morioh.com/p/aec058603f18
 */
function interceptMethodCalls(obj, fn) {
  return new Proxy(obj, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return new Proxy(target[prop], {
          apply: (target, thisArg, argumentsList) => {
            fn(prop, argumentsList);
            return Reflect.apply(target, thisArg, argumentsList);
          }
        });
      } else {
        return Reflect.get(target, prop);
      }
    }
  });
}

export function steps(obj) {
  return interceptMethodCalls(obj, function(prop, args) {
    const ignored = [  // TODO: move this list to config;)
      // skipe methods ...
      /^open$/,      // that opens page
      /^visit$/,     // - same as above 
      /^_/,          // that are kind of "private" and are not considered to be used in tests as steps
      /^toString$/,
    ]
    if (!ignored.some((it) => it.test(prop))) { 
      cy.log(
        `>>> ${obj}: ${prop} >>> ` + JSON.stringify(args, null, 2)
      )
    }
  })
}
