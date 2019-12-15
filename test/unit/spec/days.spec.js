const { join } = require('path')
const { run: day1 } = require('@scripts/day1')
const { run: day4 } = require('@scripts/day4')
const { run: day5part2 } = require('@scripts/day5_part2')
const { run: day6 } = require('@scripts/day6')

describe('Solutions remain consistent', () => {
  it('Day 1', async () => {
    const inputPath = join(__dirname, '../../../inputs/day1.txt')
    expect(await day1({ inputPath, part: 1 })).toBe(3414791)
    expect(await day1({ inputPath, part: 2 })).toBe(5119312)
  })

  it('Day 4 (Part 1)', async () => {
    expect(await day4({
      inputPath: join(__dirname, '../../../inputs/day4.txt'),
      part: 1,
    })).toBe(1610)
  })

  it('Day 4 (Part 2)', async () => {
    expect(await day4({
      inputPath: join(__dirname, '../../../inputs/day4.txt'),
      part: 2,
    })).toBe(1104)
  })

  it('Day 5 (Part 2)', async () => {
    const inputPath = join(__dirname, '../../../inputs/day5.txt')
    expect(await day5part2({ inputPath })).toEqual([5525561])
  })

  it('Day 6)', async () => {
    const inputPath = join(__dirname, '../../../inputs/day6.txt')
    expect(await day6({ inputPath, part: 1 })).toEqual(160040)
    expect(await day6({ inputPath, part: 2 })).toEqual(373)
  })
})
