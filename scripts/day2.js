import { readFile } from 'fs'
import { promisify } from 'util'

import { IntcodeComputer } from '../lib/programs/IntcodeComputer.js'
import { SoftwareFindCorrectInjectionSequence } from '../lib/programs/SoftwareFindCorrectInjectionSequence.js'

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split(',').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  if (part === 1) {
    const processOutput = (new IntcodeComputer()).createAndRunProcess({
      program: input, injections: [[1, 12], [2, 2]],
    })
    return processOutput.program[0]
  }

  if (part === 2) {
    // TODO Add 'SoftwareFindCorrectInjectionSequence'
    const softwareOutput = (new IntcodeComputer()).runSoftware({
      software: SoftwareFindCorrectInjectionSequence,
      softwareArgs: {
        desiredValue: 19690720,
        injectionRange: [{ address: 1, min: 0, max: 99 }, { address: 2, min: 0, max: 99 }],
        program: input,
      },
    })
    return softwareOutput ? 100 * softwareOutput[0].value + softwareOutput[1].value : 'No value found!'
  }
}
