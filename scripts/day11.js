const { readFile } = require('fs')
const { promisify } = require('util')

const { HullPainterRobot } = require('../lib/programs/intcodeHardware/HullPainterRobot')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)
  const robot = (new HullPainterRobot()).applyProgram(input)

  if (part === 1) {
    return robot.run().getPainted()
  }
  if (part === 2) {
    return robot.run({ startPanel: 1 }).getPanelGrid()
  }
}

module.exports = {
  run,
}
