
export const IntcodeProgramMode = {
  STANDARD: 1,
  DIAGNOSTIC: 2,
}

export class IntcodeComputer {
  constructor () {
    this.clearCodeInjection()
    this.clearMode()
    this.сlearProgram()
  }

  clearUserInput () {
    this.inputs = []
    return this
  }

  setUserInput (inputs = []) {
    this.inputs = inputs
    return this
  }

  clearCodeInjection () {
    this.codeInjection = []
    return this
  }

  setCodeInjection (injections = []) {
    if (
      injections.length === 0 &&
      !injections.every(injection => injection.length === 2 && injection.every(Number.isInteger))
    ) {
      throw new Error(`Invalid injections applied on IncodeComputer, should be in form [[address, value], ...]: ${injections}`)
    }

    this.codeInjection = injections.map(injection => injection.slice())
    return this
  }

  clearMode () {
    this.mode = 0
    return this
  }

  setMode (mode = IntcodeProgramMode.standard) {
    if (!Object.values(mode).every(m => m in IntcodeProgramMode)) {
      throw new Error(`Unrecognized mode set on IncodeComputer: ${mode}`)
    }

    this.mode = mode
    return this
  }

  сlearProgram () {
    this.program = []
    return this
  }

  setProgram (program = []) {
    if (program.length < 2 || !program.every(Number.isInteger)) {
      throw new Error(`Invalid program set on IncodeComputer, requires a minimum length of 2 and only integer values: ${program}`)
    }

    this.program = program.slice()
    return this
  }

  run () {
    if (!this.program || this.program.length === 0) throw new Error('Attempted to run IntcodeComputer with no valid program set')

    const runningProgram = this._injectCodeIntoProgram(this.program.slice())

    switch (this.mode) {
      case IntcodeProgramMode.STANDARD: return this._runStandardMode(runningProgram)
      case IntcodeProgramMode.DIAGNOSTIC: return this._runDiagnosticMode(runningProgram)
      default: throw new Error('Attempted to run IntcodeComputer with no valid mode set')
    }
  }

  _injectCodeIntoProgram (program = []) {
    this.codeInjection.forEach(([address, value]) => {
      program[address] = value
    })
    return program
  }

  _recieveUserInput (i) {
    return this.inputs[i]
  }

  _parseInstruction (instruction = 0) {
    return {
      opcode: instruction % 100,
      modes: [
        Math.floor(instruction / 100) % 10,
        Math.floor(instruction / 1000) % 10,
        Math.floor(instruction / 10000) % 10,
      ],
    }
  }

  _runStandardMode (program = []) {
    for (let i = 0, bound = program.length; i < bound; i += 4) {
      const opcode = program[i]
      const [valIndex1, valIndex2, outputIndex] = [program[i + 1], program[i + 2], program[i + 3]]

      if (opcode === 99) break
      switch (opcode) {
        case 1: program[outputIndex] = program[valIndex1] + program[valIndex2]; break
        case 2: program[outputIndex] = program[valIndex1] * program[valIndex2]; break
        default: throw new Error(`Unrecognized intcode opcode!: ${program[i]}`)
      }
    }

    return program
  }

  _runDiagnosticMode (program = []) {
    const diagnosticOutput = []
    let inputIndex = 0

    for (let i = 0, line = 1, bound = program.length; i < bound; i += 4, line += 1) {
      const { opcode, modes } = this._parseInstruction(program[i])

      const input1 = modes[0] ? program[i + 1] : program[program[i + 1]]
      const input2 = modes[1] ? program[i + 2] : program[program[i + 2]]
      const outputIndex = opcode > 2 ? program[i + 1] : program[i + 3]

      if (opcode === 99) break
      // Add
      else if (opcode === 1) program[outputIndex] = input1 + input2
      // Multiply
      else if (opcode === 2) program[outputIndex] = input1 * input2
      // Input
      else if (opcode === 3) program[outputIndex] = this._recieveUserInput(inputIndex++)
      // Output
      else if (opcode === 4) diagnosticOutput.push(program[outputIndex])

      else throw new Error(`Unrecognized intcode opcode!: ${opcode}`)

      i -= opcode > 2 ? 2 : 0
    }

    return diagnosticOutput
  }
}
