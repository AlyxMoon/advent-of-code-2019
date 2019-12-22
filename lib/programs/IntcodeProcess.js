import {
  COMMANDS,
  fillMemoryToAddress,
  parseInstruction,
} from './_intcode_helpers.js'

export class IntcodeProcess {
  #inputs
  #injections
  #program
  #programFlags
  #programState

  constructor (processArgs = {}) {
    if ('inputs' in processArgs) this.setInputs(processArgs.inputs)
    else this.#inputs = []

    if ('injections' in processArgs) this.setInjections(processArgs.injections)
    else this.#injections = []

    if ('program' in processArgs) this.setProgram(processArgs.program)
    else this.#program = []

    this.#programFlags = this.getDefaultProgramFlags()
    if ('flags' in processArgs) this.setProgramFlags(processArgs.flags)

    this.resetProgramState()
  }

  getDefaultProgramFlags () {
    return {
      pauseOnWriteSequence: false,
      maxLinesBeforeError: 100000,
    }
  }

  setProgramFlags (programFlags = {}) {
    const flags = [
      'pauseOnWriteSequence',
      'maxLinesBeforeError',
    ]

    flags.forEach(flag => {
      if (flag in programFlags) this.#programFlags[flag] = programFlags[flag]
    })

    return this
  }

  resetProgramState () {
    this.#programState = null
    return this
  }

  getDefaultProgramState () {
    return {
      program: this.#program.slice() || [],
      linesRead: 0,
      index: 0,
      relativeIndex: 0,
      finished: false,
      writeOutputs: [],
      inputs: this.#inputs.slice() || [],
      inputsIndex: 0,
    }
  }

  getProgramState () {
    return {
      program: this.#programState.program.slice(),
      linesRead: this.#programState.linesRead,
      index: this.#programState.index,
      relativeIndex: this.#programState.relativeIndex,
      finished: this.#programState.finished,
      writeOutputs: this.#programState.writeOutputs.slice(),
      inputs: this.#programState.inputs.slice(),
      inputsIndex: this.#programState.inputsIndex,
    }
  }

  getLastOutput () {
    return (
      this.#programState &&
      this.#programState.writeOutputs &&
      Number.isInteger(this.#programState.writeOutputs[this.#programState.writeOutputs.length - 1])
    ) ? this.#programState.writeOutputs[this.#programState.writeOutputs.length - 1] : null
  }

  isProgramFinished () {
    return this.#programState && this.#programState.finished
  }

  clearInputs () {
    this.#inputs = []
    return this
  }

  setInputs (inputs = []) {
    if (!Array.isArray(inputs) || inputs.length === 0 || !inputs.every(Number.isInteger)) {
      throw new Error(`Invalid user inputs array provided: ${inputs}`)
    }

    this.#inputs = inputs.slice()
    return this
  }

  addToInputs (input) {
    if (!Number.isInteger(input)) {
      throw new Error(`Invalid user input provided: ${input}`)
    }

    this.#inputs.push(input)
    if (this.#programState) this.#programState.inputs.push(input)

    return this
  }

  clearInjections () {
    this.#injections = []
    return this
  }

  setInjections (injections = []) {
    if (
      injections.length === 0 &&
      !injections.every(injection => injection.length === 2 && injection.every(Number.isInteger))
    ) {
      throw new Error(`Invalid injections applied on IntcodeComputer, should be in form [[address, value], ...]: ${injections}`)
    }

    this.#injections = injections.map(injection => injection.slice())
    return this
  }

  сlearProgram () {
    this.#program = []
    this.resetProgramState()
    return this
  }

  setProgram (program = []) {
    if (program.length < 2 || !program.every(Number.isInteger)) {
      throw new Error(`Invalid program set on IntcodeComputer, requires a minimum length of 2 and only integer values: ${program}`)
    }

    this.#program = program.slice()
    this.resetProgramState()
    return this
  }

  run () {
    if (!this.#programState) {
      this.#programState = this.getDefaultProgramState()
      this.#programState.program = this._injectCodeIntoProgram(this.#programState.program, this.#injections)
    }

    if (!this._isValidProgram(this.#programState.program)) {
      throw new Error('Cannot run program as an invalid program set has been provided')
    }

    const { program } = this.#programState
    for (
      let i = this.#programState.index;
      this.#programState.index < program.length;
      i = this.#programState.index, this.#programState.linesRead++
    ) {
      const { opcode, parameters } = parseInstruction(program[i])

      if ([3, 4, 9].includes(opcode)) parameters.splice(1, 2)
      if ([5, 6].includes(opcode)) parameters.splice(2, 1)
      if ([99].includes(opcode)) parameters.splice(0, 3)

      const inputIndexes = parameters.map((p, j) => {
        if (p === 0) return program[i + j + 1]
        if (p === 1) return i + j + 1
        if (p === 2) return this.#programState.relativeIndex + program[i + 1]
      })

      inputIndexes.forEach(index => fillMemoryToAddress(program, index))

      if (opcode === COMMANDS.BREAK) {
        this.#programState.finished = true
        break
      }

      else if (opcode === COMMANDS.ADD) {
        program[inputIndexes[2]] = program[inputIndexes[0]] + program[inputIndexes[1]]
        this.#programState.index += 4
      }

      else if (opcode === COMMANDS.MULT) {
        program[inputIndexes[2]] = program[inputIndexes[0]] * program[inputIndexes[1]]
        this.#programState.index += 4
      }

      else if (opcode === COMMANDS.READ) {
        program[inputIndexes[0]] = this._retrieveUserInput()
        this.#programState.index += 2
      }

      else if (opcode === COMMANDS.WRITE) {
        this.#programState.writeOutputs.push(program[inputIndexes[0]])
        this.#programState.index += 2

        if (this.#programFlags.pauseOnWriteSequence) break
      }

      else if (opcode === COMMANDS.JUMP_T) {
        this.#programState.index = program[inputIndexes[0]] ? program[inputIndexes[1]] : (this.#programState.index + 3)
      }

      else if (opcode === COMMANDS.JUMP_F) {
        this.#programState.index = !program[inputIndexes[0]] ? program[inputIndexes[1]] : (this.#programState.index + 3)
      }

      else if (opcode === COMMANDS.LESS_THAN) {
        program[inputIndexes[2]] = program[inputIndexes[0]] < program[inputIndexes[1]] ? 1 : 0
        this.#programState.index += 4
      }

      else if (opcode === COMMANDS.EQUAL_TO) {
        program[inputIndexes[2]] = program[inputIndexes[0]] === program[inputIndexes[1]] ? 1 : 0
        this.#programState.index += 4
      }

      else if (opcode === COMMANDS.REL_OFFSET) {
        this.#programState.relativeIndex += program[inputIndexes[0]]
        this.#programState.index += 2
      }

      else throw new Error(`Unrecognized intcode opcode!: ${opcode}`)

      if (this.#programState.linesRead > this.#programFlags.maxLinesBeforeError) {
        throw new Error('Intcode Runtime Error. Max lines reached. Potential infinite loop.')
      }
    }

    if (this.#programState.index >= program.length) this.#programState.finished = true

    this.#programState.program = program
    return this
  }

  _injectCodeIntoProgram (program = [], injections = []) {
    const retval = program.slice()
    injections.forEach(([address, value]) => { retval[address] = value })
    return retval
  }

  _retrieveUserInput () {
    // if (this.#programState.inputsIndex + 1 < this.#programState.inputs.length) {
    //   this.#programState.inputsIndex++
    // }
    return this.#programState.inputs[this.#programState.inputsIndex++]
  }

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }
}
