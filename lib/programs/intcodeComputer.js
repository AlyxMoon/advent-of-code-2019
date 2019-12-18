
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
    this.#processCount += didDelete ? 1 : 0

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

  resetProgramState () {
    this.#programState = null
    return this
  }

  getDefaultProgramState () {
    return {
      program: this.#program.slice() || [],
      index: 0,
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
      finished: this.#programState.finished,
      writeOutputs: this.#programState.writeOutputs.slice(),
      inputs: this.#programState.inputs.slice(),
      inputsIndex: this.#program.inputsIndex,
    }
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
    this.#programState.#inputs.push(input)
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
    for (let i = this.#programState.index; this.#programState.index < program.length; i = this.#programState.index) {
      const { opcode, parameters } = this._parseInstruction(program[i])
      const [input1, input2, outputIndex] = [
        parameters[0] ? program[i + 1] : program[program[i + 1]],
        parameters[1] ? program[i + 2] : program[program[i + 2]],
        [3, 4].includes(opcode) ? program[i + 1] : program[i + 3],
      ]

      if (opcode === 99) {
        this.#programState.finished = true
        break
      }

      // Add
      else if (opcode === 1) {
        program[outputIndex] = input1 + input2
        this.#programState.index += 4
      }

      // Multiply
      else if (opcode === 2) {
        program[outputIndex] = input1 * input2
        this.#programState.index += 4
      }

      // Input
      else if (opcode === 3) {
        program[outputIndex] = this.#programState.inputs[this.#programState.inputsIndex++]
        this.#programState.index += 2
      }

      // Output
      else if (opcode === 4) {
        this.#programState.writeOutputs.push(program[outputIndex])
        this.#programState.index += 2

        if (this.#programFlags.pauseOnWriteSequence) break
      }

      // Jump if true
      else if (opcode === 5) {
        this.#programState.index = input1 ? input2 : (this.#programState.index + 3)
      }

      // Jump if false
      else if (opcode === 6) {
        this.#programState.index = !input1 ? input2 : (this.#programState.index + 3)
      }

      // Less than comparison
      else if (opcode === 7) {
        program[outputIndex] = input1 < input2 ? 1 : 0
        this.#programState.index += 4
      }

      // Equal to comparison
      else if (opcode === 8) {
        program[outputIndex] = input1 === input2 ? 1 : 0
        this.#programState.index += 4
      }

      else throw new Error(`Unrecognized intcode opcode!: ${opcode}`)
    }

    this.#programState.program = program
    return this
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
