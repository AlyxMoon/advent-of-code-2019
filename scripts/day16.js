const { readFile } = require('fs')
const { promisify } = require('util')

const {
  flawedFrequencyTransmission,
  parseInput,
} = require('../lib/programs/standalone/FlawedFrequencyTransmission')

const loadInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = parseInput(
    (await loadInputFile(inputPath)).repeat(part === 1 ? 1 : 10000),
  )
  const useOffset = part === 2
  return flawedFrequencyTransmission(input, 100, useOffset)
}

module.exports = {
  run,
}
