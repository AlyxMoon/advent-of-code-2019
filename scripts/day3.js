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
      }))
  }
  catch (error) {
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

        const index = `${wireX},${wireY}`
        grid[index] = grid[index] || [0, 0]
        grid[index][wireIndex] = steps
      }
    })

    return grid
  }, { '0,0': [0, 0] })
}

const findShortestManhattenDistance = (grid) => {
  delete grid['0,0']
  return Object.entries(grid)
    .filter(([index, wiresTouched]) => wiresTouched[0] && wiresTouched[1])
    .map(([index, wiresTouched]) => index.split(','))
    .reduce((smallestDistance, [x, y]) => Math.min(smallestDistance, Math.abs(x) + Math.abs(y)), Infinity)
}

const findFewestCombinedWireSteps = (grid) => {
  return Object.values(grid)
    .filter(([wire1Steps, wire2Steps]) => wire1Steps && wire2Steps)
    .reduce((smallestDistance, [wire1Steps, wire2Steps]) => Math.min(smallestDistance, wire1Steps + wire2Steps), Infinity)
}

const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)
  const grid = buildWireGrid(input)
  const output = part === 1 ? findShortestManhattenDistance(grid) : findFewestCombinedWireSteps(grid)

  return output
}

module.exports = {
  run,
}
