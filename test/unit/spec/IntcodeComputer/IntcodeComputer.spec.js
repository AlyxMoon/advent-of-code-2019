const { IntcodeComputer } = require('@lib/programs/IntcodeComputer')

describe('Intcode Computer', () => {
  it('works with opcode 5 and 6 (jump-if-true/jump-if-false)', () => {
    const computer = new IntcodeComputer()

    expect(computer.createAndRunProcess({
      program: [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
      inputs: [0],
    }).writeOutputs).toEqual([0])
    expect(computer.createAndRunProcess({
      program: [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
      inputs: [1],
    }).writeOutputs).toEqual([1])
    expect(computer.createAndRunProcess({
      program: [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
      inputs: [-5],
    }).writeOutputs).toEqual([1])

    expect(computer.createAndRunProcess({
      program: [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1],
      inputs: [0],
    }).writeOutputs).toEqual([0])
    expect(computer.createAndRunProcess({
      program: [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1],
      inputs: [1],
    }).writeOutputs).toEqual([1])
    expect(computer.createAndRunProcess({
      program: [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1],
      inputs: [-5],
    }).writeOutputs).toEqual([1])
  })

  it('works with opcode 7 (less-than)', () => {
    const computer = new IntcodeComputer()

    expect(computer.createAndRunProcess({
      program: [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8],
      inputs: [1],
    }).writeOutputs).toEqual([1])
    expect(computer.createAndRunProcess({
      program: [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8],
      inputs: [8],
    }).writeOutputs).toEqual([0])

    expect(computer.createAndRunProcess({
      program: [3, 3, 1107, -1, 8, 3, 4, 3, 99],
      inputs: [1],
    }).writeOutputs).toEqual([1])
    expect(computer.createAndRunProcess({
      program: [3, 3, 1107, -1, 8, 3, 4, 3, 99],
      inputs: [8],
    }).writeOutputs).toEqual([0])
  })

  it('works with opcode 8 (equals)', () => {
    const computer = new IntcodeComputer()

    expect(computer.createAndRunProcess({
      program: [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8],
      inputs: [1],
    }).writeOutputs).toEqual([0])
    expect(computer.createAndRunProcess({
      program: [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8],
      inputs: [8],
    }).writeOutputs).toEqual([1])

    expect(computer.createAndRunProcess({
      program: [3, 3, 1108, -1, 8, 3, 4, 3, 99],
      inputs: [10],
    }).writeOutputs).toEqual([0])
    expect(computer.createAndRunProcess({
      program: [3, 3, 1108, -1, 8, 3, 4, 3, 99],
      inputs: [8],
    }).writeOutputs).toEqual([1])
  })

  it('works with opcode 9 (adjust relative base)', () => {

  })

  it('correctly makes a copy in write output with specific program', () => {
    const computer = new IntcodeComputer()
    const processState = computer.createAndRunProcess({
      program: [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99],
    })

    expect(processState.writeOutputs).toEqual([
      109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99,
    ])
  })

  it('works with large numbers', () => {
    const computer = new IntcodeComputer()
    const processState1 = computer.createAndRunProcess({
      program: [1102, 34915192, 34915192, 7, 4, 7, 99, 0],
    })
    const processState2 = computer.createAndRunProcess({
      program: [104, 1125899906842624, 99],
    })

    expect(processState1.writeOutputs).toEqual([1219070632396864])
    expect(processState2.writeOutputs).toEqual([1125899906842624])
  })

  it('test cases from reddit', () => {
    const computer = new IntcodeComputer()

    expect(computer.createAndRunProcess({
      program: [109, -1, 4, 1, 99],
    }).writeOutputs).toEqual([-1])

    expect(computer.createAndRunProcess({
      program: [109, -1, 104, 1, 99],
    }).writeOutputs).toEqual([1])

    expect(computer.createAndRunProcess({
      program: [109, -1, 204, 1, 99],
    }).writeOutputs).toEqual([109])

    expect(computer.createAndRunProcess({
      program: [109, 1, 9, 2, 204, -6, 99],
    }).writeOutputs).toEqual([204])

    expect(computer.createAndRunProcess({
      program: [109, 1, 109, 9, 204, -6, 99],
    }).writeOutputs).toEqual([204])

    expect(computer.createAndRunProcess({
      program: [109, 1, 209, -1, 204, -106, 99],
    }).writeOutputs).toEqual([204])

    expect(computer.createAndRunProcess({
      program: [109, 1, 3, 3, 204, 2, 99], inputs: [169],
    }).writeOutputs).toEqual([169])

    expect(computer.createAndRunProcess({
      program: [109, 1, 203, 2, 204, 2, 99], inputs: [291],
    }).writeOutputs).toEqual([291])
  })
})
