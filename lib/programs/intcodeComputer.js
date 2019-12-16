
export const generatePermutationsForInjections = (arr, i = 0) => {
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
  EXIT_ON_OUTPUT: 4,
}

export class IntcodeComputer {
  constructor () {
    this.clearCodeInjection()
    this.clearDesiredFindValue()
    this.clearMode()
    this.сlearProgram()
    this.clearProgramStartIndex()
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
      throw new Error(`Invalid injections applied on IntcodeComputer, should be in form [[address, value], ...]: ${injections}`)
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
      throw new Error(`Invalid injections applied on IntcodeComputer, should be in form [[address, value], ...]: ${injections}`)
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

  getMode () { return this.mode }
  setMode (mode = IntcodeProgramMode.standard) {
    if (!Object.values(mode).every(m => m in IntcodeProgramMode)) {
      throw new Error(`Unrecognized mode set on IntcodeComputer: ${mode}`)
    }

    this.mode = mode
    return this
  }

  сlearProgram () {
    this.program = []
    return this
  }

  getProgram () { return this.program.slice() }
  setProgram (program = []) {
    if (program.length < 2 || !program.every(Number.isInteger)) {
      throw new Error(`Invalid program set on IntcodeComputer, requires a minimum length of 2 and only integer values: ${program}`)
    }

    this.program = program.slice()
    return this
  }

  clearProgramStartIndex () {
    this.programStartIndex = 0
    return this
  }

  getProgramStartIndex () { return this.programStartIndex }
  setProgramStartIndex (index = 0) {
    if (!Number.isInteger(index) || index < 0) {
      throw new Error(`Invalid value for start index provided to IntcodeComputer, needs to be a positive integer: ${index}`)
    }
    this.programStartIndex = index
    return this
  }

  run ({ software: Software, softwareArgs = {} } = {}) {
    if (!this.program || this.program.length === 0) throw new Error('Attempted to run IntcodeComputer with no valid program set')

    if (Software) {
      // Try to see if new can be called, i.e. is a class
      if (!Software.constructor) throw new Error('Invalid software passed that cannot be instantiated when running Intcode program')
      return new Software(softwareArgs).run(this)
    }

    const runningProgram = this._injectCodeIntoProgram(this.program, this.codeInjections)
    switch (this.mode) {
      case IntcodeProgramMode.STANDARD: return this._runStandard(runningProgram)
      case IntcodeProgramMode.INJECT_AND_FIND: return this._runInjectAndFindMode(runningProgram)
      case IntcodeProgramMode.DIAGNOSTIC: return this._runStandard(runningProgram, { diagnosticMode: true })
      case IntcodeProgramMode.EXIT_ON_OUTPUT: return this._runStandard(runningProgram, { exitOnOutput: true })
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
      parameters: [
        Math.floor(instruction / 100) % 10,
        Math.floor(instruction / 1000) % 10,
        Math.floor(instruction / 10000) % 10,
      ],
    }
  }

  _runStandard (program = [], {
    diagnosticMode = false,
    exitOnOutput = false,
  } = {}) {
    const diagnosticOutput = []

    let inputIndex = 0
    let i = this.programStartIndex || 0
    for (let line = 1, bound = program.length; i < bound; i += 4, line += 1) {
      const { opcode, parameters } = this._parseInstruction(program[i])

      const input1 = parameters[0] ? program[i + 1] : program[program[i + 1]]
      const input2 = parameters[1] ? program[i + 2] : program[program[i + 2]]
      const outputIndex = [3, 4].includes(opcode) ? program[i + 1] : program[i + 3]

      console.log('testing', i, opcode, parameters, input1, input2, outputIndex)
      if (opcode === 99) {
        i = -1
        break
      }
      // Add
      else if (opcode === 1) program[outputIndex] = input1 + input2
      // Multiply
      else if (opcode === 2) program[outputIndex] = input1 * input2
      // Input
      else if (opcode === 3) {
        program[outputIndex] = this._recieveUserInput(inputIndex++)
        i -= 2
      }
      // Output
      else if (opcode === 4) {
        diagnosticOutput.push(program[outputIndex])

        if (exitOnOutput) {
          i += 2
          break
        }

        i -= 2
      }
      // Jump if true
      else if (opcode === 5) {
        i = input1 ? input2 - 4 : i -= 1
      }
      // Jump if false
      else if (opcode === 6) {
        i = !input1 ? input2 - 4 : i -= 1
      }
      // Less than comparison
      else if (opcode === 7) {
        program[outputIndex] = input1 < input2 ? 1 : 0
      }
      // Equal to comparison
      else if (opcode === 8) {
        program[outputIndex] = input1 === input2 ? 1 : 0
      }

      else throw new Error(`Unrecognized intcode opcode!: ${opcode}`)
    }

    if (diagnosticMode) return diagnosticOutput
    if (exitOnOutput) return { output: diagnosticOutput[0], index: i, program }

    return program[0]
  }

  _runInjectAndFindMode (program = []) {
    if (!this.desiredFindValue) throw new Error('Cannot run in INJECT_AND_FIND mode without valid desiredFindValue')

    const possibleInjections = generatePermutationsForInjections(this.codeInjectionRange)

    const validIndex = possibleInjections.findIndex(injection => {
      try {
        const programOutput = this._runStandardMode(this._injectCodeIntoProgram(this.program.slice(), injection))
        return programOutput[0] === this.desiredFindValue
      }
      catch (e) {
        // I don't actually care about errors here
      }
    })

    if (validIndex >= 0) {
      return possibleInjections[validIndex].map((injection) => ({ address: injection[0], value: injection[1] }))
    }
    else {
      return null
    }
  }
}
