const { oreRequiredForFuel, parseInput } = require('@lib/programs/standalone/OreProcessingCalculator')

describe('OreProcessingCalculator', () => {
  const input1 = `
    10 ORE => 10 A
    1 ORE => 1 B
    7 A, 1 B => 1 C
    7 A, 1 C => 1 D
    7 A, 1 D => 1 E
    7 A, 1 E => 1 FUEL
  `
  const input2 = `
    9 ORE => 2 A
    8 ORE => 3 B
    7 ORE => 5 C
    3 A, 4 B => 1 AB
    5 B, 7 C => 1 BC
    4 C, 1 A => 1 CA
    2 AB, 3 BC, 4 CA => 1 FUEL
  `

  describe('parseInput', () => {
    it('correctly parses input 1', () => {
      expect(parseInput(input1)).toEqual({
        FUEL: { out: 1, in: { A: 7, E: 1 } },
        A: { out: 10, in: { ORE: 10 } },
        B: { out: 1, in: { ORE: 1 } },
        C: { out: 1, in: { A: 7, B: 1 } },
        D: { out: 1, in: { A: 7, C: 1 } },
        E: { out: 1, in: { A: 7, D: 1 } },
      })
    })

    it('correctly parses input 2', () => {
      expect(parseInput(input2)).toEqual({
        FUEL: { out: 1, in: { AB: 2, BC: 3, CA: 4 } },
        CA: { out: 1, in: { A: 1, C: 4 } },
        BC: { out: 1, in: { B: 5, C: 7 } },
        AB: { out: 1, in: { A: 3, B: 4 } },
        A: { out: 2, in: { ORE: 9 } },
        B: { out: 3, in: { ORE: 8 } },
        C: { out: 5, in: { ORE: 7 } },
      })
    })
  })

  describe('oreRequiredForFuel', () => {
    it('does not edit original input', () => {
      const unusedInput = parseInput(input1)
      const input = parseInput(input1)

      oreRequiredForFuel(input)
      expect(input).toEqual(unusedInput)
    })

    it('correctly gives result input 1', () => {
      expect(oreRequiredForFuel(parseInput(input1))).toBe(31)
    })

    it('correctly gives result input 2', () => {
      expect(oreRequiredForFuel(parseInput(input2))).toBe(165)
    })
  })
})
