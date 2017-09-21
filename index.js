'use strict'

function waitsForPromise (fn, timeout) {
  const promise = fn()
  waitsFor('spec promise to resolve', function (done) {
    promise.then(done, function (error) {
      jasmine.getEnv().currentSpec.fail(error)
      done()
    })
  }, timeout)
}

const names = ['beforeEach', 'afterEach', 'xit', 'it', 'fit', 'ffit', 'fffit']

// Jasmine 1.3.x has no sane way of resetting to native clocks, and since we're
// gonna test promises and such, we're gonna need it
function resetClock() {
  for (const key in jasmine.Clock.real) {
    if (jasmine.Clock.real.hasOwnProperty(key)) {
      window[key] = jasmine.Clock.real[key]
    }
  }
}

beforeEach(function() {
  resetClock()
  // Jasmine mocks Date.now()
  // See steelbrain/jasmine-fix#6
  jasmine.unspy(Date, 'now')
})

// The default timeout of 6 seconds is quite often too slow, bump it to 10 seconds
jasmine.getEnv().defaultTimeoutInterval = 10 * 1000;

module.exports.patch = function patch(name) {
  return function(arg1, arg2, arg3) {
    const callback = typeof arg1 === 'function' ? arg1 : arg2
    const description = typeof arg1 === 'string' ? arg1 : null
    let optionsArg = {}
    if (arg2 && typeof arg2 === 'object') {
      optionsArg = arg2
    } else if (arg3 && typeof arg3 === 'object') {
      optionsArg = arg3
    }

    const options = Object.assign({}, optionsArg)

    const middleware = function() {
      const value = callback()
      if (value && typeof value.then === 'function') {
        waitsForPromise(function() {
          return value
        }, options.timeout)
      }
    }
    if (description) {
      return global[name](description, middleware)
    } else {
      return global[name](middleware)
    }
  }
}
module.exports.wait = function(timeout) {
  return new Promise(function(resolve) {
    setTimeout(resolve, timeout)
  })
}

names.forEach((name) => {
  module.exports[name] = module.exports.patch(name)
})
