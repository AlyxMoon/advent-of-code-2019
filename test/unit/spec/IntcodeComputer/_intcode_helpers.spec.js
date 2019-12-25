
const {
  COMMANDS,
  MODES,
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

    it('correctly extends array when provided index is greater than length', () => {
      const originalArray = [1, 2, 3, 4, 5]
      fillMemoryToAddress(originalArray, 10)
      expect(originalArray.length).toBe(11)
    })

    it('does not mutate array if index is not greater than length', () => {
      const originalArray = [1, 2, 3, 4, 5]
      fillMemoryToAddress(originalArray, 3)
      expect(originalArray.length).toBe(5)

      fillMemoryToAddress(originalArray, 4)
      expect(originalArray.length).toBe(5)
    })
  })

  describe('parseInstruction', () => {
    it('throws error on invalid input', () => {
      expect(() => { parseInstruction(0) }).toThrow()
      expect(() => { parseInstruction(-10) }).toThrow()
      expect(() => { parseInstruction('0') }).toThrow()
      expect(() => { parseInstruction({}) }).toThrow()
      expect(() => { parseInstruction([]) }).toThrow()
      expect(() => { parseInstruction() }).toThrow()
    })

    it('throws error if opcode is not recognized', () => {
      expect(() => { parseInstruction(80) }).toThrow()
      expect(() => { parseInstruction(1080) }).toThrow()
    })

    it('throws error if mode is not recognized', () => {
      expect(() => { parseInstruction(301) }).toThrow()
      expect(() => { parseInstruction(5101) }).toThrow()
      expect(() => { parseInstruction(41101) }).toThrow()
    })

    it('gets correct opcode from input', () => {
      expect(parseInstruction(1).opcode).toBe(COMMANDS.ADD)
      expect(parseInstruction(2).opcode).toBe(COMMANDS.MULT)
      expect(parseInstruction(3).opcode).toBe(COMMANDS.READ)
      expect(parseInstruction(4).opcode).toBe(COMMANDS.WRITE)
      expect(parseInstruction(5).opcode).toBe(COMMANDS.JUMP_T)
      expect(parseInstruction(6).opcode).toBe(COMMANDS.JUMP_F)
      expect(parseInstruction(7).opcode).toBe(COMMANDS.LESS_THAN)
      expect(parseInstruction(8).opcode).toBe(COMMANDS.EQUAL_TO)
      expect(parseInstruction(9).opcode).toBe(COMMANDS.REL_OFFSET)
      expect(parseInstruction(99).opcode).toBe(COMMANDS.BREAK)
    })

    it('gets correct modes from input', () => {
      expect(parseInstruction(1).modes).toEqual([MODES.POSITION, MODES.POSITION, MODES.POSITION])
      expect(parseInstruction(101).modes).toEqual([MODES.IMMEDIATE, MODES.POSITION, MODES.POSITION])
      expect(parseInstruction(201).modes).toEqual([MODES.RELATIVE, MODES.POSITION, MODES.POSITION])

      expect(parseInstruction(1001).modes).toEqual([MODES.POSITION, MODES.IMMEDIATE, MODES.POSITION])
      expect(parseInstruction(2001).modes).toEqual([MODES.POSITION, MODES.RELATIVE, MODES.POSITION])
      expect(parseInstruction(2101).modes).toEqual([MODES.IMMEDIATE, MODES.RELATIVE, MODES.POSITION])

      expect(parseInstruction(11001).modes).toEqual([MODES.POSITION, MODES.IMMEDIATE, MODES.IMMEDIATE])
      expect(parseInstruction(22001).modes).toEqual([MODES.POSITION, MODES.RELATIVE, MODES.RELATIVE])
      expect(parseInstruction(22101).modes).toEqual([MODES.IMMEDIATE, MODES.RELATIVE, MODES.RELATIVE])
    })
  })
})
