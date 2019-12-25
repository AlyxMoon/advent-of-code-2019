import {
  COMMANDS,
  MODES,
  PROGRAM_STATES,
  fillMemoryToAddress,
  parseInstruction,
} from './_intcode_helpers.js'

export class IntcodeProcess {
  #inputs
  #injections
  #program
  #programFlags
  #programState
  #commands

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
      pauseOnWrite: false,
      pauseOnInput: false,
      maxLinesBeforeError: 1000000,
    }
  }

  setProgramFlags (programFlags = {}) {
    const flags = [
      'pauseOnWrite',
      'pauseOnInput',
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
      statusCode: PROGRAM_STATES.RUNNING,
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
      statusCode: this.#programState.statusCode,
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

  getAndClearOutputs () {
    return (
      this.#programState &&
      this.#programState.writeOutputs
    ) ? this.#programState.writeOutputs.splice(0, this.#programState.writeOutputs.length) : []
  }

  getCurrentStatusCode () {
    return (this.#programState && this.#programState.statusCode) || 0
  }

  isProgramFinished () {
    return this.#programState && this.#programState.statusCode === PROGRAM_STATES.FINISHED
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

  addToInputs (input, clearExisting = false) {
    if (!Number.isInteger(input)) {
      throw new Error(`Invalid user input provided: ${input}`)
    }

    if (clearExisting) {
      this.#inputs = []
      if (this.#programState) this.#programState.inputs = []
      this.#programState.inputsIndex = 0
    }

    this.#inputs.push(input)
    if (this.#programState) {
      this.#programState.inputs.push(input)
      this.#programState.statusCode = PROGRAM_STATES.RECIEVED_INPUT
    }

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
      const { opcode, modes } = parseInstruction(program[i])

      if ([COMMANDS.WRITE, COMMANDS.READ, COMMANDS.REL_OFFSET].includes(opcode)) modes.splice(1, 2)
      if ([COMMANDS.JUMP_T, COMMANDS.JUMP_F].includes(opcode)) modes.splice(2, 1)
      if ([COMMANDS.BREAK].includes(opcode)) modes.splice(0, 3)

      const inputIndexes = modes.map((p, j) => {
        if (p === MODES.POSITION) return program[i + j + 1]
        if (p === MODES.IMMEDIATE) return i + j + 1
        if (p === MODES.RELATIVE) return this.#programState.relativeIndex + program[i + j + 1]
      })

      inputIndexes.forEach(index => fillMemoryToAddress(program, index))

      if (opcode === COMMANDS.BREAK) {
        this.#programState.statusCode = PROGRAM_STATES.FINISHED
        this.#programState.linesRead++
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
        if (this.#programFlags.pauseOnInput && this.#programState.statusCode !== PROGRAM_STATES.RECIEVED_INPUT) {
          this.#programState.statusCode = PROGRAM_STATES.WAIT_ON_INPUT
          break
        }

        program[inputIndexes[0]] = this._retrieveUserInput()
        this.#programState.index += 2
      }

      else if (opcode === COMMANDS.WRITE) {
        this.#programState.writeOutputs.push(program[inputIndexes[0]])
        this.#programState.index += 2

        if (this.#programFlags.pauseOnWrite) {
          this.#programState.statusCode = PROGRAM_STATES.PAUSED_ON_OUTPUT
          break
        }
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

      else {
        this.#programState.statusCode = PROGRAM_STATES.ERROR
        throw new Error(`Unrecognized intcode opcode!: ${opcode}`)
      }

      if (this.#programState.linesRead > this.#programFlags.maxLinesBeforeError) {
        throw new Error('Intcode Runtime Error. Max lines reached. Potential infinite loop.')
      }

      this.#programState.statusCode = PROGRAM_STATES.RUNNING
    }

    if (this.#programState.index >= program.length) {
      this.#programState.statusCode = PROGRAM_STATES.FINISHED
    }

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
    console.log(this.#programState.inputsIndex, this.#programState.inputs)
    return this.#programState.inputs[this.#programState.inputsIndex++]
  }

  _isValidProgram (program) {
    if (Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)) {
      return true
    }
    else {
      console.log('===== yo we broke', program.findIndex(num => !Number.isInteger(num)))
      console.log(JSON.stringify(program))
      return false
    }
  }
}
