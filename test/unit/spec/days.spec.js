const { join } = require('path')
const { run: day1 } = require('@scripts/day1')
const { run: day2 } = require('@scripts/day2')
const { run: day3 } = require('@scripts/day3')
const { run: day4 } = require('@scripts/day4')
const { run: day5 } = require('@scripts/day5')
const { run: day6 } = require('@scripts/day6')
const { run: day7 } = require('@scripts/day7')
const { run: day8 } = require('@scripts/day8')
const { run: day9 } = require('@scripts/day9')
const { run: day10 } = require('@scripts/day10')
const { run: day12 } = require('@scripts/day12')
const { run: day13 } = require('@scripts/day13')
const { run: day14 } = require('@scripts/day14')
const { run: day15 } = require('@scripts/day15')
const { run: day16 } = require('@scripts/day16')

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

  it('Day 9', async () => {
    const inputPath = join(__dirname, '../../../inputs/day9.txt')
    expect(await day9({ inputPath, part: 1 })).toBe(2171728567)
    expect(await day9({ inputPath, part: 2 })).toBe(49815)
  })

  it('Day 10', async () => {
    const inputPath = join(__dirname, '../../../inputs/day10.txt')
    expect(await day10({ inputPath, part: 1 })).toBe(247)
    expect(await day10({ inputPath, part: 2 })).toBe(1919)
  })

  it('Day 12', async () => {
    const inputPath = join(__dirname, '../../../inputs/day12.txt')
    expect(await day12({ inputPath, part: 1 })).toBe(8287)
    expect(await day12({ inputPath, part: 2 })).toBe(528250271633772)
  })

  it('Day 13', async () => {
    const inputPath = join(__dirname, '../../../inputs/day13.txt')
    expect(await day13({ inputPath, part: 1 })).toBe(251)
    expect(await day13({ inputPath, part: 2 })).toBe(12779)
  })

  it('Day 14', async () => {
    const inputPath = join(__dirname, '../../../inputs/day14.txt')
    expect(await day14({ inputPath, part: 1 })).toBe(751038)
    expect(await day14({ inputPath, part: 2 })).toBe(2074843)
  })

  it('Day 15', async () => {
    const inputPath = join(__dirname, '../../../inputs/day15.txt')
    expect(await day15({ inputPath, part: 1, showInProgress: false })).toBe(214)
    expect(await day15({ inputPath, part: 2, showInProgress: false, getFullMap: true, getOxygenTime: true })).toBe(344)
  })

  it('Day 16', async () => {
    const inputPath = join(__dirname, '../../../inputs/day16.txt')
    expect(await day16({ inputPath, part: 1 })).toBe('53296082')
    expect(await day16()).toBe('43310035')
  })
})
