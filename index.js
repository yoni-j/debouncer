
// Implement this

class Debouncer {
  constructor(timeoutSetting) {
    this.timers = {}
    this.timeoutSetting = timeoutSetting || 1000
   }
  run(callback) {
    if (callback.name in this.timers) { 
      clearTimeout(this.timers[callback.name]);
    }
    this.timers[callback.name] = setTimeout(() => { 
        callback()
    }, this.timeoutSetting);
   }

   cancel(callback) {
    if (callback.name in this.timers) { 
      clearTimeout(this.timers[callback.name]);
    }
  }

  }


class Throttle {
    constructor(timeoutSetting) {
      this.running = []
      this.timeoutSetting = timeoutSetting || 1000
     }
    run(callback) {
      if (!this.running.includes(callback.name)) { 
        this.running.push(callback.name)
        callback()
        setTimeout (() => {
          this.running = this.running.filter((callbackName) => {
            callbackName != callback.name
          })
        }, this.timeoutSetting)
      }
     }
  }

// -- Tests --
// Run this file to see if the tests pass.
//


const assert = require('assert').strict;

runTestCases()

async function runTestCases() {

  const debouncer = new Debouncer(500)
  const throttle = new Throttle(500)

  const tests = [
    async () => {
      // Calling bumpCounter1 4 times in a row, in less than a second.
      // Only the last one should actually run.
      debouncer.run(bumpCounter1)
      debouncer.run(bumpCounter1)
      debouncer.run(bumpCounter1)
      debouncer.run(bumpCounter1)
      await sleep(debouncer.timeoutSetting + 500)
      assert.equal(counter1, 1, "bumpCounter1 should have ran 1 time.")
    },
    async () => {
      debouncer.run(bumpCounter2)
      await sleep(debouncer.timeoutSetting + 500)
      // We've waited more than 1 second before calling bumpCounter2 again,
      // so it should run again.
      debouncer.run(bumpCounter2)
      await sleep(debouncer.timeoutSetting + 500)
      assert.equal(counter2, 2, "bumpCounter2 should have ran 2 times.")
    },
    async () => {
      // Calling bumpCounter3 twice without waiting. should run once.
      debouncer.run(bumpCounter3)
      debouncer.run(bumpCounter3)
      // Calling bumpCounter4 twice without waiting. should run once.
      debouncer.run(bumpCounter4)
      debouncer.run(bumpCounter4)
      await sleep(debouncer.timeoutSetting + 500)
      assert.equal(counter3, 1, "bumpCounter3 should have ran 1 time.")
      assert.equal(counter4, 1, "bumpCounter4 should have ran 1 time.")
    },
    async () => {
      debouncer.run(bumpCounter5)
      debouncer.cancel(bumpCounter5)
      await sleep(debouncer.timeoutSetting + 500)
      assert.equal(counter5, 0, "bumpCounter5 should have ran 0 times.")
    },

    async () => {
      throttle.run(bumpCounter6)
      await sleep(debouncer.timeoutSetting  - 500)
      throttle.run(bumpCounter6)
      await sleep(1000)
      throttle.run(bumpCounter6)
      assert.equal(counter6, 2, "bumpCounter5 should have ran 2 times.")
    },
  ]

  for (let [i, testCase] of tests.entries()) {
    try {
      await testCase()
      console.log(`Test case ${i + 1} passed: `)
    } catch (e) {
      console.error(`Test case ${i + 1} failed: `, e.message)
    }
  }
  console.log("Tests finished.")

}

let counter1 = 0
let counter2 = 0
let counter3 = 0
let counter4 = 0
let counter5 = 0
let counter6 = 0

function bumpCounter1() { counter1 += 1 }
function bumpCounter2() { counter2 += 1 }
function bumpCounter3() { counter3 += 1 }
function bumpCounter4() { counter4 += 1 }
function bumpCounter5() { counter5 += 1 }
function bumpCounter6() { counter6 += 1 }


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
