const {
  generateArrayOfPermutations,
  generateUniqueValueArrayOfPermutations,
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
