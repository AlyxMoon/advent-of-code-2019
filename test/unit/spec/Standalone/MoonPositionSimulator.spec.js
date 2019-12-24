const {
  findFirstRepeatVector,
} = require('@lib/programs/standalone/MoonPositionSimulator')

describe('findFirstRepeatVector()', () => {
  it('gives expected result for provided test cases', () => {
    const input1 = [
      { pos: { x: -1, y: 0, z: 2 } },
      { pos: { x: 2, y: -10, z: -7 } },
      { pos: { x: 4, y: -8, z: 8 } },
      { pos: { x: 3, y: 5, z: -1 } },
    ]
    const input2 = [
      { pos: { x: -8, y: -10, z: 0 } },
      { pos: { x: 5, y: 5, z: 10 } },
      { pos: { x: 2, y: -7, z: 3 } },
      { pos: { x: 9, y: -8, z: -3 } },
    ]
    expect(findFirstRepeatVector(input1)).toBe(2772)
    expect(findFirstRepeatVector(input2)).toBe(4686774924)
  })
})
