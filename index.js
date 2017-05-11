'use strict'

function waitsForPromise (fn) {
  const promise = fn()
  waitsFor('spec promise to resolve', function (done) {
    promise.then(done, function (error) {
      jasmine.getEnv().currentSpec.fail(error)
      done()
    })
  }, 10 * 1000)
}

const names = ['beforeEach', 'afterEach', 'it', 'fit', 'ffit', 'fffit']

names.forEach((name) => {
  module.exports[name] = function(description, callback) {
    global[name](description, function() {
      const value = callback()
      if (value && typeof value.then === 'function') {
        waitsForPromise(function() {
          return value
        })
      }
    })
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
