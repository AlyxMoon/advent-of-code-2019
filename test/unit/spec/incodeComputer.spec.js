const { IntcodeComputer, IntcodeProgramMode } = require('@lib/intcodeComputer')

describe('Intcode Computer', () => {
  it('works with opcode 5 and 6 (jump-if-true/jump-if-false)', () => {
    const computer = new IntcodeComputer()
      .setMode(IntcodeProgramMode.DIAGNOSTIC)
      .setProgram([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9])

    expect(computer.setUserInput([0]).run()).toEqual([0])
    expect(computer.setUserInput([1]).run()).toEqual([1])
    expect(computer.setUserInput([-5]).run()).toEqual([1])

    computer.setProgram([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1])
    expect(computer.setUserInput([0]).run()).toEqual([0])
    expect(computer.setUserInput([1]).run()).toEqual([1])
    expect(computer.setUserInput([-5]).run()).toEqual([1])
  })

  it('works with opcode 7 (less-than)', () => {
    const computer = new IntcodeComputer()
      .setMode(IntcodeProgramMode.DIAGNOSTIC)
      .setProgram([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8])

    expect(computer.setUserInput([1]).run()).toEqual([1])
    expect(computer.setUserInput([8]).run()).toEqual([0])

    computer.setProgram([3, 3, 1107, -1, 8, 3, 4, 3, 99])
    expect(computer.setUserInput([1]).run()).toEqual([1])
    expect(computer.setUserInput([8]).run()).toEqual([0])
  })

  it('works with opcode 8 (equals)', () => {
    const computer = new IntcodeComputer()
      .setMode(IntcodeProgramMode.DIAGNOSTIC)
      .setProgram([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8])

    expect(computer.setUserInput([1]).run()).toEqual([0])
    expect(computer.setUserInput([8]).run()).toEqual([1])

    computer.setProgram([3, 3, 1108, -1, 8, 3, 4, 3, 99])
    expect(computer.setUserInput([10]).run()).toEqual([0])
    expect(computer.setUserInput([8]).run()).toEqual([1])
  })
})
