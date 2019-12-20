import { generateUniqueValueArrayOfPermutations } from '../../util.js'

export class SoftwareAmplifierControl {
  #amplifierCount
  #phaseRange
  #phaseSequence
  #program

  constructor ({ amplifierCount, phaseRange, phaseSequence, program } = {}) {
    if (amplifierCount) this.setAmplifierCount(amplifierCount)
    if (phaseRange) this.setPhaseRange(phaseRange)
    if (phaseSequence) this.setPhaseSequence(phaseSequence)
    if (program) this.setProgram(program)
  }

  clearAmplifierCount () {
    this.#amplifierCount = 0
  }

  setAmplifierCount (count = 0) {
    if (!this._isValidAmplifierCount(count)) {
      throw new Error(`Invalid count passed to setAmplifierCount: ${count}`)
    }

    this.#amplifierCount = count
  }

  clearPhaseRange () {
    this.#phaseRange = []
  }

  setPhaseRange (range = []) {
    if (!this._isValidPhaseRange(range)) {
      throw new Error(`Invalid range passed to setPhaseRange: ${range}`)
    }

    this.#phaseRange = range.slice()
  }

  clearPhaseSequence () {
    this.#phaseSequence = []
  }

  setPhaseSequence (sequence = []) {
    if (!this._isValidPhaseSequence(sequence)) {
      throw new Error(`Invalid sequence passed to setPhaseSequence: ${sequence}`)
    }

    this.#phaseSequence = sequence.slice()
  }

  сlearProgram () {
    this.#program = []
    return this
  }

  setProgram (program = []) {
    if (!this._isValidProgram(program)) {
      throw new Error(`Invalid program provided to Software: ${program}`)
    }

    this.#program = program.slice()
  }

  run (computer) {
    if (
      !this._isValidAmplifierCount(this.#amplifierCount) ||
      !(this._isValidPhaseRange(this.#phaseRange) || this._isValidPhaseSequence(this.#phaseSequence)) ||
      !this._isValidProgram(this.#program)
    ) throw new Error('Attempted to run Amplifier Control software with invalid arguments set')

    if (!computer || !computer.constructor || computer.constructor.name !== 'IntcodeComputer') {
      throw new Error('Attempted to run Amplifier Control software on an invalid IntcodeComputer instance')
    }

    const processPIDs = [...Array(this.#amplifierCount)].map((_) => computer.createProcess({
      program: this.#program,
    }))
    const processes = processPIDs.map((pid) => computer.getProcess(pid))

    let returnVal = 0

    // Only run a single instance of program if phaseSequence has been provided. Ignore phaseRange input
    if (this.#phaseSequence) {
      if (this.#amplifierCount !== this.#phaseSequence.length) throw new Error('amplifier count and phase sequence length do not match')
      processes.forEach((process, i) => process.setInputs([this.#phaseSequence[i]]))

      if (this.#phaseSequence.every(phase => phase >= 0 && phase <= 4)) {
        returnVal = this._runGivenSequence(processes, this.#phaseSequence)
      }

      if (this.#phaseSequence.every(phase => phase >= 5 && phase <= 9)) {
        processes.forEach(process => process.setProgramFlags({ pauseOnWriteSequence: true }))
        returnVal = this._runGivenSequence(processes, this.#phaseSequence, true)
      }
    }

    // Run through all permutations of given phase range and give greatest value
    else {
      const feedbackMode = this.#phaseRange[0] >= 5 && this.#phaseRange[1] <= 9
      if (feedbackMode) {
        processes.forEach(process => process.setProgramFlags({ pauseOnWriteSequence: true }))
      }

      returnVal = generateUniqueValueArrayOfPermutations(this.#amplifierCount, this.#phaseRange[0], this.#phaseRange[1])
        .reduce((greatest, sequence) => {
          processes.forEach((process, i) => process.resetProgramState().setInputs([sequence[i]]))

          const sequenceResult = this._runGivenSequence(processes, sequence, feedbackMode)

          return Math.max(greatest, sequenceResult)
        }, 0)
    }

    processPIDs.map((pid) => computer.deleteProcess(pid))
    return returnVal
  }

  _runGivenSequence (processes, sequence = [], feedbackMode = false) {
    if (!feedbackMode) {
      processes.forEach((process, i) => {
        if (i === 0) process.addToInputs(0)
        else process.addToInputs(processes[i - 1].getLastOutput())

        process.run()
      })
    }
    else {
      let firstIteration = true
      while (processes.some(process => !process.isProgramFinished())) {
        processes.forEach((process, i) => {
          const previousIndex = i === 0 ? processes.length - 1 : i - 1

          if (firstIteration && i === 0) {
            process.addToInputs(0)
            firstIteration = false
          }
          else {
            process.addToInputs(processes[previousIndex].getLastOutput())
          }

          if (!process.finished) process.run()
        })
      }
    }

    return processes[processes.length - 1].getLastOutput()
  }

  _isValidAmplifierCount (amplifierCount) {
    return Number.isInteger(amplifierCount) && amplifierCount > 0
  }

  _isValidPhaseRange (range) {
    return (
      Array.isArray(range) &&
      range.length === 2 &&
      range.every(Number.isInteger) &&
      (range.every(num => num >= 0 && num <= 4) || range.every(num => num >= 5 && num <= 9))
    )
  }

  _isValidPhaseSequence (sequence) {
    return (
      Array.isArray(sequence) &&
      sequence.length > 0 &&
      sequence.every(Number.isInteger) &&
      (sequence.every(num => num >= 0 && num <= 4) || sequence.every(num => num >= 5 && num <= 9))
    )
  }

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }
}
