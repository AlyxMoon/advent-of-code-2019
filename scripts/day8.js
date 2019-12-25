const { readFile } = require('fs')
const { promisify } = require('util')

const {
  spaceImageFormatDecoder: decoder,
  spaceImageChecksum: checksum,
  spaceImageGenerator: generator,
} = require('../lib/programs/standalone/SpaceImageFormatDecoder')

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  return part === 1 ? checksum(decoder(25, 6, input)) : generator(decoder(25, 6, input), 25, 6)
}

module.exports = {
  run,
}
