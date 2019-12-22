const { HullPainterRobot } = require('@lib/programs/intcodeHardware/HullPainterRobot')

describe('Hull Painter Robot Hardware', () => {
  const robot = new HullPainterRobot()

  it('works with test case 1', () => {
    const input = [
      3, 1, 104, 1, 104, 0,
      3, 1, 104, 0, 104, 0,
      3, 1, 104, 1, 104, 0,
      3, 1, 104, 1, 104, 0,
      3, 1, 104, 0, 104, 1,
      3, 1, 104, 1, 104, 0,
      3, 1, 104, 1, 104, 0,
      99,
    ]

    expect(robot.applyProgram(input).run().getPainted()).toBe(6)
  })
})
