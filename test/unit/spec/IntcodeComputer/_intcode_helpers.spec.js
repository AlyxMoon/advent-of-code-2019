
const {
  fillMemoryToAddress,
  parseInstruction,
} = require('@lib/programs/_intcode_helpers.js')

describe('Intcode Computer helper methods', () => {
  describe('fillMemoryToAddress', () => {
    it('throws error with invalid inputs', () => {
      // Invalid first argument
      expect(() => { return fillMemoryToAddress(null, 10, 0) }).toThrow()
      expect(() => { return fillMemoryToAddress(10, 10, 0) }).toThrow()
      expect(() => { return fillMemoryToAddress('string', 10, 0) }).toThrow()
      expect(() => { return fillMemoryToAddress({ obj: 42 }, 10, 0) }).toThrow()

      // Invalid second argument
      expect(() => { return fillMemoryToAddress([], null, 0) }).toThrow()
      expect(() => { return fillMemoryToAddress([], '10', 0) }).toThrow()
      expect(() => { return fillMemoryToAddress([], 9.45, 0) }).toThrow()

      // Invalid third argument
      expect(() => { return fillMemoryToAddress([], 10, null) }).toThrow()
      expect(() => { return fillMemoryToAddress([], 10, '10') }).toThrow()
      expect(() => { return fillMemoryToAddress([], 10, 1.423) }).toThrow()
    })
  })
})
