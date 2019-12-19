
export class IntcodeComputer {
  #processes
  #processCount
  #nextPID

  constructor () {
    this.#processes = {}
    this.#processCount = 0
    this.#nextPID = 0
  }

  createProcess (processArgs = {}) {
    const newProcess = new IntcodeProcess(processArgs)
    if (newProcess) {
      this.#processCount++
      this.#processes[++this.#nextPID] = newProcess
    }

    return this.#nextPID
  }

  getProcess (pid = 0) {
    return this.#processes[pid]
  }

  getProcessCount () {
    return this.#processCount
  }

  runProcess (pid = 0) {
    return this.#processes[pid].run()
  }

  deleteProcess (pid = -1) {
    const didDelete = delete this.#processes[pid]
    this.#processCount -= didDelete ? 1 : 0

    return didDelete
  }

  createAndRunProcess (processArgs = {}) {
    const processPID = this.createProcess(processArgs)
    const result = this.getProcess(processPID).run().getProgramState()
    this.deleteProcess(processPID)
    return result
  }

  runSoftware ({ software: Software, softwareArgs = {} } = {}) {
    if (Software) {
      // Try to see if new can be called, i.e. is a class
      if (!Software.constructor) throw new Error('Invalid software passed to Intcode Computer')

      return new Software(softwareArgs).run(this)
    }
  }
}

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

    if ('flags' in processArgs) this.setProgramFlags(processArgs.flags)
    else this.#programFlags = this.getDefaultProgramFlags()

    this.resetProgramState()
  }

  getDefaultProgramFlags () {
    return {
      pauseOnWriteSequence: false,
    }
  }

  setProgramFlags (programFlags) {
    if ('pauseOnWriteSequence' in programFlags) this.#programFlags.pauseOnWriteSequence = programFlags.pauseOnWriteSequence

    return this
  }

  resetProgramState () {
    this.#programState = null
    return this
  }

  getDefaultProgramState () {
    return {
      program: this.#program.slice() || [],
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
    let line = 0
    for (let i = this.#programState.index; this.#programState.index < program.length; i = this.#programState.index, line++) {
      const { opcode, parameters } = this._parseInstruction(program[i])

      if ([3, 4, 9].includes(opcode)) parameters.splice(1, 2)
      if ([5, 6].includes(opcode)) parameters.splice(2, 1)
      if ([99].includes(opcode)) parameters.splice(0, 3)

      const inputIndexes = parameters.map((p, j) => {
        if (p === 0) return program[i + j + 1]
        if (p === 1) return i + j + 1
        if (p === 2) return this.#programState.relativeIndex + program[i + 1]
      })

      console.log(line, i, '|', opcode, parameters, inputIndexes)
      console.log('===', inputIndexes.map(index => program[index]))

      inputIndexes.forEach(index => this._fillInMemoryIfIndexOutOfBounds(program, index))

      if (opcode === 99) {
        this.#programState.finished = true
        break
      }

      // Add
      else if (opcode === 1) {
        program[inputIndexes[2]] = program[inputIndexes[0]] + program[inputIndexes[1]]
        this.#programState.index += 4
      }

      // Multiply
      else if (opcode === 2) {
        program[inputIndexes[2]] = program[inputIndexes[0]] * program[inputIndexes[1]]
        this.#programState.index += 4
      }

      // Input
      else if (opcode === 3) {
        program[inputIndexes[0]] = this.#programState.inputs[this.#programState.inputsIndex++]

        this.#programState.index += 2
      }

      // Output
      else if (opcode === 4) {
        this.#programState.writeOutputs.push(program[inputIndexes[0]])
        this.#programState.index += 2

        if (this.#programFlags.pauseOnWriteSequence) break
      }

      // Jump if true
      else if (opcode === 5) {
        this.#programState.index = program[inputIndexes[0]] ? program[inputIndexes[1]] : (this.#programState.index + 3)
      }

      // Jump if false
      else if (opcode === 6) {
        this.#programState.index = !program[inputIndexes[0]] ? program[inputIndexes[1]] : (this.#programState.index + 3)
      }

      // Less than comparison
      else if (opcode === 7) {
        program[inputIndexes[2]] = program[inputIndexes[0]] < program[inputIndexes[1]] ? 1 : 0
        this.#programState.index += 4
      }

      // Equal to comparison
      else if (opcode === 8) {
        program[inputIndexes[2]] = program[inputIndexes[0]] === program[inputIndexes[1]] ? 1 : 0
        this.#programState.index += 4
      }

      else if (opcode === 9) {
        this.#programState.relativeIndex += program[inputIndexes[0]]
        this.#programState.index += 2
      }

      else throw new Error(`Unrecognized intcode opcode!: ${opcode}`)
    }

    if (this.#programState.index >= program.length) this.#programState.finished = true

    this.#programState.program = program
    return this
  }

  _fillInMemoryIfIndexOutOfBounds (program, index) {
    if (index >= program.length) {
      program.push(...Array(index - program.length + 1).fill(0))
    }
  }

  _injectCodeIntoProgram (program = [], injections = []) {
    const retval = program.slice()
    injections.forEach(([address, value]) => { retval[address] = value })
    return retval
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

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }
}
