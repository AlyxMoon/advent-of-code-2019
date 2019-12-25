import { readFile } from 'fs'
import { promisify } from 'util'

import { IntcodeComputer } from '../lib/programs/IntcodeComputer.js'
import { SoftwareArcadeCabinet } from '../lib/programs/intcodeSoftware/SoftwareArcadeCabinet.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => Number(string.trim()))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)
  const runtimeArguments = {
    software: SoftwareArcadeCabinet,
    softwareArgs: { program: input },
  }

  return (new IntcodeComputer()).runSoftware(runtimeArguments)
}
