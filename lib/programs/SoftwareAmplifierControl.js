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

  // Allows either [0,4] OR [5,9]
  isValidPhaseRange (range) {
    return range && Array.isArray(range) && range.length === 2 && range.every(Number.isInteger) &&
      (range.every(num => num >= 0 && num <= 4) || range.every(num => num >= 5 && num <= 9))
  }

  setPhaseRange (range = []) {
    if (!this.isValidPhaseRange(range)) throw new Error(`Invalid range passed to setPhaseRange: ${range}`)
    this.phaseRange = range.slice()
  }

  clearPhaseSequence () { this.phaseSequence = [] }

  // Allows either [combination between 0-4] OR [combination between 5-9]
  isValidPhaseSequence (sequence) {
    return sequence && Array.isArray(sequence) && sequence.length > 0 && sequence.every(Number.isInteger) &&
      (sequence.every(num => num >= 0 && num <= 4) || sequence.every(num => num >= 5 && num <= 9))
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

    const originalProgram = computer.getProgram()
    const originalMode = computer.getMode()
    let returnVal = 0

    // Only run a single instance of program if phaseSequence has been provided. Ignore phaseRange input
    if (this.phaseSequence) {
      if (this.amplifierCount !== this.phaseSequence.length) throw new Error('amplifier count and phase sequence length do not match')

      if (this.phaseSequence.every(phase => phase >= 0 && phase <= 4)) {
        computer.setMode(IntcodeProgramMode.DIAGNOSTIC)
        returnVal = this._runGivenSequence(computer, this.phaseSequence)
      }

      if (this.phaseSequence.every(phase => phase >= 5 && phase <= 9)) {
        computer.setMode(IntcodeProgramMode.EXIT_ON_OUTPUT)
        returnVal = this._runGivenSequence(computer, this.phaseSequence, true)
      }
    }

    // Run through all permutations of given phase range and give greatest value
    else {
      computer.setMode(IntcodeProgramMode.DIAGNOSTIC)

      returnVal = generateUniqueValueArrayOfPermutations(this.amplifierCount, this.phaseRange[0], this.phaseRange[1])
        .reduce((greatest, sequence) => Math.max(greatest, this._runGivenSequence(computer, sequence)), 0)
    }

    computer.setProgram(originalProgram).setMode(originalMode).clearUserInput()
    return returnVal
  }

  _runGivenSequence (computer, sequence = [], feedbackMode = false) {
    if (!feedbackMode) {
      return sequence.reduce((result, input, i) => {
        return (computer.setUserInput([input, result]).run())[0]
      }, 0)
    }
    else {
      const amplifiersProgram = Array(sequence.length).fill(computer.getProgram())
      const amplifiersIndex = Array(sequence.length).fill(0)
      const amplifiersOutput = Array(sequence.length).fill(0)
      const amplifiersInput = sequence.map(sequence => [sequence])
      amplifiersInput[0].push(0)

      let emergencyExit = 0
      for (let i = 0; amplifiersIndex.some(index => index > -1); i = i === amplifiersIndex.length - 1 ? 0 : i + 1) {
      // for (let i = 0, j = 0; j < sequence.length * 2; j++, i = i === amplifiersIndex.length - 1 ? 0 : i + 1) {
        const nextAmplifierIndex = i === amplifiersIndex.length - 1 ? 0 : i + 1

        const programResult = amplifiersIndex[i] > -1
          ? computer
            .setProgram(amplifiersProgram[i])
            .setProgramStartIndex(amplifiersIndex[i])
            .setUserInput(amplifiersInput[i].splice(0, amplifiersInput[i].length))
            .run()
          : ({ index: -1, output: amplifiersOutput[i] })
        if (!(amplifiersIndex[i] > -1)) console.log(i, programResult)

        amplifiersProgram[i] = programResult.program
        amplifiersIndex[i] = programResult.index
        console.log(i, 'hmm?', programResult.output === undefined, amplifiersOutput[i], programResult.output)
        amplifiersOutput[i] = programResult.output === undefined ? amplifiersOutput[i] : programResult.output
        console.log(amplifiersOutput[i])

        amplifiersInput[nextAmplifierIndex].push(programResult.output)

        // console.log(i, amplifiersProgram[i])
        // console.log('pushed input to index:', i === amplifiersIndex.length - 1 ? 0 : i + 1, amplifiersInput[i === amplifiersIndex.length - 1 ? 0 : i + 1])
        console.log(i, amplifiersIndex, amplifiersOutput)
        console.log(programResult.program)
        console.log('===============')
        if (emergencyExit++ > 5000) throw new Error('TOO MANY DUDE')
      }

      console.log('exited successfully?', emergencyExit)
      process.exit()
      return amplifiersOutput
    }
  }
}
