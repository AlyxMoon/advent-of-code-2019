const { join } = require('path')
const { run: day1 } = require('@scripts/day1')
const { run: day2 } = require('@scripts/day2')
const { run: day3 } = require('@scripts/day3')
const { run: day4 } = require('@scripts/day4')
const { run: day5 } = require('@scripts/day5')
const { run: day6 } = require('@scripts/day6')
const { run: day7 } = require('@scripts/day7')
const { run: day8 } = require('@scripts/day8')

describe('Solutions remain consistent', () => {
  it('Day 1', async () => {
    const inputPath = join(__dirname, '../../../inputs/day1.txt')
    expect(await day1({ inputPath, part: 1 })).toBe(3414791)
    expect(await day1({ inputPath, part: 2 })).toBe(5119312)
  })

  it('Day 2', async () => {
    const inputPath = join(__dirname, '../../../inputs/day2.txt')
    expect(await day2({ inputPath, part: 1 })).toBe(3562672)
    expect(await day2({ inputPath, part: 2 })).toBe(8250)
  })

  it('Day 3', async () => {
    const inputPath = join(__dirname, '../../../inputs/day3.txt')
    expect(await day3({ inputPath, part: 1 })).toBe(248)
    expect(await day3({ inputPath, part: 2 })).toBe(28580)
  })

  it('Day 4', async () => {
    const inputPath = join(__dirname, '../../../inputs/day4.txt')
    expect(await day4({ inputPath, part: 1 })).toBe(1610)
    expect(await day4({ inputPath, part: 2 })).toBe(1104)
  })

  it('Day 5', async () => {
    const inputPath = join(__dirname, '../../../inputs/day5.txt')
    expect(await day5({ inputPath, part: 1 })).toBe(4601506)
    expect(await day5({ inputPath, part: 2 })).toBe(5525561)
  })

  it('Day 6', async () => {
    const inputPath = join(__dirname, '../../../inputs/day6.txt')
    expect(await day6({ inputPath, part: 1 })).toBe(160040)
    expect(await day6({ inputPath, part: 2 })).toBe(373)
  })

  it('Day 7', async () => {
    const inputPath = join(__dirname, '../../../inputs/day7.txt')
    expect(await day7({ inputPath, part: 1 })).toBe(45730)
    expect(await day7({ inputPath, part: 2 })).toBe(5406484)
  })

  it('Day 8', async () => {
    const inputPath = join(__dirname, '../../../inputs/day8.txt')
    expect(await day8({ inputPath, part: 1 })).toBe(1548)
    // TODO currently don't feel like filling out the output string or something else to test. Fix at some point I guess.
    // expect(await day8({ inputPath, part: 2 })).toBe()
  })
})
