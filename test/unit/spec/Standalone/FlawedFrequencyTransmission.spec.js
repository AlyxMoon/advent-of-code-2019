const {
  parseInput,
  flawedFrequencyTransmission,
} = require('@lib/programs/standalone/FlawedFrequencyTransmission')

const input1 = '12345678'
const input2 = '80871224585914546619083218645595'

describe('FlawedFrequencyTransmission', () => {
  describe('parseInput', () => {
    it('correctly parses input', () => {
      expect(parseInput(input1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
      expect(parseInput(input2)).toEqual([
        8, 0, 8, 7, 1, 2, 2, 4, 5, 8, 5, 9, 1, 4, 5, 4,
        6, 6, 1, 9, 0, 8, 3, 2, 1, 8, 6, 4, 5, 5, 9, 5,
      ])
    })
  })

  describe('flawedFrequencyTransmission', () => {
    it('gives correct answer for inputs', () => {
      expect(flawedFrequencyTransmission(parseInput(input1), 4)).toEqual([0, 1, 0, 2, 9, 4, 9, 8])
      expect(flawedFrequencyTransmission(parseInput(input2))).toEqual([
        2, 4, 1, 7, 6, 1, 7, 6, 4, 8, 0, 9, 1, 9, 0, 4, 6, 1, 1, 4, 0, 3, 8, 7, 6, 3, 1, 9, 5, 5, 9, 5,
      ])
    })
  })
})
