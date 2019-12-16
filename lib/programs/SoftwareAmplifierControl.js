import { generateUniqueValueArrayOfPermutations } from '../util.js'
import { IntcodeProgramMode } from './IntcodeComputer.js'

export class SoftwareAmplifierControl {
  constructor ({ amplifierCount, phaseRange, phaseSequence } = {}) {
    if (amplifierCount) this.setAmplifierCount(amplifierCount)
    if (phaseRange) this.setPhaseRange(phaseRange)
    if (phaseSequence) this.setPhaseSequence(phaseSequence)
  }

  clearAmplifierCount () { this.amplifierCount = 0 }

  isValidAmplifierCount (count) {
    return count && Number.isInteger(count)
  }

  setAmplifierCount (count = 0) {
    if (!this.isValidAmplifierCount(count)) throw new Error(`Invalid count passed to setAmplifierCount: ${count}`)
    this.amplifierCount = count
  }

  clearPhaseRange () { this.phaseRange = [] }

  isValidPhaseRange (range) {
    return range && Array.isArray(range) && range.length === 2 && range.every(Number.isInteger)
  }

  setPhaseRange (range = []) {
    if (!this.isValidPhaseRange(range)) throw new Error(`Invalid range passed to setPhaseRange: ${range}`)
    this.phaseRange = range.slice()
  }

  clearPhaseSequence () { this.phaseSequence = [] }

  isValidPhaseSequence (sequence) {
    return sequence || Array.isArray(sequence) || sequence.length > 0 || sequence.every(Number.isInteger)
  }

  setPhaseSequence (sequence = []) {
    if (!this.isValidPhaseSequence(sequence)) throw new Error(`Invalid sequence passed to setPhaseSequence: ${sequence}`)
    this.phaseSequence = sequence.slice()
  }

  run (computer) {
    if (
      !this.isValidAmplifierCount(this.amplifierCount) ||
      (!this.isValidPhaseRange(this.phaseRange) && !this.isValidPhaseSequence(this.phaseSequence))
    ) throw new Error('Attempted to run Amplifier Control software with invalid arguments set')

    if (!computer || !computer.constructor || computer.constructor.name !== 'IntcodeComputer') {
      throw new Error('Attempted to run Amplifier Control software on an invalid IntcodeComputer instance')
    }

    const originalMode = computer.setMode(IntcodeProgramMode.DIAGNOSTIC).getMode()
    let returnVal = 0

    // Only run a single instance of program if phaseSequence has been provided. Ignore phaseRange input
    if (this.phaseSequence) {
      if (this.amplifierCount !== this.phaseSequence.length) throw new Error('amplifier count and phase sequence length do not match')
      returnVal = this._runGivenSequence(computer, this.phaseSequence)
    }

    // Run through all permutations of given phase range and give greatest value
    else {
      returnVal = generateUniqueValueArrayOfPermutations(this.amplifierCount, this.phaseRange[0], this.phaseRange[1])
        .reduce((greatest, sequence) => Math.max(greatest, this._runGivenSequence(computer, sequence)), 0)
    }

    computer.setMode(originalMode).clearUserInput()
    return returnVal
  }

  _runGivenSequence (computer, sequence = []) {
    return sequence.reduce((result, input, i) => {
      return (computer.setUserInput([input, result]).run())[0]
    }, 0)
  }
}
