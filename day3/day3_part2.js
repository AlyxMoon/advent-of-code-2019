import { readFile } from 'fs'
import { promisify } from 'util'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split('\n')
      .map(line => line.trim().split(','))
      .map(wire => wire.map(path => {
        let [dx, dy] = [0, 0]
        if (path[0] === 'U') dy = 1
        if (path[0] === 'D') dy = -1
        if (path[0] === 'L') dx = -1
        if (path[0] === 'R') dx = 1
        return [[dx, dy], parseInt(path.slice(1), 10)]
      } ))
  } catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const buildWireGrid = (wirePaths) => {
  return wirePaths.reduce((grid, path, wireIndex) => {
    let [wireX, wireY] = [0, 0]
    let steps = 0
    path.forEach(([[dx, dy], cellsTravelled]) => {
      for (let i = 1; i <= cellsTravelled; i++) {
        [wireX, wireY] = [wireX + dx, wireY + dy]
        steps += 1

        let index = `${wireX},${wireY}`
        grid[index] = grid[index] || [0, 0]
        grid[index][wireIndex] = steps
      }
    })

    return grid
  }, { '0,0': [0, 0] })
}

const findFewestCombinedWireSteps = (grid) => {
  return Object.values(grid)
    .filter(([wire1Steps, wire2Steps]) => wire1Steps && wire2Steps)
    .reduce((smallestDistance, [wire1Steps, wire2Steps]) => Math.min(smallestDistance, wire1Steps + wire2Steps), Infinity)
}

const main = async () => {
  try {
    const inputFilePath = process.argv[2] || join(__dirname, './input.txt')
    const input = await parseInputFile(inputFilePath)
    const grid = buildWireGrid(input)
    const output = findFewestCombinedWireSteps(grid)
    console.log(output)
  } catch (error) {
    console.error('BIG OL ERROR: ', error.message)
    process.exit()
  }
}

main()
