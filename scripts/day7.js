const { readFile } = require('fs')
const { promisify } = require('util')

const { IntcodeComputer } = require('../lib/programs/IntcodeComputer')
const { SoftwareAmplifierControl } = require('../lib/programs/intcodeSoftware/SoftwareAmplifierControl')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => Number(string.trim()))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)
  const runtimeArguments = {
    software: SoftwareAmplifierControl,
    softwareArgs: {
      amplifierCount: 5,
      phaseRange: part === 1 ? [0, 4] : [5, 9],
      program: input,
    },
  }

  return (new IntcodeComputer()).runSoftware(runtimeArguments)
}

module.exports = {
  run,
}
