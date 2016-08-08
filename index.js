'use strict'

function promisedFit(name, callback) {
  fit(name, function() {
    const value = callback()
    if (value && typeof value.then === 'function') {
      waitsForPromise({ timeout: 10 * 1000 }, function() {
        return value
      })
    }
  })
}

function promisedIt(name, callback) {
  it(name, function() {
    const value = callback()
    if (value && typeof value.then === 'function') {
      waitsForPromise({ timeout: 10 * 1000 }, function() {
        return value
      })
    }
  })
}

function promisedWait(timeout) {
  return new Promise(function(resolve) {
    setTimeout(resolve, timeout)
  })
}

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

module.exports = {
  it: promisedIt,
  fit: promisedFit,
  wait: promisedWait,
}
