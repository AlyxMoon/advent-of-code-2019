
const generateArrayOfPermutations = (length = 0, min = 0, max = 0, i = 0) => {
  if (length <= 0 || min > max) return []

  const currentPermutations = [...Array(max - min + 1)].map((_, x) => x + min)

  const futurePermutations = i < length - 1
    ? generateArrayOfPermutations(length, min, max, i + 1)
    : []

  return futurePermutations.length === 0
    ? currentPermutations.map(p => [p])
    : currentPermutations.reduce((combined, p) => {
      return futurePermutations.reduce((combinedF, f) => [...combinedF, [p, ...f]], combined)
    }, [])
}

const generateUniqueValueArrayOfPermutations = (length = 0, min = 0, max = 0) => {
  return generateArrayOfPermutations(length, min, max)
    .filter(permutation => permutation.every((val, i, p) => p.indexOf(val) === i))
}

const generatePermutationsForInjections = (arr, i = 0) => {
  const currentPermutations = [...Array(arr[i].max - arr[i].min + 1)]
    .map((_, x) => [arr[i].address, x + arr[i].min])

  const futurePermutations = i < arr.length - 1
    ? generatePermutationsForInjections(arr, i + 1)
    : []

  return futurePermutations.length === 0
    ? currentPermutations.map(p => [p])
    : currentPermutations.reduce((combined, p) => {
      return futurePermutations.reduce((combinedF, f) => [...combinedF, [p, ...f]], combined)
    }, [])
}

// Create iterable that returns sequence of primes indefinitely for each call to next()
function * generatePrimes () {
  const markedNotPrimeMap = new Map()
  for (let valueToCheck = 2; ;valueToCheck++) {
    if (markedNotPrimeMap.has(valueToCheck)) {
      markedNotPrimeMap.get(valueToCheck).forEach(prime => {
        const nextMultipleOfPrime = prime + valueToCheck
        if (markedNotPrimeMap.has(nextMultipleOfPrime)) {
          markedNotPrimeMap.get(nextMultipleOfPrime).push(prime)
        }
        else {
          markedNotPrimeMap.set(nextMultipleOfPrime, [prime])
        }
      })
      markedNotPrimeMap.delete(valueToCheck)
    }
    else {
      markedNotPrimeMap.set(valueToCheck ** 2, [valueToCheck])
      yield valueToCheck
    }
  }
}

const getPrimeFactorsOfEach = (nums = []) => {
  if (!nums.every(num => Number.isInteger(num) && num > 1)) {
    throw new Error('Invalid inputs to getPrimeFactorsOfEach, every item in array should be positive integer greater than 1')
  }

  const generator = generatePrimes()
  const currNums = nums.slice()
  const primes = [...Array(nums.length)].map(() => [])

  while (currNums.some(num => num > 1)) {
    const prime = generator.next().value

    for (let [i, currNum] of currNums.entries()) {
      while (currNum % prime === 0) {
        primes[i].push(prime)
        currNum = currNum / prime
      }
      currNums[i] = currNum
    }
  }

  return primes
}

const getLeastCommonMultiple = (nums = []) => {
  const primeFactors = getPrimeFactorsOfEach(nums)
  const counts = {}

  for (const primes of primeFactors) {
    let [currNum, count] = [0, 0]

    for (const prime of primes) {
      if (currNum !== prime) {
        currNum = prime
        count = 1
      }
      else count++

      counts[currNum] = Math.max(counts[currNum] || 0, count)
    }
  }

  return Object.entries(counts).reduce((prod, [prime, count]) => {
    return prod * (prime ** count)
  }, 1)
}

module.exports = {
  generateArrayOfPermutations,
  generateUniqueValueArrayOfPermutations,
  generatePermutationsForInjections,
  generatePrimes,
  getPrimeFactorsOfEach,
  getLeastCommonMultiple,
}
