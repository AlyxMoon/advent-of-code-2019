const { readFile } = require('fs')
const { promisify } = require('util')

const { IntcodeComputer } = require('../lib/programs/IntcodeComputer')

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
  const computer = new IntcodeComputer()

  const processOutput = computer.createAndRunProcess({
    program: input, inputs: [part],
  })

  return processOutput.writeOutputs[0]
}

module.exports = {
  run,
}
