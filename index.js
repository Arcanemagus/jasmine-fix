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

const names = ['beforeEach', 'afterEach', 'it', 'fit', 'ffit', 'fffit']
const defaultOptions = {
  timeout: 10 * 1000,
}

names.forEach((name) => {
  module.exports[name] = function(arg1, arg2, arg3) {
    const callback = typeof arg1 === 'function' ? arg1 : arg2
    const description = typeof arg1 === 'string' ? arg1 : null
    const options = arg3 && typeof arg3 === 'object' ? arg3 : {}

    Object.assign(options, defaultOptions)

    const middleware = function() {
      const value = callback()
      if (value && typeof value.then === 'function') {
        waitsForPromise(function() {
          return value
        }, options.timeout)
      }
    }
    if (description) {
      global[name](description, middleware)
    } else {
      global[name](middleware)
    }
  }
})

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
})

module.exports.wait = function(timeout) {
  return new Promise(function(resolve) {
    setTimeout(resolve, timeout)
  })
}
