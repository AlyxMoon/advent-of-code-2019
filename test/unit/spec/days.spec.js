const { join } = require('path')
const { run: day4 } = require('@scripts/day4')
const { run: day5part2 } = require('@scripts/day5_part2')
const { run: day6 } = require('@scripts/day6')

describe('Solutions remain consistent', () => {
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

  it('Day 6 (Part 1)', async () => {
    expect(await day6({
      inputPath: join(__dirname, '../../../inputs/day6.txt'),
      part: 1,
    })).toEqual(160040)
  })
})
