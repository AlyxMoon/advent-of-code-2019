const { SoftwareAmplifierControl } = require('@lib/programs/SoftwareAmplifierControl')
const { IntcodeComputer, IntcodeProgramMode } = require('@lib/programs/IntcodeComputer')

describe('Amplifier Control Software', () => {
  it('Can be created and set inputs without blowing up', () => {
    expect(() => { return new SoftwareAmplifierControl() }).not.toThrow()
    expect(() => { return new SoftwareAmplifierControl().setAmplifierCount(5) }).not.toThrow()
    expect(() => { return new SoftwareAmplifierControl().setPhaseRange([0, 4]) }).not.toThrow()
    expect(() => { return new SoftwareAmplifierControl().setPhaseSequence([1]) }).not.toThrow()
  })

  it('Does not modify original program or mode of IntcodeComputer when run', () => {
    const computer = new IntcodeComputer()
      .setProgram([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0])
      .setMode(IntcodeProgramMode.STANDARD)
    computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseSequence: [0, 1, 2, 3, 4] },
    })

    expect(computer.getProgram()).toEqual([
      3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0,
    ])
  })

  it('Can be passed to IntcodeComputer with set sequence and return valid output 1', () => {
    const computer = new IntcodeComputer().setProgram([
      3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0,
    ])

    expect(computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseSequence: [4, 3, 2, 1, 0] },
    })).toBe(43210)
  })

  it('Can be passed to IntcodeComputer with set sequence and return valid output 2', () => {
    const computer = new IntcodeComputer().setProgram([
      3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5,
      23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0,
    ])

    expect(computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseSequence: [0, 1, 2, 3, 4] },
    })).toBe(54321)
  })

  it('Can be passed to IntcodeComputer with set sequence and return valid output 3', () => {
    const computer = new IntcodeComputer().setProgram([
      3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002,
      33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0,
    ])

    expect(computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseSequence: [1, 0, 4, 3, 2] },
    })).toBe(65210)
  })

  it('Gets correct max signal with program 1', () => {
    const computer = new IntcodeComputer().setProgram([
      3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0,
    ])

    expect(computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseRange: [0, 4] },
    })).toBe(43210)
  })

  it('Gets correct max signal with program 2', () => {
    const computer = new IntcodeComputer().setProgram([
      3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5,
      23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0,
    ])

    expect(computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseRange: [0, 4] },
    })).toBe(54321)
  })

  it('Gets correct max signal with program 3', () => {
    const computer = new IntcodeComputer().setProgram([
      3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002,
      33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0,
    ])

    expect(computer.run({
      software: SoftwareAmplifierControl,
      softwareArgs: { amplifierCount: 5, phaseRange: [0, 4] },
    })).toBe(65210)
  })
})
