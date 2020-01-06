const { findMaxPossibleFuel, oreRequiredForFuel, parseInput } = require('@lib/programs/standalone/OreProcessingCalculator')

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

  const input3 = `
    157 ORE => 5 NZVS
    165 ORE => 6 DCFZ
    44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
    12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
    179 ORE => 7 PSHF
    177 ORE => 5 HKGWZ
    7 DCFZ, 7 PSHF => 2 XJWVT
    165 ORE => 2 GPVTF
    3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT
  `
  const input4 = `
    2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
    17 NVRVD, 3 JNWZP => 8 VPVL
    53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
    22 VJHF, 37 MNCFX => 5 FWMGM
    139 ORE => 4 NVRVD
    144 ORE => 7 JNWZP
    5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
    5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
    145 ORE => 6 MNCFX
    1 NVRVD => 8 CXFTF
    1 VJHF, 6 MNCFX => 4 RFSQX
    176 ORE => 6 VJHF
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

  describe('findMaxPossibleFuel', () => {
    it('correctly gives result', () => {
      expect(findMaxPossibleFuel(parseInput(input3), 1000000000000)).toBe(82892753)
      expect(findMaxPossibleFuel(parseInput(input4), 1000000000000)).toBe(5586022)
    })
  })
})
