Jasmine-Fix
============

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/jasmine-fix.svg)](https://greenkeeper.io/)

Jasmine-Fix is a collection of my helper utilities and fixes for Jasmine. It resets the clock to native one, so you don't have to do `advanceClock` and can write your specs just like you write your app.

### Installation

```
npm install --save jasmine-fix
```

### API

#### `it`
Proxy of the `it` Jasmine function which accepts `async` callbacks, so you can do `await` in them instead of having to do a lot of `waitsForPromise`s

#### `fit`

Proxy of the `fit` Jasmine function which accepts `async` callbacks

#### `beforeEach`

Proxy of the `beforeEach` Jasmine function which accepts `async` callbacks

#### `afterEach`

Proxy of the `beforeEach` Jasmine function which accepts `async` callbacks

#### `wait`

Sugar for async `it` and `fit` callbacks, if you do `await wait(5000)`, it'll wait 5 seconds

#### Usage

To only fix the `setTimeout` and `setInterval` in the app so you don't have to `advanceClock`

```js
'use babel'
import 'jasmine-fix'

describe('MyApp', function() {
  console.log('now')
  setTimeout(function() {
    console.log('after 4 seconds')
  }, 4000)
  setTimeout(function() {
    console.log('after 5 seconds')
  }, 5000)
})
```

To use the async magic
```js
'use babel'
import { wait, it } from 'jasmine-fix'

describe('My Cool App', function() {
  it('does something sync', function() {
    console.log('do normal things here')
  })
  it('does something async', async function() {
    let myVar = false
    await promised_magic('something')
    setTimeout(function() {
      myVar = true
    }, 10)
    expect(myVar).toBe(false)
    await wait(10)
    expect(myVar).toBe(true)
  })
})
```

### License

This project is licensed under the terms of MIT License, see the LICENSE file for more info.
