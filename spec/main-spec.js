'use babel'

import { it as myIt, wait, beforeEach } from '../'

describe('Jasmine-Fix', function() {
  describe('it', function() {
    {
      let complete = false
      myIt('something sync', function() {
        expect(false).toBe(false)
        expect(true).toBe(true)
        expect(function() {
          throw new Error()
        }).toThrow()
        complete = true
      })
      waitsForPromise(function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            if (complete) {
              resolve()
            } else {
              reject()
            }
          }, 5)
        })
      })
    }

    {
      let complete = false
      myIt('something async', async function() {
        expect(false).toBe(false)
        expect(true).toBe(true)
        expect(function() {
          throw new Error()
        }).toThrow()
        await new Promise(function(resolve) {
          setTimeout(resolve, 0)
        })
        complete = true
      })
      waitsForPromise(function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            if (complete) {
              resolve()
            } else {
              reject()
            }
          }, 5)
        })
      })
    }
  })
  describe('wait', function() {
    myIt('waits the asked amount and returns a promise that resolves properly', async function() {
      const time = process.uptime() * 1000
      await wait(20)
      const diff = (process.uptime() * 1000) - time
      expect(diff).toBeGreaterThan(19)
      expect(diff).toBeLessThan(30)
    })
  })
  describe('patched beforeEach', function() {
    let timesExecuted = 0
    beforeEach(function() {
      timesExecuted++
    })
    it('a', function() {})
    it('b', function() {})
    it('c', function() {})
    it('d', function() {
      expect(timesExecuted).toBe(4)
    })
  })

  // The following tests work, that is they timeout after the correct amount of time
  // The issue is, im not sure how to test for a timeout (without the test actually failing)

  // describe('timeouts', function() {
  //   myIt("uses a default timeout of 10 seconds when none is provided", async function() {
  //     await wait(10001)
  //   })
  //   myIt("uses a custom timeout when provided", async function() {
  //     await wait(2001)
  //   }, 2000)
  // })
})
