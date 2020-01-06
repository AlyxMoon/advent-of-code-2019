const { readFile } = require('fs')
const { promisify } = require('util')

const { findMaxPossibleFuel, oreRequiredForFuel, parseInput } = require('../lib/programs/standalone/OreProcessingCalculator')

const loadInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = parseInput(await loadInputFile(inputPath))

  return part === 1
    ? oreRequiredForFuel(input)
    : findMaxPossibleFuel(input, 1000000000000)
}

module.exports = {
  run,
}
