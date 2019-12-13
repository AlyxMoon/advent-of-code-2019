
const generatePermutationsForInjections = (arr, i = 0) => {
  const currentPermutations = [...Array(arr[i].max - arr[i].min + 1)].map((_, x) => [arr[i].address, x + arr[i].min])

  const futurePermutations = i < arr.length - 1
    ? generatePermutationsForInjections(arr, i + 1)
    : []

  return futurePermutations.length === 0
    ? currentPermutations.map(p => [p])
    : currentPermutations.reduce((combined, p) => {
      return futurePermutations.reduce((combinedF, f) => [...combinedF, [p, ...f]], combined)
    }, [])
}

export const IntcodeProgramMode = {
  STANDARD: 1,
  INJECT_AND_FIND: 2,
  DIAGNOSTIC: 3,
}

export class IntcodeComputer {
  constructor () {
    this.clearCodeInjection()
    this.clearDesiredFindValue()
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
    this.codeInjections = []
    return this
  }

  setCodeInjection (injections = []) {
    if (
      injections.length === 0 &&
      !injections.every(injection => injection.length === 2 && injection.every(Number.isInteger))
    ) {
      throw new Error(`Invalid injections applied on IncodeComputer, should be in form [[address, value], ...]: ${injections}`)
    }

    this.codeInjections = injections.map(injection => injection.slice())
    return this
  }

  setCodeInjectionRange (injections = []) {
    if (
      injections.length === 0 &&
      !injections.every(injection => {
        return (
          'address' in injection && injection.address >= 0 &&
          'min' in injection && Number.isInteger(injection.min) &&
          'max' in injection && Number.isInteger(injection.max) &&
          injection.min <= injection.max
        )
      })
    ) {
      throw new Error(`Invalid injections applied on IncodeComputer, should be in form [[address, value], ...]: ${injections}`)
    }

    this.codeInjectionRange = injections.map(injection => Object.assign({}, injection))
    return this
  }

  clearDesiredFindValue () { this.desiredFindValue = 0 }
  setDesiredFindValue (value = 0) {
    if (!value) throw new Error(`Invalid find value passed to Intcode Computer, needs to be a valid positive integer: ${value}`)

    this.desiredFindValue = value
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

    const runningProgram = this._injectCodeIntoProgram(this.program, this.codeInjections)

    switch (this.mode) {
      case IntcodeProgramMode.STANDARD: return this._runStandardMode(runningProgram)
      case IntcodeProgramMode.INJECT_AND_FIND: return this._runInjectAndFindMode(runningProgram)
      case IntcodeProgramMode.DIAGNOSTIC: return this._runDiagnosticMode(runningProgram)
      default: throw new Error('Attempted to run IntcodeComputer with no valid mode set')
    }
  }

  _injectCodeIntoProgram (program = [], injections = []) {
    const retval = program.slice()
    injections.forEach(([address, value]) => { retval[address] = value })
    return retval
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

  _runInjectAndFindMode (program = []) {
    if (!this.desiredFindValue) throw new Error('Cannot run in INJECT_AND_FIND mode without valid desiredFindValue')

    const possibleInjections = generatePermutationsForInjections(this.codeInjectionRange)

    const validIndex = possibleInjections.findIndex(injection => {
      try {
        const programOutput = this._runStandardMode(this._injectCodeIntoProgram(this.program.slice(), injection))
        return programOutput[0] === this.desiredFindValue
      } catch (e) {
        // I don't actually care about errors here
      }
    })

    if (validIndex >= 0) {
      return possibleInjections[validIndex].map((injection) => ({ address: injection[0], value: injection[1] }))
    } else {
      return null
    }
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
