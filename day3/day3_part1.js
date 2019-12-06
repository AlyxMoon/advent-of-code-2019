const { readFile } = require('fs')
const { promisify } = require('util')

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

    path.forEach(([[dx, dy], cellsTravelled]) => {
      for (let i = 1; i <= cellsTravelled; i++) {
        [wireX, wireY] = [wireX + dx, wireY + dy]

        let index = `${wireX},${wireY}`
        grid[index] = grid[index] || [false, false]
        grid[index][wireIndex] = true
      }
    })

    return grid
  }, { '0,0': [true, true] })
}

const findShortestManhattenDistance = (grid) => {
  delete grid['0,0']
  return Object.entries(grid)
    .filter(([index, wiresTouched]) => wiresTouched[0] && wiresTouched[1])
    .map(([index, wiresTouched]) => index.split(','))
    .reduce((smallestDistance, [x, y]) => Math.min(smallestDistance, Math.abs(x) + Math.abs(y)), Infinity)
}

const main = async () => {
  try {
    const inputFilePath = process.argv[2] || 'input.txt'
    const input = await parseInputFile(inputFilePath)
    const grid = buildWireGrid(input)
    const output = findShortestManhattenDistance(grid)
    console.log(output)
  } catch (error) {
    console.error('BIG OL ERROR: ', error.message)
    process.exit()
  }
}

main()
