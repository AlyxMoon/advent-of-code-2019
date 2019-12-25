const { readFile } = require('fs')
const { promisify } = require('util')

const {
  findBestLocation,
  fireTheLaserBeam,
} = require('../lib/programs/standalone/MonitoringStationLocationFinder')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split('\n').map(string => string.trim().split(''))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  if (part === 1) {
    return (findBestLocation(input) || [])[0]
  }
  if (part === 2) {
    const result = fireTheLaserBeam(input, 200)
    return result[0] * 100 + result[1]
  }
}

module.exports = {
  run,
}
