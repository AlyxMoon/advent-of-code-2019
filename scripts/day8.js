import { readFile } from 'fs'
import { promisify } from 'util'

import {
  spaceImageFormatDecoder as decoder,
  spaceImageChecksum as checksum,
  spaceImageGenerator as generator,
} from '../lib/programs/standalone/SpaceImageFormatDecoder.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  return part === 1 ? checksum(decoder(25, 6, input)) : generator(decoder(25, 6, input), 25, 6)
}
