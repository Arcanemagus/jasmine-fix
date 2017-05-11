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
    it('waits the asked amount and returns a promise that resolves properly', async function() {
      const time = Date.now()
      await wait(20)
      const diff = Date.now() - time
      expect(diff).toBe(20)
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
})
