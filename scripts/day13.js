const { readFile } = require('fs')
const { promisify } = require('util')

const { IntcodeComputer } = require('../lib/programs/IntcodeComputer')
const { SoftwareArcadeCabinet } = require('../lib/programs/intcodeSoftware/SoftwareArcadeCabinet')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => Number(string.trim()))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1, watchOutput = false }) => {
  const input = await parseInputFile(inputPath)
  const runtimeArguments = {
    software: SoftwareArcadeCabinet,
    softwareArgs: {
      program: input,
      onlyGetBlocks: part === 1,
      watchOutput,
    },
  }

  return new IntcodeComputer().runSoftware(runtimeArguments)
}

module.exports = {
  run,
}
