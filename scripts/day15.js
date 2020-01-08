const { readFile } = require('fs')
const { promisify } = require('util')

const { RepairRobot } = require('../lib/programs/intcodeHardware/RepairRobot')

const loadInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await loadInputFile(inputPath)

  const robot = (new RepairRobot()).applyProgram(input)

  return robot.run()
}

module.exports = {
  run,
}
