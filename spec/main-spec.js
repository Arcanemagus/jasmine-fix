'use babel'

import { it as myIt, xit as myXit, wait, beforeEach } from '../'

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

  describe('timeouts', function() {
    myXit("uses a default timeout of 10 seconds when none is provided", async function() {
      await wait(10001)
    })
    myXit("uses a custom timeout when provided", async function() {
      await wait(20001)
    }, {
      timeout: 2000,
    })
  })

  describe('date fix', function() {
    myIt('it unmocks Date.now automatically', async function() {
      const before = Date.now()
      await wait(10)
      const after = Date.now()
      expect(before).not.toBe(after)
    })
  })
})
