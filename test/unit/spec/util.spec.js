const {
  generateArrayOfPermutations,
  generateUniqueValueArrayOfPermutations,
  generatePrimes,
  getPrimeFactorsOfEach,
  getLeastCommonMultiple,
} = require('@lib/util')

describe('generateArrayOfPermutations', () => {
  it('should generate empty array with length 0', () => {
    expect(generateArrayOfPermutations(0, 1, 2)).toEqual([])
  })

  it('should return empty array if min is greater than max', () => {
    expect(generateArrayOfPermutations(1, 3, 2)).toEqual([])
  })

  it('should return correct permutations with length of 1', () => {
    expect(generateArrayOfPermutations(1, 1, 2)).toEqual([[1], [2]])
    expect(generateArrayOfPermutations(1, 1, 3)).toEqual([[1], [2], [3]])
  })

  it('should return correct permutations with length of 2', () => {
    expect(generateArrayOfPermutations(2, 1, 2)).toEqual([
      [1, 1], [1, 2], [2, 1], [2, 2],
    ])
    expect(generateArrayOfPermutations(2, 1, 3)).toEqual([
      [1, 1], [1, 2], [1, 3],
      [2, 1], [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 3],
    ])
  })

  it('should return correct permutations with length of 3', () => {
    expect(generateArrayOfPermutations(3, 1, 2)).toEqual([
      [1, 1, 1], [1, 1, 2], [1, 2, 1], [1, 2, 2],
      [2, 1, 1], [2, 1, 2], [2, 2, 1], [2, 2, 2],
    ])
  })

  it('should return correct permutations with negative min and postive max', () => {
    expect(generateArrayOfPermutations(2, -1, 1)).toEqual([
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 0], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ])
  })
})

describe('generateUniqueValueArrayOfPermutations', () => {
  it('should generate empty array with length 0', () => {
    expect(generateUniqueValueArrayOfPermutations(0, 1, 2)).toEqual([])
  })

  it('should return empty array if min is greater than max', () => {
    expect(generateUniqueValueArrayOfPermutations(1, 3, 2)).toEqual([])
  })

  it('should return correct permutations with length of 1', () => {
    expect(generateUniqueValueArrayOfPermutations(1, 1, 2)).toEqual([[1], [2]])
    expect(generateUniqueValueArrayOfPermutations(1, 1, 3)).toEqual([[1], [2], [3]])
  })

  it('should return correct permutations with length of 2', () => {
    expect(generateUniqueValueArrayOfPermutations(2, 1, 2)).toEqual([
      [1, 2], [2, 1],
    ])
    expect(generateUniqueValueArrayOfPermutations(2, 1, 3)).toEqual([
      [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2],
    ])
  })

  it('should return correct permutations with length of 3', () => {
    expect(generateUniqueValueArrayOfPermutations(3, 1, 2)).toEqual([])

    expect(generateUniqueValueArrayOfPermutations(3, 1, 4)).toEqual([
      [1, 2, 3], [1, 2, 4], [1, 3, 2], [1, 3, 4], [1, 4, 2], [1, 4, 3],
      [2, 1, 3], [2, 1, 4], [2, 3, 1], [2, 3, 4], [2, 4, 1], [2, 4, 3],
      [3, 1, 2], [3, 1, 4], [3, 2, 1], [3, 2, 4], [3, 4, 1], [3, 4, 2],
      [4, 1, 2], [4, 1, 3], [4, 2, 1], [4, 2, 3], [4, 3, 1], [4, 3, 2],
    ])
  })
})

describe('generatePrimes', () => {
  it('correctly generates first ten primes', () => {
    const generator = generatePrimes()
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

    for (let i = 0; i < 10; i++) {
      expect(generator.next().value).toBe(primes[i])
    }
  })

  it('different instances do not affect each other', () => {
    const generator1 = generatePrimes()
    const generator2 = generatePrimes()

    let val1, val2
    for (let i = 0; i < 3; i++) val1 = generator1.next().value
    for (let i = 0; i < 9; i++) val2 = generator2.next().value

    expect(val1).toBe(5)
    expect(val2).toBe(23)
  })
})

describe('getPrimeFactorsOfEach', () => {
  it('correctly gets prime factors of numbers passed in', () => {
    expect(getPrimeFactorsOfEach([4])).toEqual([[2, 2]])
    expect(getPrimeFactorsOfEach([2, 3, 6])).toEqual([[2], [3], [2, 3]])
    expect(getPrimeFactorsOfEach([10, 16, 17])).toEqual([[2, 5], [2, 2, 2, 2], [17]])
  })

  it('does not mutate original input', () => {
    const input = [10, 16, 17]
    expect(getPrimeFactorsOfEach(input)).toEqual([[2, 5], [2, 2, 2, 2], [17]])
    expect(input).toEqual([10, 16, 17])
  })
})

describe('getLeastCommonMultiple', () => {
  it('gets correct LCM of two numbers', () => {
    expect(getLeastCommonMultiple([2, 3])).toBe(6)
    expect(getLeastCommonMultiple([10, 14])).toBe(70)
    expect(getLeastCommonMultiple([59, 76])).toBe(4484)
  })

  it('gets correct LCM of three numbers', () => {
    expect(getLeastCommonMultiple([2, 3, 7])).toBe(42)
    expect(getLeastCommonMultiple([10, 11, 15])).toBe(330)
    expect(getLeastCommonMultiple([8, 14, 25])).toBe(1400)
  })

  it('does not mutate original input', () => {
    const input = [10, 11, 15]
    expect(getLeastCommonMultiple(input)).toBe(330)
    expect(input).toEqual([10, 11, 15])
  })
})
