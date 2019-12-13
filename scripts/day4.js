import { readFile } from 'fs'
import { promisify } from 'util'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split('-').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const hasAdjacentDigits = (number = 0, limitTwoDigits = false, previousDigit = -1) => {
  const [number1, number2] = [Math.floor(number / 10), Math.floor(number / 100)]
  const [modN, modN1, modN2] = [number % 10, number1 % 10, number2 % 10]
  return number > 9 && (
    limitTwoDigits
      ? modN === modN1 && modN !== previousDigit
        ? modN !== modN2 || hasAdjacentDigits(number2, limitTwoDigits, modN1)
        : hasAdjacentDigits(number1, limitTwoDigits, modN)
      : modN === modN1 || hasAdjacentDigits(number1)
  )
}

const hasEqualOrAscendingDigits = (number = 0) => {
  const cutNumber = Math.floor(number / 10)
  return number < 9 || (
    (number % 10 >= cutNumber % 10) &&
    hasEqualOrAscendingDigits(cutNumber)
  )
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const [rangeMin, rangeMax] = await parseInputFile(inputPath)

  return [...Array(rangeMax - rangeMin + 1)]
    .map((_, i) => rangeMin + i)
    .reduce((sum, i) => sum + (hasEqualOrAscendingDigits(i) && hasAdjacentDigits(i, part !== 1) ? 1 : 0), 0)
}
