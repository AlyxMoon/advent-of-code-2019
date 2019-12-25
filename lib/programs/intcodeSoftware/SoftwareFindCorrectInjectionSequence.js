const { generatePermutationsForInjections } = require('../../util')

class SoftwareFindCorrectInjectionSequence {
  #desiredValue
  #injectionRange
  #program

  constructor ({ desiredValue, injectionRange, program } = {}) {
    if (desiredValue || desiredValue === 0) this.setDesiredValue(desiredValue)
    if (injectionRange) this.setInjectionRange(injectionRange)
    if (program) this.setProgram(program)
  }

  getInjectionRange () {
    return this.#injectionRange.map(injection => Object.assign({}, injection))
  }

  setInjectionRange (injections = []) {
    if (!this._isValidInjectionRange(injections)) {
      throw new Error(`Invalid injections provided to Software: ${injections}`)
    }

    this.#injectionRange = injections.map(injection => Object.assign({}, injection))
    return this
  }

  clearInjectionRange () {
    this.#injectionRange = []
    return this
  }

  getDesiredValue () {
    return this.#desiredValue
  }

  setDesiredValue (value) {
    if (!this._isValidDesiredValue(value)) {
      throw new Error(`Invalid desired value passed to Software: ${value}`)
    }

    this.#desiredValue = value
    return this
  }

  clearDesiredValue () {
    this.#desiredValue = 0
    return this
  }

  setProgram (program = []) {
    if (!this._isValidProgram(program)) {
      throw new Error(`Invalid program provided to Software: ${program}`)
    }

    this.#program = program.slice()
    return this
  }

  сlearProgram () {
    this.#program = []
    return this
  }

  run (computer) {
    if (
      !this._isValidInjectionRange(this.#injectionRange) ||
      !this._isValidDesiredValue(this.#desiredValue) ||
      !this._isValidProgram(this.#program)
    ) {
      throw new Error('Attempted to run Find Correct Injection Sequence software with invalid arguments set')
    }

    if (!computer || !computer.constructor || computer.constructor.name !== 'IntcodeComputer') {
      throw new Error('Attempted to run Find Correct Injection Sequence software on an invalid IntcodeComputer instance')
    }

    const processPID = computer.createProcess({ program: this.#program })
    const process = computer.getProcess(processPID)

    const possibleInjections = generatePermutationsForInjections(this.#injectionRange)

    const successfulInjection = possibleInjections.find(injections => {
      try {
        const programState = process.setInjections(injections).run().getProgramState()
        process.resetProgramState()

        return programState.program[0] === this.#desiredValue
      }
      catch (e) {} // I don't actually care about errors here
    }) || []

    computer.deleteProcess(processPID)

    return successfulInjection.length > 0
      ? successfulInjection.map((injection) => ({ address: injection[0], value: injection[1] }))
      : null
  }

  _isValidInjectionRange (injections = []) {
    return (
      Array.isArray(injections) &&
      injections.length > 0 &&
      injections.every(injection => (
        'address' in injection && injection.address >= 0 &&
        'min' in injection && Number.isInteger(injection.min) &&
        'max' in injection && Number.isInteger(injection.max) &&
        injection.min <= injection.max
      ))
    )
  }

  _isValidDesiredValue (value) {
    return (
      Number.isInteger(value)
    )
  }

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }
}

module.exports = {
  SoftwareFindCorrectInjectionSequence,
}
