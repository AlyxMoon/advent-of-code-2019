const { readFile } = require('fs')
const { promisify } = require('util')

const {
  calculateVectorAtNthStep,
  getTotalEnergyFromMoons,
  findFirstRepeatVector,
} = require('../lib/programs/standalone/MoonPositionSimulator')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8')).split('\n')
      .map(line => line.replace(/[<>xyz=]|\s/g, '').split(',').map(Number))
      .map(pos => ({ pos: { x: pos[0], y: pos[1], z: pos[2] } }))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  if (part === 1) {
    return getTotalEnergyFromMoons(calculateVectorAtNthStep(input, 1000))
  }
  if (part === 2) {
    return findFirstRepeatVector(input)
  }
}

module.exports = {
  run,
}
