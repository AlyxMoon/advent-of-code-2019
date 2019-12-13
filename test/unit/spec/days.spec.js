const { join } = require('path')
const { run: day5part2 } = require('@scripts/day5_part2')

describe('Solutions remain consistent', () => {
  it('Day 5 (Part 2)', async () => {
    const inputPath = join(__dirname, '../../../inputs/day5.txt')
    expect(await day5part2({ inputPath })).toEqual([5525561])
  })
})
