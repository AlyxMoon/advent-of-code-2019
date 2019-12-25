const { readFile } = require('fs')
const { promisify } = require('util')

const { OrbitMap } = require('../lib/programs/standalone/OrbitMap')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split('\n').map(string => string.trim())
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  const orbitalMap = new OrbitMap().setMap(input)

  return part === 1 ? orbitalMap.checksumMap() : orbitalMap.distanceToSanta()
}

module.exports = {
  run,
}
